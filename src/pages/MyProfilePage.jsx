import { Link } from 'react-router-dom';
import { ProfileView } from '../features/profile/ProfileView';
import { Button } from '../components/ui/Button';
import { Alert, EmptyState, LoadingState } from '../components/ui/States';
import { useAsyncData } from '../lib/hooks/useAsyncData';
import { getMyProfile } from '../lib/api/profiles';

export function MyProfilePage() {
  const { data, status, error, reload } = useAsyncData(() => getMyProfile(), []);

  if (status === 'loading' || status === 'idle') {
    return (
      <div className="container page">
        <LoadingState label="Loading your profile…" />
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="container page">
        <Alert variant="error" title="Could not load your profile">
          {error?.message || 'Please try again in a moment.'}
        </Alert>
        <div className="text-center mt-4">
          <Button variant="primary" onClick={reload}>
            Try again
          </Button>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="container page">
        <EmptyState
          title="No profile yet"
          body="Create your profile to start connecting with other members."
          action={
            <Button as={Link} to="/register" variant="primary">
              Create a profile
            </Button>
          }
        />
      </div>
    );
  }

  return <ProfileView profile={data} editable showInterest={false} />;
}

export default MyProfilePage;
