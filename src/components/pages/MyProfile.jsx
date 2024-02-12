import samplejsonprofile from '../../../public/GetAllProfilesSample.json';
import '../css/MyProfile.css';
import { FaUserEdit } from "react-icons/fa";


function MyProfile(){
    const profile = samplejsonprofile.profiles[3];

    // Fixing upto 2 decimal places
    let bmi = (profile.weight / ((profile.height * profile.height) / 10000)).toFixed(2);

    return (
        <div id="myprofile">
        <div id="my-profile-container">
            <div id="edit" title='Edit Your Profile'>
            <a href="/edit-myprofile" title='Edit Your Profile'><FaUserEdit/></a>
            </div>
            <div id="my-profile-header">
                <div id="header-img" className='mt-10'>
                    <img src="../../../public/profile_img_boy.jpg" alt="Profile Picture" />
                </div>
                <span id="name">
                    <h2>{profile.fullname}</h2>
                </span>
                <span id='interest'><a className='btn btn-success interest-btn hover' href={`http:localhost:8080/api/${profile.id}/senInterest/${profile.id}`}> Send Interest</a> </span>
            </div>
            <div id="border" ></div>
            <div id="my-profile-main">
                <div id="category-group">
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
                        <p id='value'>👨‍👩‍👧‍👧{profile.parentName && profile.parentName.substring(0,1) == 'm' ? 'Mom :  ' : profile.parentName.substring(0,1) == 'd' ? 'Dad :  ' : profile.parentName.substring(0,1) == 'g' ? 'Guardian : ':''} {profile.parentName.substring(2)}</p>
                    </div>
                    <div id="category">
                        <span id='name'>Parent's Contact Number</span>
                        <p id='value'>📞{profile.parentNumber.substring(0,5)+'*****'}</p>
                        Check the bottom note
                    </div>
                    <div id="category">
                        <span id='name'>Email Id</span>
                        <p id='value'>📧<a href={'mailto:'+profile.email}>{profile.email}</a></p>
                    </div>
                    <div id="category">
                        <span id='name'>Social Media Handles</span>
                        <p id='value'>📲<a target={'_blank'} 
                            href={profile.socialLinks}>{profile.socialLinks && profile.socialLinks.includes('instagram') ? 'Instagram' :   profile.socialLinks.includes('facebook') ? 'Facebook' : profile.socialLinks.includes('twitter') ? 'Twitter' : 'Social Media' }  </a></p>
                    </div>
                    <div id="category">
                        <span id='name'>Mobile Number</span>
                        <p id='value'>📞{profile.mobileNumber.substring(0,5)+'*****'}</p>
                        Check the bottom note
                    </div>
                    </div>
                </div>
                <div id="description">
                    <div id="description-container">
                        <span id="title">About Me</span>
                        <p>{profile.aboutMe}</p>
                    </div>
                    <div id="description-container">
                        <span id="title">My Expectation</span>
                        <p>{profile.myExpectation}</p>
                    </div>
                </div>
                <p id='value'><b>Note : </b>⚠️We will not expose any of the user's mobile number because of spamming and privacy concerns. Click on the "Show Interest" button which will send your mobile number to them And they will contact you. Otherwise, contact them directly via Email or any of the Social Media handles.</p>

            </div>
        </div>
    </div>
    )
}
export default MyProfile