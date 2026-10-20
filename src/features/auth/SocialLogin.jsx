import { useState } from 'react';
import { FaApple, FaFacebookF, FaGithub, FaGoogle, FaLinkedinIn, FaUser } from 'react-icons/fa';
import config from '../../lib/config';
import { getSocialRedirectUrl, getSupabaseClient, isSocialLoginEnabled } from '../../lib/supabaseClient';

const PROVIDERS = {
  google: { label: 'Google', Icon: FaGoogle },
  github: { label: 'GitHub', Icon: FaGithub },
  facebook: { label: 'Facebook', Icon: FaFacebookF },
  apple: { label: 'Apple', Icon: FaApple },
  linkedin: { label: 'LinkedIn', Icon: FaLinkedinIn },
  azure: { label: 'Microsoft', Icon: FaUser },
};

export function SocialLogin() {
  const [loadingProvider, setLoadingProvider] = useState('');
  const [error, setError] = useState('');

  if (!isSocialLoginEnabled()) return null;

  const providers = config.socialProviders.filter((provider) => PROVIDERS[provider]);
  if (!providers.length) return null;

  const handleProvider = async (provider) => {
    const supabase = getSupabaseClient();
    if (!supabase) return;

    setError('');
    setLoadingProvider(provider);

    try {
      try {
        window.sessionStorage.setItem(config.storageKeys.oauthProvider, provider);
      } catch {
        /* Storage can be unavailable in private mode. */
      }

      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo: getSocialRedirectUrl() },
      });

      if (oauthError) throw oauthError;
      // The browser is redirected now; keep the button in its loading state.
    } catch (submitError) {
      setLoadingProvider('');
      setError(submitError.message || 'Could not start social sign in. Please try again.');
    }
  };

  return (
    <div className="social-auth">
      <div className="auth-divider" role="separator" aria-label="Or continue with">
        <span>or continue with</span>
      </div>

      {error ? (
        <p className="social-auth__error" role="alert">
          {error}
        </p>
      ) : null}

      <div className="social-auth__buttons">
        {providers.map((provider) => {
          const { label, Icon } = PROVIDERS[provider];
          const loading = loadingProvider === provider;

          return (
            <button
              key={provider}
              type="button"
              className="social-auth__button"
              onClick={() => handleProvider(provider)}
              disabled={Boolean(loadingProvider)}
              aria-label={`Continue with ${label}`}
            >
              <Icon aria-hidden="true" />
              <span>{loading ? `Connecting to ${label}…` : `Continue with ${label}`}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default SocialLogin;
