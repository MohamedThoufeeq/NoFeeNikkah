import { sendSuccess } from '../core/http.js';
import { extractSessionToken } from '../middleware/sessionToken.js';

function requestMeta(req) {
  return {
    userAgent: req.get('user-agent') || '',
    ipAddress: req.ip || req.socket?.remoteAddress || '',
  };
}

export class AuthController {
  constructor({ authService, authPresenter, sessionCookie, socialProviders, logger }) {
    this.authService = authService;
    this.authPresenter = authPresenter;
    this.sessionCookie = sessionCookie;
    this.socialProviders = socialProviders;
    this.logger = logger;
  }

  register = async (req, res) => {
    const result = await this.authService.register(req.validated.body, requestMeta(req));

    if (result.session) this.#setSessionCookie(res, result.session);

    return sendSuccess(
      res,
      this.authPresenter.registration(result),
      { status: 201 }
    );
  };

  login = async (req, res) => {
    const { profile, session } = await this.authService.login(
      req.validated.body,
      requestMeta(req)
    );

    this.#setSessionCookie(res, session);

    return sendSuccess(res, this.authPresenter.session({ ...session, profile }));
  };

  social = async (req, res) => {
    const { profile, session } = await this.authService.socialLogin(
      req.validated.body,
      requestMeta(req)
    );

    this.#setSessionCookie(res, session);

    return sendSuccess(res, this.authPresenter.session({ ...session, profile }));
  };

  me = async (req, res) => {
    const { profile, session } = await this.authService.getSession(req.auth);
    return sendSuccess(res, {
      user: this.authPresenter.user(profile),
      profile: profile.toApi({ includePrivate: true }),
      expiresAt: session.expiresAt,
    });
  };

  providers = async (_req, res) => {
    return sendSuccess(res, { providers: this.socialProviders });
  };

  logout = async (req, res) => {
    const token = extractSessionToken(req, this.sessionCookie.name);
    await this.authService.logout(token);
    this.#clearSessionCookie(res);
    return sendSuccess(res, { loggedOut: true });
  };

  logoutAll = async (req, res) => {
    const revoked = await this.authService.logoutAll(req.auth.userId);
    this.#clearSessionCookie(res);
    return sendSuccess(res, { loggedOut: true, revokedSessions: revoked });
  };

  deleteAccount = async (req, res) => {
    await this.authService.deleteAccount(req.auth.userId);
    this.#clearSessionCookie(res);
    return sendSuccess(res, { deleted: true });
  };

  #setSessionCookie(res, session) {
    res.cookie(this.sessionCookie.name, session.token, {
      httpOnly: true,
      secure: this.sessionCookie.secure,
      sameSite: this.sessionCookie.sameSite,
      path: '/',
      expires: new Date(session.expiresAt),
    });
  }

  #clearSessionCookie(res) {
    res.clearCookie(this.sessionCookie.name, {
      httpOnly: true,
      secure: this.sessionCookie.secure,
      sameSite: this.sessionCookie.sameSite,
      path: '/',
    });
  }
}

export default AuthController;
