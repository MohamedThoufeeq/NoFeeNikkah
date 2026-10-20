import { sendSuccess } from '../core/http.js';

export class HealthController {
  constructor({ connection, version }) {
    this.connection = connection;
    this.version = version;
  }

  live = async (_req, res) => {
    return sendSuccess(res, {
      status: 'ok',
      uptime: Math.round(process.uptime()),
      timestamp: new Date().toISOString(),
      version: this.version,
    });
  };

  ready = async (_req, res) => {
    await this.connection.ping();
    return sendSuccess(res, {
      status: 'ready',
      database: 'connected',
      timestamp: new Date().toISOString(),
    });
  };
}

export default HealthController;
