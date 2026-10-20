/**
 * Process entry point.
 *
 * Configuration/module loading is intentionally dynamic so a missing
 * environment variable produces one clear message instead of an ESM stack
 * trace before the logger exists.
 */
async function bootstrap() {
  try {
    const [{ default: config }, { createContainer }, { createApp }, { logger }] =
      await Promise.all([
        import('./config/env.js'),
        import('./container.js'),
        import('./app.js'),
        import('./core/logger.js'),
      ]);

    const container = createContainer();
    const app = createApp(container);

    const server = app.listen(config.port, () => {
      logger.info(
        {
          port: config.port,
          environment: config.nodeEnv,
          apiPublicUrl: config.apiPublicUrl,
          frontendUrl: config.frontendUrl,
          socialProviders: config.socialProviders,
        },
        'NoFeeNikkah API listening'
      );
    });

    server.on('error', (error) => {
      logger.fatal({ err: error }, 'HTTP server error');
      process.exit(1);
    });

    // Keep stalled or malicious connections from holding resources indefinitely.
    server.requestTimeout = 30_000;
    server.headersTimeout = 35_000;

    // Opportunistic hygiene for expired sessions. The SQL migration also ships
    // a callable cleanup function for environments that prefer pg_cron.
    const cleanupTimer = setInterval(() => {
      container.services.session
        .cleanupExpired()
        .then((count) => {
          if (count > 0) logger.info({ count }, 'Removed expired sessions');
        })
        .catch((error) => logger.warn({ err: error }, 'Session cleanup failed'));
    }, 60 * 60 * 1000);
    cleanupTimer.unref();

    let shuttingDown = false;

    const shutdown = (signal, exitCode = 0) => {
      if (shuttingDown) return;
      shuttingDown = true;
      logger.info({ signal }, 'Shutting down API');

      clearInterval(cleanupTimer);

      const forceTimer = setTimeout(() => {
        logger.error('Forced shutdown after timeout');
        process.exit(exitCode || 1);
      }, 10_000);
      forceTimer.unref();

      server.close((error) => {
        clearTimeout(forceTimer);
        if (error) {
          logger.error({ err: error }, 'Error while closing HTTP server');
          process.exit(1);
        }
        process.exit(exitCode);
      });
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('unhandledRejection', (reason) => {
      logger.fatal({ err: reason }, 'Unhandled promise rejection');
      shutdown('unhandledRejection', 1);
    });
    process.on('uncaughtException', (error) => {
      logger.fatal({ err: error }, 'Uncaught exception');
      shutdown('uncaughtException', 1);
    });
  } catch (error) {
    // The structured logger may not exist yet (for example, invalid config).
    console.error('[nofeenikkah-api] Startup failed:', error.message);
    if (error.details) console.error(JSON.stringify(error.details, null, 2));
    process.exit(1);
  }
}

bootstrap();
