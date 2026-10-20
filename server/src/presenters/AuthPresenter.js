/**
 * Serializes auth payloads. The token is an opaque server-session token, never
 * a Supabase access token or refresh token.
 */
export class AuthPresenter {
  user(profile) {
    return {
      id: profile.id,
      email: profile.email,
      username: profile.username,
      fullName: profile.fullName,
      image: profile.image,
    };
  }

  session({ token, expiresAt, profile }) {
    return {
      token,
      expiresAt,
      user: this.user(profile),
    };
  }

  registration({ profile, session = null, requiresEmailConfirmation = false }) {
    return {
      user: this.user(profile),
      requiresEmailConfirmation,
      ...(session ? { session: this.session({ ...session, profile }) } : {}),
    };
  }
}

export default AuthPresenter;
