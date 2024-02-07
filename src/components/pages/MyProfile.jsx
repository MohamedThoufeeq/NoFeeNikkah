import samplejsonprofile from '../../../public/GetAllProfilesSample.json';
import '../css/MyProfile.css';
function MyProfile(){
    const profile = samplejsonprofile.profiles[3];

    // Fixing upto 2 decimal places
    let bmi = (profile.weight / ((profile.height * profile.height) / 10000)).toFixed(2);

    return (
        <div id="my-profile-container">
            <div id="my-profile-header">
                <div id="header-img" className='mt-10'>
                    <img src="../../../public/profile_img_boy.jpg" alt="Profile Picture" />
                </div>
                <span id="name">
                    <h2>{profile.fullname}</h2>
                </span>
            </div>
            <div id="border"></div>
            <div id="my-profile-main">
                <div id="categories">
                    <p id='title'>Basic Information</p>
                    <div id="category">
                        <span id='name'>Date Of Birth</span>
                        <p id='value'>📆{profile.dateOfBirth}</p>
                    </div>
                    <div id="category">
                        <span id='name'>Age</span>
                        <p id='value'>🔢{profile.age}</p>
                    </div>
                    <div id="category">
                        <span id='name'>Living in</span>
                        <p id='value'>📍{profile.city}, {profile.state}, {profile.country}</p>
                    </div>
                    <div id="category">
                        <span id='name'>Languages Known</span>
                        <p id='value'>🗣️{profile.languagesKnown}</p>
                    </div>
                    <div id="category">
                        <span id='name'>Marital Status</span>
                        <p id='value'>⚭{profile.maritalStatus}</p>
                    </div>
                    <div id="category">
                        <span id='name'>Physical Information 💪🏻</span>
                        <p id='value'>
                           <b>Height</b> -{profile.height}{'CM  '}
                           <b> Weight</b> - {profile.weight}{'Kg  '}
                           <b> BMI index</b> - {bmi}
                        </p>
                    </div>
                    <div id="category">
                        <span id='name'>Blood Group</span>
                        <p id='value'>🩸{profile.bloodGroup}</p>
                    </div>

                </div>
                <div id="categories">
                    <p id='title'>Professional background</p>
                    <div id="category">
                        <span id='name'>Education</span>
                        <p id='value'>👨🏻‍🎓{profile.education}</p>
                    </div>
                    <div id="category">
                        <span id='name'>Occupation</span>
                        <p id='value'>💼{profile.occupation}</p>
                    </div>
                    <div id="category">
                        <span id='name'>Income</span>
                        <p id='value'>₹{profile.income}</p>
                    </div>
                    <div id="category">
                        <span id='name'>Now Working at</span>
                        <p id='value'>🏬{profile.company}</p>
                    </div>
                    <div id="category">
                        <span id='name'>Work Location</span>
                        <p id='value'>📍{profile.workLocation}</p>
                    </div>
                    <div id="category">
                        <span id='name'>Experience</span>
                        <p id='value'>✅{profile.workExperience} Years</p>
                    </div>
                </div>
                <div id="categories">
                    <p id="title">Contact Information</p>
                    <div id="category">
                        <span id='name'>Father's Occupation</span>
                        <p id='value'>🏗{profile.fatherOccupation}</p>
                    </div>
                    <div id="category">
                        <span id='name'>Parent's Name</span>
                        <p id='value'>👨‍👩‍👧‍👧{profile.parentName && profile.parentName.substring(0,1) == 'm' ? 'Mom :  ' : 'Dad :  '} {profile.parentName.substring(2)}</p>
                    </div>
                    <div id="category">
                        <span id='name'>Parent's Contact Number</span>
                        <p id='value'>📞{profile.parentNumber}</p>
                    </div>
                    <div id="category">
                        <span id='name'>Email Id</span>
                        <p id='value'>📧<a href={'mailto:'+profile.email}>{profile.email}</a></p>
                    </div>
                    <div id="category">
                        <span id='name'>Social Media Handles</span>
                        {/* <p id='value'>📧<a href={profile.socialLinks}>{profile.socialLinks && profile.socialLinks.contains('instagram') ? 'Instagram' : 'Social Media'}</a></p> */}
                    </div>
                    <div id="category">
                        <span id='name'>Mobile Number</span>
                        <p id='value'>📞{profile.mobileNumber}</p>
                    </div>

                </div>
            </div>
        </div>
    )
}
export default MyProfile