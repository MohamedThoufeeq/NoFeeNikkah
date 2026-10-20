import { Link } from 'react-router-dom';
import { FaHeart, FaLock, FaSearch, FaUserFriends } from 'react-icons/fa';
import { useSession } from '../features/auth/session';
import config from '../lib/config';

const features = [
  {
    id: 'free',
    icon: FaHeart,
    title: 'Completely free',
    body: 'No subscriptions, no hidden charges and no paywalls between you and your future partner.',
  },
  {
    id: 'private',
    icon: FaLock,
    title: 'Privacy first',
    body: 'Phone numbers stay private. They are only shared when you choose to send interest.',
  },
  {
    id: 'values',
    icon: FaUserFriends,
    title: 'Faith and values',
    body: 'Search by practice, sect, location and lifestyle so every introduction is meaningful.',
  },
];

export function HomePage() {
  const session = useSession();

  return (
    <div className="home">
      <section className="home__hero">
        <span className="home__eyebrow">{config.appName}</span>
        <h1 className="home__title">Find a partner who shares your faith and values.</h1>
        <p className="home__subtitle">
          A free, private matrimonial service built for meaningful introductions. Browse profiles,
          filter by what matters and reach out when you are ready.
        </p>
        <div className="home__actions">
          <Link to="/search" className="btn btn--primary btn--lg">
            <FaSearch aria-hidden="true" /> Search profiles
          </Link>
          <Link to={session ? '/myprofile' : '/register'} className="btn btn--outline btn--lg">
            {session ? 'My profile' : 'Create an account'}
          </Link>
        </div>
      </section>

      <section className="home__features" aria-label="Why NoFeeNikkah">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <article className="home__feature" key={feature.id}>
              <span className="home__feature-icon" aria-hidden="true">
                <Icon />
              </span>
              <h2 className="home__feature-title">{feature.title}</h2>
              <p className="home__feature-body">{feature.body}</p>
            </article>
          );
        })}
      </section>
    </div>
  );
}

export default HomePage;
