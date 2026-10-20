import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TextField } from '../components/ui/FormControls';
import { Button } from '../components/ui/Button';
import { Alert } from '../components/ui/States';
import { useToast } from '../components/ui/toastContext';
import { SocialLogin } from '../features/auth/SocialLogin';
import { register } from '../lib/api/auth';

export function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const result = await register({ username: username.trim(), email: email.trim(), password });
      if (result?.session) {
        toast.success('Account created', 'You are signed in.');
        navigate('/myprofile', { replace: true });
      } else if (result?.requiresEmailConfirmation) {
        toast.success('Account created', 'Check your email to confirm your account, then sign in.');
        navigate('/login', { replace: true });
      } else {
        toast.success('Account created', 'Please sign in to continue.');
        navigate('/login', { replace: true });
      }
    } catch (submitError) {
      setError(submitError.message || 'Unable to create your account. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth">
      <section className="auth__panel" aria-labelledby="register-title">
        <h1 className="auth__title" id="register-title">
          Create an account
        </h1>
        <p className="auth__subtitle">Create a private profile and start searching for your partner.</p>

        {error ? (
          <Alert variant="error" title="Registration failed">
            {error}
          </Alert>
        ) : null}

        <form className="auth__form" onSubmit={handleSubmit} noValidate>
          <TextField
            id="register-username"
            label="Username"
            value={username}
            onChange={setUsername}
            placeholder="Enter a username"
            autoComplete="username"
            required
          />
          <TextField
            id="register-email"
            label="Email"
            type="email"
            value={email}
            onChange={setEmail}
            placeholder="Enter your email"
            autoComplete="email"
            required
          />
          <TextField
            id="register-password"
            label="Password"
            type="password"
            value={password}
            onChange={setPassword}
            placeholder="Create a password"
            autoComplete="new-password"
            hint="Use at least 8 characters."
            required
          />
          <Button type="submit" variant="primary" size="lg" block disabled={submitting}>
            {submitting ? 'Creating account…' : 'Register'}
          </Button>
        </form>

        <SocialLogin />

        <div className="auth__footer">
          <p>Already have an account?</p>
          <Link to="/login">Login</Link>
        </div>
      </section>
    </div>
  );
}

export default RegisterPage;
