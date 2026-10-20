import { Link } from 'react-router-dom';

export function AboutPage() {
  return (
    <div className="content-page">
      <article className="content-card">
        <h1>About NoFeeNikkah</h1>
        <p>
          NoFeeNikkah is a free matrimonial service that helps Muslims find a partner without
          subscriptions, hidden charges or intrusive advertising. The focus is on clear, honest
          profiles and respectful introductions.
        </p>
        <h2>How it works</h2>
        <p>
          Create a profile, describe your practice and preferences, then search for people who match
          what you are looking for. When a profile interests you, send an interest request. Your
          contact details are only shared with someone you choose to contact.
        </p>
        <h2>Privacy</h2>
        <p>
          Mobile numbers are masked everywhere in the product. We do not publish contact details,
          and we do not sell data. You decide when to share your number by sending interest.
        </p>
        <p>
          <Link to="/register">Create your free profile</Link> or <Link to="/search">browse profiles</Link>.
        </p>
      </article>
    </div>
  );
}

export default AboutPage;
