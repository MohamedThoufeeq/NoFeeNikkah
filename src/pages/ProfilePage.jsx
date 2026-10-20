import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ProfileView } from '../features/profile/ProfileView';
import { Alert, EmptyState, LoadingState } from '../components/ui/States';
import { Button } from '../components/ui/Button';
import { useToast } from '../components/ui/toastContext';
import { useAsyncData } from '../lib/hooks/useAsyncData';
import { getProfileById, sendInterest } from '../lib/api/profiles';

export function ProfilePage() {
  const { id } = useParams();
  const [interestState, setInterestState] = useState('idle');
  const toast = useToast();
  const { data, status, error, reload } = useAsyncData(() => getProfileById(id), [id]);

  const handleSendInterest = async () => {
    if (!data || interestState !== 'idle') return;
    setInterestState('sending');
    try {
      await sendInterest(data.id);
      setInterestState('sent');
      toast.success('Interest sent', 'They will be able to contact you.');
    } catch (sendError) {
      setInterestState('idle');
      toast.error('Could not send interest', sendError.message);
    }
  };

  if (status === 'loading' || status === 'idle') {
    return (
      <div className="container page">
        <LoadingState label="Loading profile…" />
      </div>
    );
  }

  if (status === 'error') {
    const notFound = error?.status === 404;
    return (
      <div className="container page">
        {notFound ? (
          <EmptyState
            title="Profile not found"
            body="This profile may have been removed or the link is incorrect."
            action={
              <Button as={Link} to="/search" variant="primary">
                Back to search
              </Button>
            }
          />
        ) : (
          <>
            <Alert variant="error" title="Could not load this profile">
              {error?.message || 'Please try again in a moment.'}
            </Alert>
            <div className="text-center mt-4">
              <Button variant="primary" onClick={reload}>
                Try again
              </Button>
            </div>
          </>
        )}
      </div>
    );
  }

  if (!data) {
    return (
      <div className="container page">
        <EmptyState title="Profile not found" body="This profile does not exist." />
      </div>
    );
  }

  return (
    <ProfileView
      profile={data}
      interestState={interestState}
      onSendInterest={handleSendInterest}
    />
  );
}

export default ProfilePage;
