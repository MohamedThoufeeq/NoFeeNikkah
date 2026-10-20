import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Alert, LoadingState } from '../components/ui/States';
import { useToast } from '../components/ui/toastContext';
import { socialLogin } from '../lib/api/auth';
import { getSupabaseClient } from '../lib/supabaseClient';

export function AuthCallbackPage() {
  const [error, setError] = useState('');
  const completionStarted = useRef(false);
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    const supabase = getSupabaseClient();
    if (!supabase) {
      setError('Social sign in is not configured. Please use email and password.');
      return undefined;
    }

    const queryError =
      new URLSearchParams(window.location.search).get('error_description') ||
      new URLSearchParams(window.location.search).get('error');
    if (queryError) {
      setError(queryError);
      return undefined;
    }

    let timeoutId = null;
    let subscription = null;

    const complete = async (supabaseSession) => {
      if (!supabaseSession?.access_token || completionStarted.current) return;
      completionStarted.current = true;

      try {
        await socialLogin(supabaseSession.access_token);
        // The API session is now stored locally; the temporary Supabase
        // session is no longer needed in the browser.
        await supabase.auth.signOut({ scope: 'local' }).catch(() => {});
        toast.success('Welcome', 'You are signed in.');
        navigate('/myprofile', { replace: true });
      } catch (submitError) {
        completionStarted.current = false;
        setError(submitError.message || 'Could not complete social sign in.');
      }
    };

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) void complete(session);
    });
    subscription = data.subscription;

    supabase.auth
      .getSession()
      .then(({ data: sessionData, error: sessionError }) => {
        if (sessionError) {
          setError(sessionError.message || 'Could not read the social sign in response.');
          return;
        }
        if (sessionData.session) {
          void complete(sessionData.session);
        }
      })
      .catch(() => {
        setError('Could not read the social sign in response.');
      });

    timeoutId = window.setTimeout(async () => {
      if (completionStarted.current) return;
      const { data: sessionData } = await supabase.auth.getSession();
      if (sessionData.session) void complete(sessionData.session);
      else setError('The social sign in did not complete. Please try again.');
    }, 8000);

    return () => {
      if (timeoutId) window.clearTimeout(timeoutId);
      subscription?.unsubscribe();
    };
  }, [navigate, toast]);

  return (
    <div className="auth">
      <section className="auth__panel" aria-labelledby="auth-callback-title">
        <h1 className="auth__title" id="auth-callback-title">
          Completing sign in
        </h1>
        <p className="auth__subtitle">Please wait while we secure your session.</p>

        {error ? (
          <>
            <Alert variant="error" title="Social sign in failed">
              {error}
            </Alert>
            <div className="auth__footer">
              <Link to="/login">Back to login</Link>
            </div>
          </>
        ) : (
          <LoadingState label="Verifying your account…" />
        )}
      </section>
    </div>
  );
}

export default AuthCallbackPage;
