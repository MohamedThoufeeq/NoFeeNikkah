import samplejsonprofile from '../../../public/GetAllProfilesSample.json';
import { FaFileUpload } from "react-icons/fa";
import { useRef } from 'react';
import '../css/EditMyProfile.css'
import { useState } from 'react';
import AgeCalculator from '../EditMyProfile/AgeCalculator.js';
import CountryStateCity from '../EditMyProfile/CountyStateCity1';


function EditMyProfile(){
    const profile = samplejsonprofile.profiles[3];
    
    
    const inputref = useRef(null);
    const handleImgClick = () => {
        inputref.current.click();
    }
    //image
    const [image , setImage] = useState(null);
    const handleUpload = (e) => {
        e.preventDefault();
        setImage(URL.createObjectURL(e.target.files[0]));
        document.querySelector('#preview-image').style.filter="brightness(1)";
    }
    //dob, age
    const [dob, setDob] = useState(profile.dateOfBirth);
    const age = AgeCalculator(dob);
    const handleDob = (e) => {
        setDob(e.target.value ? e.target.value : profile.dateOfBirth);
    }
    //countryStateCity
    const { renderCSC, selectedCountry, selectedState, selectedCity } = CountryStateCity(profile);
    //languages
    const [languages, setLanguages] = useState(profile.languagesKnown);
    const handleLanguages = (e) => {
        setLanguages(e.target.value);
    }
    //maritalStatus
    const [maritalStatus, setMaritalStatus] = useState(profile.maritalStatus);
    const handleMaritalStatus = (e) => {
        setMaritalStatus(e.target.value);
    }
    //height
    const [height, setHeight] = useState(profile.height);
    const handleHeight = (e) => {
        setHeight(e.target.value);
    }
    //weight
    const [weight, setWeight] = useState(profile.weight);
    const handleWeight = (e) => {
        setWeight(e.target.value);
    }
    //bmi
    let bmi = (weight / ((height * height) / 10000)).toFixed(2);
    //bloodgroup
    const [bloodGroup, setBloodGroup] = useState(profile.bloodGroup);
    const handleBloodGroup = (e) => {
        setBloodGroup(e.target.value);
    }
    return (
        
        <div id="myprofile">
        <div id="edit-my-profile-container">
            {/* <div id="edit" title='Edit Your Profile'>
            <a href="/edit/myprofile" title='Edit Your Profile'><FaUserEdit/></a>
            </div>*/}
            <div id="edit-my-profile-header" className='mb-10'>
                <div id="edit-my-profile-img"  onClick={handleImgClick}>
                    <FaFileUpload className={image ? 'd-none' : 'd-flex'}/> 
                    <input type="file" ref={inputref} className='d-none' onChange={(e) => handleUpload(e)}></input>
                    <img src={image} id='preview-image' className={image ? 'd-flex' : 'd-none'} alt="Profile Picture Preview" />
                    <img src="../../../public/profile_img_boy.jpg" className={image ? 'd-none' : 'd-flex'} alt="Profile Picture" />
                </div>
                <span id="name">
                    <h2>{profile.fullname}</h2>
                </span>
            </div>
            <div id="border" ></div>
            <div id="edit-my-profile-main">
                <div id="category-group">
                    <div id="categories">
                    <p id='title'>Basic Information</p>
                    <div id="category">
                        <span id='name'>Date Of Birth 📆</span>
                        <input type='date' id='value' value={dob} onChange={(e)=>handleDob(e)}/>
                    </div>
                    <div id="category">
                        <span id='name'>Age 🔢</span>
                        <p id='value'>{age}</p>
                    </div>
                    <div id="category">
                        <span id='name'>Living in 📍</span>
                        <div id='value'>{renderCSC}</div>
                    </div>
                    <div id="category">
                        <span id='name'>Languages Known 🗣️</span>
                        <input type="text" name="language" id="language-input" value={languages} contentEditable={true} onChange={(e)=> handleLanguages(e)}/>
                        {/* <p id='value'>🗣️{profile.languagesKnown}</p> */}
                    </div>
                    <div id="category">
                        <span id='name'>Marital Status ⚭</span>
                        <select name="maritalStatus" id="maritalStatus-input" value={maritalStatus} onChange={(e)=> handleMaritalStatus(e)}>
                            <option value="single">Single</option>
                            <option value="married">Married</option>
                            <option value="divorcee">Divorcee</option>
                            <option value="widow">Widow</option>
                            <option value="widower">Widower</option>
                        </select>
                        {/* <p id='value'>⚭{profile.maritalStatus}</p> */}
                    </div>
                    <div id="category">
                        <span id='name'>Physical Information 💪🏻</span>
                        <div id='value'>
                        <b>Height : </b><input type="number" name="height" id="height-input" style={{width : '60px'}} value={height} onChange={(e) => handleHeight(e)} />{' CM'}<br />
                        <b>Weight : </b><input type="number" name="weight" id="weight-input" style={{width : '60px'}} value={weight} onChange={(e) => handleWeight(e)} />{' Kg'}<br />
                           {/* <b> Weight</b> - {profile.weight}{'Kg  '} */}
                           <b> BMI index</b> - {bmi}
                        </div>
                    </div>
                    <div id="category">
                        <span id='name'>Blood Group 🩸</span>
                        <input type="text" name="bloodGroup" id="bloodGroup-input" value={bloodGroup} onChange={(e)=> handleBloodGroup(e)} />
                        {/* <p id='value'>{profile.bloodGroup}</p> */}
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
export default EditMyProfile;