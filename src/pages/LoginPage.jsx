import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { TextField } from '../components/ui/FormControls';
import { Button } from '../components/ui/Button';
import { Alert } from '../components/ui/States';
import { useToast } from '../components/ui/toastContext';
import { SocialLogin } from '../features/auth/SocialLogin';
import { login } from '../lib/api/auth';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await login({ email: email.trim(), password });
      toast.success('Welcome back', 'You are signed in.');
      navigate(location.state?.from || '/myprofile', { replace: true });
    } catch (submitError) {
      setError(submitError.message || 'Unable to sign in. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth">
      <section className="auth__panel" aria-labelledby="login-title">
        <h1 className="auth__title" id="login-title">
          Login
        </h1>
        <p className="auth__subtitle">Welcome back. Continue your search with dignity.</p>

        {error ? (
          <Alert variant="error" title="Sign in failed">
            {error}
          </Alert>
        ) : null}

        <form className="auth__form" onSubmit={handleSubmit} noValidate>
          <TextField
            id="login-email"
            label="Email"
            type="email"
            value={email}
            onChange={setEmail}
            placeholder="Enter your email"
            autoComplete="email"
            required
          />
          <TextField
            id="login-password"
            label="Password"
            type="password"
            value={password}
            onChange={setPassword}
            placeholder="Enter your password"
            autoComplete="current-password"
            required
          />
          <Button type="submit" variant="primary" size="lg" block disabled={submitting}>
            {submitting ? 'Signing in…' : 'Login'}
          </Button>
        </form>

        <SocialLogin />

        <div className="auth__footer">
          <p>Don&apos;t have an account?</p>
          <Link to="/register">Register</Link>
        </div>
      </section>
    </div>
  );
}

export default LoginPage;
