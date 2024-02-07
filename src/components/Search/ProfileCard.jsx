import { useState } from "react";
import "../css/ProfileCard.css";
function ProfileCard({index, profile}) {
  
  const [isHovered, setIsHovered] = useState(false);

  // console.log(profile)
  const handleProfileCardHoverEnter = (e) => {
    console.log(e);
    setIsHovered(true);
    e.preventDefault();

    e.currentTarget.querySelector("#profile-card-front").style.display = "none";
    e.currentTarget.querySelector("#profile-card-back").style.display = "flex";
    e.currentTarget.querySelector("#profile-card-back").style.height = e.currentTarget.querySelector("#profile-card-front").style.height;

  };
  const handleProfileCardHoverLeave = (e) => {
    setIsHovered(false);
    e.preventDefault();

    e.currentTarget.querySelector("#profile-card-front").style.display = "flex";
    e.currentTarget.querySelector("#profile-card-back").style.display = "none";

  };
  const fullage = profile.age;
  const age = fullage.substring(0,2);
  return (
    <div
      id="profile-card" className={isHovered ? "hovered" : ""}
      onMouseEnter={(e) => handleProfileCardHoverEnter(e)}
      onMouseLeave={(e) => handleProfileCardHoverLeave(e)}
    >
      <div id="profile-card-front">
        <span id="main-data">
        <div id="profile-image">
          <img src={profile.gender && profile.gender == 'male' ? '../../public/profile_img_boy.jpg' : '../../public/profile_img_girl.jpg'} alt="Profile Picture" />
        </div>
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
          <p>About Me</p>
        </span>
        <p>
          {profile.aboutMe && profile.aboutMe.length > 120 ? `${profile.aboutMe.substring(0,120)}` : profile.aboutMe}...
        </p>
        <span>
          <p>My Expectations</p>
        </span>
        <p>
        {profile.myExpectation && profile.myExpectation.length > 120 ? `${profile.myExpectation.substring(0,120)}` : profile.myExpectation}...
        </p>
        <a href={`/profile/${profile.id}`} className="btn btn-dark">
          {profile.fullname}
        </a>
      </div>
    </div>
  );
}
export default ProfileCard;
