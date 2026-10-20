import { Link } from 'react-router-dom';
import { Avatar } from '../../components/ui/Avatar';
import { getProfileAge, getProfileImage } from '../../lib/utils/profile';
import { formatCurrencyINR, truncate } from '../../lib/utils/format';
import { asArray } from '../../lib/utils/array';

export function ProfileCard({ profile }) {
  const age = getProfileAge(profile);
  const income = formatCurrencyINR(profile.income);
  const primaryOccupation = asArray(profile.occupations)[0] || '—';
  const location = [profile.city, profile.state, profile.country].filter(Boolean).join(', ');
  const accessibleName = [profile.fullName, location].filter(Boolean).join(', ') || 'Profile';

  return (
    <article className="profile-card" aria-label={accessibleName}>
      <div className="profile-card__face profile-card__front">
        <Avatar
          className="profile-card__avatar"
          src={getProfileImage(profile)}
          alt={`${profile.fullName || 'Profile'} photo`}
          name={profile.fullName}
        />
        <h3 className="profile-card__name">{profile.fullName || 'Unnamed profile'}</h3>
        <p className="profile-card__location">{location || 'Location not set'}</p>
        <div className="profile-card__stats">
          <span className="profile-card__stat">
            <span className="profile-card__stat-label">Age</span>
            <span className="profile-card__stat-value">{age ?? '—'}</span>
          </span>
          <span className="profile-card__stat">
            <span className="profile-card__stat-label">Occupation</span>
            <span className="profile-card__stat-value">{truncate(primaryOccupation, 22)}</span>
          </span>
          <span className="profile-card__stat">
            <span className="profile-card__stat-label">Income (per month)</span>
            <span className="profile-card__stat-value">{income || '—'}</span>
          </span>
        </div>
        <Link to={`/profile/${profile.id}`} className="btn btn--dark btn--sm profile-card__cta">
          View profile
        </Link>
      </div>

      <div className="profile-card__face profile-card__back">
        <span className="profile-card__back-title">About Me</span>
        <p className="profile-card__text">{truncate(profile.aboutMe, 120) || 'No description yet.'}</p>
        <span className="profile-card__back-title">My Expectations</span>
        <p className="profile-card__text">
          {truncate(profile.myExpectation, 120) || 'No expectations listed yet.'}
        </p>
        <Link to={`/profile/${profile.id}`} className="btn btn--dark profile-card__cta">
          View profile
        </Link>
      </div>
    </article>
  );
}

export default ProfileCard;
