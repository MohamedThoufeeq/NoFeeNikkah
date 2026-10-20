import config from './config/env.js';
import { logger } from './core/logger.js';
import { SupabaseConnection } from './db/SupabaseConnection.js';
import { SupabaseAuthRepository } from './repositories/SupabaseAuthRepository.js';
import { ProfileRepository } from './repositories/ProfileRepository.js';
import { SessionRepository } from './repositories/SessionRepository.js';
import { InterestRepository } from './repositories/InterestRepository.js';
import { ProfileService } from './services/ProfileService.js';
import { SessionService } from './services/SessionService.js';
import { AuthService } from './services/AuthService.js';
import { InterestService } from './services/InterestService.js';
import { ProfilePresenter } from './presenters/ProfilePresenter.js';
import { AuthPresenter } from './presenters/AuthPresenter.js';
import { AuthController } from './controllers/AuthController.js';
import { ProfileController } from './controllers/ProfileController.js';
import { InterestController } from './controllers/InterestController.js';
import { HealthController } from './controllers/HealthController.js';
import { authenticate } from './middleware/authenticate.js';
import { optionalAuthenticate } from './middleware/optionalAuthenticate.js';
import { createRateLimiters } from './middleware/rateLimit.js';

/**
 * Composition root. All object construction happens here, making dependencies
 * explicit and the rest of the codebase easy to test in isolation.
 */
export function createContainer() {
  const connection = new SupabaseConnection(config.supabase);

  const authRepository = new SupabaseAuthRepository({ connection });
  const profileRepository = new ProfileRepository({ client: connection.client, logger });
  const sessionRepository = new SessionRepository({ client: connection.client });
  const interestRepository = new InterestRepository({ client: connection.client });

  const profilePresenter = new ProfilePresenter();
  const authPresenter = new AuthPresenter();

  const sessionService = new SessionService({
    sessionRepository,
    ttlMs: config.session.ttlMs,
    touchIntervalMs: config.session.touchIntervalMs,
    logger,
  });

  const profileService = new ProfileService({ profileRepository, logger });

  const authService = new AuthService({
    authRepository,
    profileService,
    sessionService,
    frontendUrl: config.frontendUrl,
    logger,
  });

  const interestService = new InterestService({
    interestRepository,
    profileRepository,
  });

  const sessionCookie = {
    name: config.session.cookieName,
    secure: config.session.secureCookie,
    sameSite: config.session.sameSite,
  };

  const controllers = {
    auth: new AuthController({
      authService,
      authPresenter,
      sessionCookie,
      socialProviders: config.socialProviders,
      logger,
    }),
    profile: new ProfileController({ profileService, profilePresenter }),
    interest: new InterestController({ interestService }),
    health: new HealthController({
      connection,
      version: process.env.APP_VERSION || '1.0.0',
    }),
  };

  return {
    config,
    logger,
    connection,
    repositories: {
      auth: authRepository,
      profile: profileRepository,
      session: sessionRepository,
      interest: interestRepository,
    },
    services: {
      auth: authService,
      profile: profileService,
      session: sessionService,
      interest: interestService,
    },
    presenters: { auth: authPresenter, profile: profilePresenter },
    controllers,
    authenticate: authenticate({
      sessionService,
      cookieName: config.session.cookieName,
    }),
    optionalAuthenticate: optionalAuthenticate({
      sessionService,
      cookieName: config.session.cookieName,
    }),
    rateLimiters: createRateLimiters({ rateLimit: config.rateLimit }),
    sessionCookie,
  };
}

export default createContainer;
