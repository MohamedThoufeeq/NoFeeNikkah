import { Link } from 'react-router-dom';
import { FaUserEdit } from 'react-icons/fa';
import { Avatar } from '../../components/ui/Avatar';
import { Button } from '../../components/ui/Button';
import { asArray } from '../../lib/utils/array';
import { socialLabel } from '../../lib/utils/format';
import { getProfileImage } from '../../lib/utils/profile';
import { buildProfileDescriptions, buildProfileSections } from './profileSections';

function ProfileRow({ row }) {
  const values = Array.isArray(row.value) ? row.value : [row.value];
  const visibleValues = values.filter(
    (value) => value !== null && value !== undefined && value !== ''
  );
  const displayValues = visibleValues.length ? visibleValues : ['—'];

  return (
    <div className="info-card__row">
      <span className="info-card__label">{row.label}</span>
      <div className="info-card__value">
        {displayValues.map((value, index) => {
          if (row.type === 'email') {
            return (
              <span key={`${row.label}-${index}`}>
                <a href={`mailto:${value}`}>{value}</a>
              </span>
            );
          }
          if (row.type === 'social') {
            const href = /^https?:\/\//i.test(value) ? value : `https://${value}`;
            return (
              <span key={`${row.label}-${index}`}>
                <a href={href} target="_blank" rel="noreferrer noopener">
                  {socialLabel(value)}
                </a>
              </span>
            );
          }
          return <span key={`${row.label}-${index}`}>{value}</span>;
        })}
        {row.hint ? <span className="field__hint">{row.hint}</span> : null}
      </div>
    </div>
  );
}

export function ProfileView({
  profile,
  editable = false,
  showInterest = true,
  interestState = 'idle',
  onSendInterest,
}) {
  if (!profile) return null;

  const sections = buildProfileSections(profile);
  const descriptions = buildProfileDescriptions(profile);
  const interestLabel =
    interestState === 'sent'
      ? 'Interest Sent'
      : interestState === 'sending'
        ? 'Sending…'
        : 'Send Interest';

  return (
    <div className="profile-page">
      <article className="profile-shell">
        <div className="profile-toolbar">
          {editable ? (
            <Link to="/edit-myprofile" className="profile-toolbar__link" title="Edit your profile" aria-label="Edit your profile">
              <FaUserEdit aria-hidden="true" />
            </Link>
          ) : null}
        </div>

        <header className="profile-header">
          <Avatar
            className="profile-header__avatar"
            size="xl"
            src={getProfileImage(profile)}
            alt={`${profile.fullName || 'Profile'} photo`}
            name={profile.fullName}
          />
          {profile.username ? <span className="profile-username">{profile.username}</span> : null}
          <h1 className="profile-name">{profile.fullName || 'Unnamed profile'}</h1>
        </header>

        <div className="profile-divider" />

        <div className="profile-content">
          <div className="profile-groups">
            {sections.map((section) => (
              <section className="info-card" key={section.id} aria-labelledby={`${section.id}-title`}>
                <h2 className="section-title info-card__title" id={`${section.id}-title`}>
                  {section.title}
                </h2>
                <div className="info-card__rows">
                  {section.rows.map((row, index) => (
                    <ProfileRow row={row} key={`${section.id}-${row.label}-${index}`} />
                  ))}
                </div>
              </section>
            ))}
          </div>

          {descriptions.length ? (
            <div className="profile-descriptions">
              {descriptions.map((item) => (
                <section className="description-card" key={item.id}>
                  <h2 className="section-title description-card__title">{item.title}</h2>
                  <p className="description-card__body">{asArray(item.body).join('\n')}</p>
                </section>
              ))}
            </div>
          ) : null}

          {showInterest ? (
            <div className="profile-interest">
              <Button
                variant="success"
                size="lg"
                onClick={onSendInterest}
                disabled={!onSendInterest || interestState !== 'idle'}
              >
                {interestLabel}
              </Button>
            </div>
          ) : null}

          <p className="profile-note">
            <strong>Note:</strong> We never expose any user&apos;s mobile number because of
            spam and privacy concerns. Clicking “Send Interest” shares your number with them and
            they will contact you. Otherwise, reach them directly via email or social media.
          </p>
        </div>
      </article>
    </div>
  );
}

export default ProfileView;
