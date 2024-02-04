import '../css/ProfileCard.css'
function ProfileCard(props) {
  return (
    <div id="profile-card">
      <div id="profile-image">
        <img src="../../public/profile_img_boy.jpg" alt="Profile Picture" />
      </div>
      <span id='main-data'>
        <h5 id='name'>Mohamed Thoufeeq</h5>
        <p>📍Trichy, TamilNadu, India</p>
      </span>
      <div id="sub-data">
      <span className='subdata-header' id="age"><span>Age</span><br/>23</span>
      <span className='subdata-header' id="occupation"><span>Occupation</span><br/>Software Engineering</span>
      <span className='subdata-header' id="income"><span>Income</span><br/>&#8377;30000</span>
      </div>
    </div>
  );
}
export default ProfileCard;
