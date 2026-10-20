import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AvatarUpload } from '../components/ui/AvatarUpload';
import { Button } from '../components/ui/Button';
import { Alert, EmptyState, LoadingState } from '../components/ui/States';
import { useToast } from '../components/ui/toastContext';
import { ProfileForm } from '../features/profile/ProfileForm';
import { EMPTY_PROFILE } from '../features/profile/profile.mapper';
import { useProfileForm } from '../features/profile/useProfileForm';
import { getMyProfile, updateProfile } from '../lib/api/profiles';
import { useAsyncData } from '../lib/hooks/useAsyncData';
import { getProfileImage } from '../lib/utils/profile';

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

export function EditProfilePage() {
  const { data, status, error, reload } = useAsyncData(() => getMyProfile(), []);
  const initialValues = useMemo(() => (data ? { ...data } : EMPTY_PROFILE), [data]);
  const form = useProfileForm(initialValues);
  const [previewUrl, setPreviewUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(
    () => () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    },
    [previewUrl]
  );

  const handleImage = (file) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Unsupported file', 'Please choose an image file.');
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      toast.error('Image too large', 'Please choose an image smaller than 5 MB.');
      return;
    }
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.validate()) {
      toast.error('Please check the form', 'Some required fields need your attention.');
      return;
    }

    setSubmitting(true);
    try {
      /**
       * The backend contract currently accepts an image URL. File upload can be
       * added here (FormData) without touching the rest of the form.
       */
      await updateProfile(data.id, { ...form.values, image: data.image });
      toast.success('Profile updated', 'Your changes have been saved.');
      navigate('/myprofile');
    } catch (submitError) {
      toast.error('Could not save changes', submitError.message);
    } finally {
      setSubmitting(false);
    }
  };

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
          title="No profile to edit"
          body="Create your profile first, then come back to add more details."
          action={
            <Button as={Link} to="/register" variant="primary">
              Create a profile
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="edit-page">
      <section className="edit-shell" aria-labelledby="edit-profile-title">
        <h1 className="sr-only" id="edit-profile-title">
          Edit your profile
        </h1>

        <form className="edit-form" onSubmit={handleSubmit} noValidate>
          <header className="edit-header">
            <AvatarUpload
              image={previewUrl || data.image || undefined}
              fallback={getProfileImage({ gender: form.values.gender })}
              onFile={handleImage}
            />
            {data.username ? <span className="profile-username">{data.username}</span> : null}
            <label className="sr-only" htmlFor="profile-fullName">
              Full name
            </label>
            <input
              id="profile-fullName"
              className="control edit-name-input"
              type="text"
              value={form.values.fullName}
              onChange={(event) => form.setValue('fullName', event.target.value)}
              placeholder="Enter your full name"
              aria-invalid={form.errors.fullName ? 'true' : undefined}
              aria-describedby={form.errors.fullName ? 'profile-fullName-error' : undefined}
            />
            {form.errors.fullName ? (
              <p className="field__error" id="profile-fullName-error" role="alert">
                {form.errors.fullName}
              </p>
            ) : null}
          </header>

          <div className="profile-divider" />

          <ProfileForm
            values={form.values}
            errors={form.errors}
            setValue={form.setValue}
          />

          <div className="edit-form__actions">
            <Button type="submit" variant="success" size="lg" disabled={submitting}>
              {submitting ? 'Saving…' : 'Update Profile'}
            </Button>
            <Button as={Link} to="/myprofile" variant="dark" size="lg">
              Cancel
            </Button>
          </div>

          <p className="edit-note">
            <strong>Note:</strong> We never expose any user&apos;s mobile number because of spam
            and privacy concerns. Entering your mobile number is optional, and it is only shared
            when you choose to send interest.
          </p>
        </form>
      </section>
    </div>
  );
}

export default EditProfilePage;
