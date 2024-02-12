import samplejsonprofile from '../../../public/GetAllProfilesSample.json';
import { FaFileUpload } from "react-icons/fa";
import { useRef } from 'react';
import '../css/EditMyProfile.css'
import { useState } from 'react';
import AgeCalculator from '../EditMyProfile/AgeCalculator.js';
import CountryStateCity from '../EditMyProfile/CountyStateCity1';
import { useEffect } from 'react';


function EditMyProfile(){
    const profile = samplejsonprofile.profiles[3];
    
    useEffect(()=> {
        document.querySelector('.textarea').style.width = document.querySelector('#description-container').offsetWidth + 'px'; 
        document.querySelector('.textarea').style.maxWidth = document.querySelector('#description-container').offsetWidth - 20 + 'px'; 
        document.querySelector('.textarea1').style.width = document.querySelector('#description-container').offsetWidth + 'px'; 
        document.querySelector('.textarea1').style.maxWidth = document.querySelector('#description-container').offsetWidth - 20 + 'px'; 
        document.querySelector('.textarea2').style.width = document.querySelector('#description-container').offsetWidth + 'px'; 
        document.querySelector('.textarea2').style.maxWidth = document.querySelector('#description-container').offsetWidth - 20 + 'px'; 
    }, []);
    
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
    //education
    const [education, setEducation] = useState(profile.education);
    const handleEducation = (e) => {
        setEducation(e.target.value);
    }
    //occupation
    const [occupation, setOccupation] = useState(profile.occupation);
    const handleOccupation = (e) => {
        setOccupation(e.target.value);
    }
    //income
    const [income, setIncome] = useState(profile.income);
    const handleIncome = (e) => {
        setIncome(e.target.value);
    }
    //company
    const [company, setCompany] = useState(profile.company);
    const handleCompany = (e) => {
        setCompany(e.target.value);
    }
    //workLocation
    const [workLocation, setWorkLocation] = useState(profile.workLocation);
    const handleWorkLocation = (e) => {
        setWorkLocation(e.target.value);
    }
    //experience
    const [workExperience, setWorkExperience] = useState(profile.workExperience);
    const handleWorkExperience = (e) => {
        setWorkExperience(e.target.value);
    }
    //fatherOccupation
    const [fatherOccupation, setFatherOccupation] = useState(profile.fatherOccupation);
    const handleFatherOccupation = (e) => {
        setFatherOccupation(e.target.value);
    }
    //mfg - mother , father, guardian
    const [mfg, setMfg] = useState('');
    const [mfgValue, setMfgValue] = useState(profile.parentName.substring(0,1)=='m' ? 'mom' : profile.parentName.substring(0,1)=='d' ? 'dad' : profile.parentName.substring(0,1)=='g' ? 'guardian' : '');
    const handleMfg = (e) => {
        let mfgvalue = e.target.value == 'mom' ? "m:" : e.target.value == 'dad' ? "d:" : e.target.value == 'guardian' ? "g:" : '';
        setMfg(mfgvalue);
        setMfgValue(e.target.value);
    }
    //parentName
    const [parentName, setParentName] = useState(profile.parentName);
    const handleParentName = (e) => {
        let parentNameValue = mfg + e.target.value;
        console.log(parentNameValue);
        setParentName(parentNameValue);
    }
    //parentNumber
    const [parentNumber, setParentNumber] = useState(profile.parentNumber);
    const handleParentNumber = (e) => {
        setParentNumber(e.target.value);
    }
    //socialLinks
    const [socialLinks, setSocialLinks] = useState(profile.socialLinks);
    const handleSocialLinks = (e) => {
        setSocialLinks(e.target.value);
    }
    //email
    const [email, setEmail] = useState(profile.email);
    const handleEmail = (e) => {
        setEmail(e.target.value);
    }
    //mobileNumber
    const [mobileNumber, setMobileNumber] = useState(profile.mobileNumber);
    const handleMobileNumber = (e) => {
        setMobileNumber(e.target.value);
    }
    //mobileNumber
    const [aboutMe, setAboutMe] = useState(profile.aboutMe);
    const handleAboutMe = (e) => {
        setAboutMe(e.target.value);
    }
    //myExpectation
    const [myExpectation, setMyExpectation] = useState(profile.myExpectation);
    const handleMyExpectation = (e) => {
        setMyExpectation(e.target.value);
    }
    //quranVerse
    const [quranVerse, setQuranVerse] = useState(profile.quranVerse);
    const handleQuranVerse = (e) => {
        setQuranVerse(e.target.value);
    }
    const profileData = {
        'dateOfBirth': dob,
        'languagesKnown': languages,
        'maritalStatus': maritalStatus,
        'height': height,
        'weight': weight,
        'bloodGroup': bloodGroup,
        'education': education,
        'occupation': occupation,
        'income': income,
        'company': company,
        'workLocation': workLocation,
        'workExperience': workExperience,
        'fatherOccupation': fatherOccupation,
        'parentName': parentName,
        'parentNumber': parentNumber,
        'socialLinks': socialLinks,
        'email': email,
        'mobileNumber': mobileNumber,
        'aboutMe': aboutMe,
        'myExpectation': myExpectation
    };
    const jsonProfileData = JSON.stringify(profileData);
    console.log(jsonProfileData);
    return (
        
        <div id="myprofile">
        <div id="edit-my-profile-container">
            {/* <div id="edit" title='Edit Your Profile'>
            <a href="/edit/myprofile" title='Edit Your Profile'><FaUserEdit/></a>
            </div>*/}
            <div id="edit-my-profile-header" className='mb-10'>
                <div id="edit-my-profile-img"  onClick={handleImgClick}>
                    <FaFileUpload className={image ? 'd-none' : 'd-flex'}/> 
                    <input title='Upload your profile photo in 1:1 aspect ration (square)' type="file" ref={inputref} className='d-none' onChange={(e) => handleUpload(e)}></input>
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
                        <input placeholder='Enter DOB' title='Enter DOB' type='date' id='value' value={dob} onChange={(e)=>handleDob(e)}/>
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
                        <input title='Enter All the know languages seperated by comma' placeholder='Enter All the know languages seperated by comma' type="text" name="language" id="language-input" value={languages} onChange={(e)=> handleLanguages(e)}/>
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
                        <b>Height : </b><input title='Enter height' placeholder='Enter height' type="number" name="height" id="height-input" style={{width : '60px'}} value={height} onChange={(e) => handleHeight(e)} />{' CM'}<br />
                        <b>Weight : </b><input title='Enter weight' placeholder='Enter weight' type="number" name="weight" id="weight-input" style={{width : '60px'}} value={weight} onChange={(e) => handleWeight(e)} />{' Kg'}<br />
                           {/* <b> Weight</b> - {profile.weight}{'Kg  '} */}
                           <b> BMI index</b> - {bmi}
                        </div>
                    </div>
                    <div id="category">
                        <span id='name'>Blood Group 🩸</span>
                        <input title='Enter your Blood Group' placeholder='Enter your Blood Group' type="text" name="bloodGroup" id="bloodGroup-input" value={bloodGroup} onChange={(e)=> handleBloodGroup(e)} />
                        {/* <p id='value'>{profile.bloodGroup}</p> */}
                    </div>

                    </div>
                    <div id="categories">
                    <p id='title'>Professional background</p>
                    <div id="category">
                        <span id='name'>Education👨🏻‍🎓</span>
                        <input title='Enter your highest degree of qualification' placeholder='Enter your highest degree' type="text" name="education" id="education-input" value={education} onChange={(e)=> handleEducation(e)}/>
                    </div>
                    <div id="category">
                        <span id='name'>Occupation💼</span>
                        <input title='Enter your Job/Occupation' placeholder='Enter your Job/Occupation' type="text" name="occupation" id="occupation-input" value={occupation} onChange={(e)=> handleOccupation(e)}/>
                    </div>
                    <div id="category">
                        <span id='name'>Income ₹</span>
                        <input title='Enter your Salary/Income' placeholder='Enter Salary/Income' type="number" name="income" id="income-input" value={income} onChange={(e)=> handleIncome(e)}/>
                    </div>
                    <div id="category">
                        <span id='name'>Now Working at 🏬</span>
                        <input title='Enter your Company/Organization' placeholder='Enter Company/Organization' type="text" name="comapeny" id="company-input" value={company} onChange={(e)=> handleCompany(e)}/>
                    </div>
                    <div id="category">
                        <span id='name'>Work Location📍</span>
                        <input title='Enter your Current Work Location' placeholder='Enter your Work Location' type="text" name="location" id="location-input" value={workLocation} onChange={(e)=> handleWorkLocation(e)}/>
                    </div>
                    <div id="category">
                        <span id='name'>Work Experience✅</span>
                        <div className="d-flex">
                            <input title='Enter No. of years of Experience' placeholder='Enter No. of years' style={{width : '70px', margin : '0 10px'}} type="number" name="workExperience" id="workExperience-input" value={workExperience} onChange={(e)=> handleWorkExperience(e)}/>in years
                        </div>
                    </div>
                    </div>
                    <div id="categories">
                    <p id="title">Contact Information</p>
                    <div id="category">
                        <span id='name'>Father's Occupation🏗</span>
                        <input title="Enter your Father's occupation" placeholder="Enter your Father's occupation" type="text" name="fatherOccupation" id="fatherOccupation-input" value={fatherOccupation} onChange={(e)=> handleFatherOccupation(e)}/>
                    </div>
                    <div id="category">
                        <span id='name'>Parent's Name 👨‍👩‍👧‍👧</span>
                        <select name="mfg" id="mfg-select" value={mfgValue} onChange={(e)=> handleMfg(e)}>
                            <option name='dad' value="dad">Father</option>
                            <option name='mom' value="mom">Mother</option>
                            <option name='guardian' value="guardian">Guardian</option>
                        </select>
                        <input title={`Enter your ${mfgValue}'s name`} placeholder={`Enter your ${mfgValue}'s name`} type="text" name="parentName" id="parentName-input" value={parentName.substring(2)} onChange={(e)=> handleParentName(e)}/>
                        {/* <p id='value'>{profile.parentName && profile.parentName.substring(0,1) == 'm' ? 'Mom :  ' : 'Dad :  '} {profile.parentName.substring(2)}</p> */}
                    </div>
                    <div id="category">
                        <span id='name'>Parent's {mfgValue}'s Number📞</span>
                        <input title='Enter number with country code' placeholder='Enter number with country code' type="number" name="parentNumber" id="parentNumber-input" value={parentNumber} onChange={(e)=> handleParentNumber(e)}/>
                        {/* <p id='value'>📞{profile.parentNumber.substring(0,5)+'*****'}</p> */}
                        Check the bottom note
                    </div>
                    <div id="category">
                        <span id='name'>Email Id📧</span>
                        <input title='Enter your Email id' placeholder="Enter your Email id" type="email" name="email" id="email-input" value={email} onChange={(e)=> handleEmail(e)}/>
                        {/* <p id='value'><a href={'mailto:'+profile.email}>{profile.email}</a></p> */}
                    </div>
                    <div id="category">
                        <span id='name'>Social Media Handles📲</span>
                        <input title="Put your Page's link" placeholder="Put your Page's link" type="text" name="socialLinks" id="socialLinks-input" value={socialLinks} onChange={(e)=> handleSocialLinks(e)}/>
                        Paste your Social Media profile page's link here                       
                        {/* <p id='value'><a target={'_blank'} 
                            href={profile.socialLinks}>{profile.socialLinks && profile.socialLinks.includes('instagram') ? 'Instagram' :   profile.socialLinks.includes('facebook') ? 'Facebook' : profile.socialLinks.includes('twitter') ? 'Twitter' : 'Social Media' }  </a></p> */}
                    </div>
                    <div id="category">
                        <span id='name'>Mobile Number📞</span>
                        <input title='Enter Mobile Number with country code' placeholder='Enter Mobile number with country code' type="number" name="mobileNumber" id="mobileNumber-input" value={mobileNumber} onChange={(e)=> handleMobileNumber(e)}/>
                        {/* <p id='value'>{profile.mobileNumber.substring(0,5)+'*****'}</p> */}
                        Check the bottom note
                    </div>
                    </div>
                </div>
                <div id="description">
                    <div id="description-container">
                        <span id="title">About Me</span><br/>
                        <textarea className='textarea' type="text" name="aboutMe" id="aboutMe-input" value={aboutMe} onChange={(e)=> handleAboutMe(e)}
                         title='Enter About yourself in great detail' placeholder='Enter About yourself in great detail'    style={{resize : 'both', marginBottom : '10px', minHeight : 'fit-content'}} />
                    </div>
                    <div id="description-container">
                        <span id="title">My Expectation</span><br/>
                        <textarea className='textarea1' type="text" name="myExpectation" id="myExpectation-input" value={myExpectation} onChange={(e)=> handleMyExpectation(e)}
                        title='Describe your Expectation in Great detail' placeholder='Describe your Expectation in Great detail'    style={{resize : 'both', marginBottom : '10px', minHeight : '150px'}} />
                    </div>
                    <div id="description-container">
                        <span id="title">Quran Verse Which I Suggest</span><br/>
                        <textarea className='textarea2' type="text" name="quranVerse" id="quranVerse-input" value={quranVerse} onChange={(e)=> handleQuranVerse(e)}
                        title='Suggest One Quran Verse' placeholder="Suggest One Quran Verse along with the reference. For Example : '...They(wife) are a clothing for you and you are a clothing for them...'(Quran 2:187) "    style={{resize : 'both', marginBottom : '10px', minHeight : '150px'}} />
                    </div>
                </div>
                

            </div>
            <div id="submit" className='d-flex justify-content-center' style={{margin : '20px'}}>
                    <a className="btn btn-dark">Update Profile</a>
            </div>
            <p id='value' style={{margin : '10px'}}><b>Note : </b>⚠️We will not expose any of the user's mobile number because of spamming and privacy concerns. Entering your MobileNumber is upto your preference but we won't disclose or expose any of the user's mobile number to any of the user. The reason we collect your mobile number is to send the SMS if someone clicks on "Show Interest" button.</p>
        </div>
    </div>
    )
}
export default EditMyProfile;