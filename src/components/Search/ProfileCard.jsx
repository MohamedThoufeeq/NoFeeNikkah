import "../css/ProfileCard.css";
function ProfileCard(props) {
  var profileCardBack;
  var profileCardFront;
 
  const profile = props.SampleJsonProfiles;
  console.log(profile)
  const handleProfileCardHoverEnter = (e) => {
    console.log(e);
    profileCardFront = document.getElementById("profile-card-front");
    profileCardBack = document.getElementById("profile-card-back");
    
    e.preventDefault();
    profileCardFront.style.display = "none";
    profileCardBack.style.display = "flex";
  };
  const handleProfileCardHoverLeave = (e) => {
    
    e.preventDefault();
    profileCardFront.style.display = "flex";
    profileCardBack.style.display = "none";
  };
  var fullage = profile.age;
  var age = fullage.substring(0,2);
  return (
    <div
      id="profile-card"
      onMouseEnter={(e) => handleProfileCardHoverEnter(e)}
      onMouseLeave={(e) => handleProfileCardHoverLeave(e)}
    >
      <div id="profile-card-front">
        <div id="profile-image">
          <img src="../../public/profile_img_boy.jpg" alt="Profile Picture" />
        </div>
        <span id="main-data">
          <h5 id="name">{profile.fullname}</h5>
          <p>📍{profile.city}, {profile.state}, {profile.country}</p>
        </span>
        <div id="sub-data">
          <span className="subdata-header" id="age">
            <span>Age</span>
            <br />
            {age}
          </span>
          <span className="subdata-header" id="occupation">
            <span>Occupation</span>
            <br />
            {profile.occupation}
          </span>
          <span className="subdata-header" id="income">
            <span>Income</span>
            <br />
            &#8377;{profile.income}
          </span>
        </div>
      </div>
      <div id="profile-card-back">
        <span>
          <p>My Expectations</p>
        </span>
        <p>
          {profile.myExpectation}
        </p>
        <a href="/profile/id" className="btn btn-dark">
          {profile.fullname}
        </a>
      </div>
    </div>
  );
}
export default ProfileCard;
