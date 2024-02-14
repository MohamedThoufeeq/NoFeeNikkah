import samplejsonprofile from '../../../public/GetAllProfilesSample.json';
import { FaFileUpload } from "react-icons/fa";
import { useRef, useEffect, useState } from 'react';
import '../css/EditMyProfile.css'
import AgeCalculator from '../EditMyProfile/AgeCalculator.js';
import CountryStateCity from '../EditMyProfile/CountyStateCity1';


function EditMyProfile(){
    const profile = samplejsonprofile.profiles[5];
    
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

    //profileName
    const [profileName, setProfileName] = useState(profile.fullname);
                                                //Basic Information
    //dob, age
    const [dob, setDob] = useState(profile.dateOfBirth);
    const age = AgeCalculator(dob);

    //countryStateCity
    const { renderCSC, selectedCountry, selectedState, selectedCity } = CountryStateCity(profile);
    //languages
    const [languages, setLanguages] = useState(profile.languagesKnown);
    //maritalStatus
    const [maritalStatus, setMaritalStatus] = useState(profile.maritalStatus);
    //height
    const [height, setHeight] = useState(profile.height);
    //weight
    const [weight, setWeight] = useState(profile.weight);
    //bmi
    let bmi = (weight / ((height * height) / 10000)).toFixed(2);
    //pwd
    const [pwd, setPwd] = useState('no');
    // const handlePwd = (e) => {
    //     console.log("Event value : "+e.target.value)

    //     console.log('pwd before setting : '+pwd);
    //     setPwd(e.target.value);
    //     console.log('pwd after setting : '+pwd);
    //     if(pwd === 'yes'){//If he is PWD , then ask for the Type of PWD
    //         console.log('if block , pwd :'+pwd);
    //         document.querySelector('#pwd-type-input').style.display='block';
    //     } else {
    //         console.log('else block , pwd :'+pwd);
    //         document.querySelector('#pwd-type-input').style.display='none !important';
    //     }
    //     console.log(pwd);
    // }
    //bloodgroup
    const [pwdType, setPwdType] = useState(profile.pwdType);
    //bloodgroup
    const [bloodGroup, setBloodGroup] = useState(profile.bloodGroup);
                                                    //Professional background
    //education
    const [education, setEducation] = useState(profile.education);
    //occupation
    const [occupation, setOccupation] = useState(profile.occupation);
    //income
    const [income, setIncome] = useState(profile.income);
    //company
    const [company, setCompany] = useState(profile.company);
    //workLocation
    const [workLocation, setWorkLocation] = useState(profile.workLocation);
    //experience
    const [workExperience, setWorkExperience] = useState(profile.workExperience);
                                                    //Contact Information
    //fatherOccupation
    const [fatherOccupation, setFatherOccupation] = useState(profile.fatherOccupation);
    //mfg - mother , father, guardian
    const [mfg, setMfg] = useState('');
    const [mfgValue, setMfgValue] = useState(
        profile.parentName ? 
            (profile.parentName.substring(0,1)=='m' ? 'mom' : profile.parentName.substring(0,1)=='d' ? 'dad' : profile.parentName.substring(0,1)=='g' ? 'guardian' : '') 
                : '');
    const handleMfg = (e) => {
        let mfgvalue = e.target.value == 'mom' ? "m:" : e.target.value == 'dad' ? "d:" : e.target.value == 'guardian' ? "g:" : '';
        setMfg(mfgvalue);
        setMfgValue(e.target.value);
    }
    //parentName
    const [parentName, setParentName] = useState(profile.parentName);
    const handleParentName = (e) => {
        let parentNameValue = mfg + e.target.value;
        setParentName(parentNameValue);
    }
    //parentNumber
    const [parentNumber, setParentNumber] = useState(profile.parentNumber);
    //socialLinks
    const [socialLinks, setSocialLinks] = useState(profile.socialLinks);
    //email
    const [email, setEmail] = useState(profile.email);
    //mobileNumber
    const [mobileNumber, setMobileNumber] = useState(profile.mobileNumber);
                                                    //Religious information
    //isRevert
    const [isRevert, setIsRevert] = useState(profile.isRevert);
    //startedPracticing
    const [startedPracticing, setStartedPracticing] = useState(profile.startedPracticing);
    //sect
    const [sect, setSect] = useState(profile.sect);
    //salahPattern
    const [salahPattern, setSalahPattern] = useState(profile.salahPattern);//veryHigh, high, medium, low, kafir
    //practicingLevel
    const [practicingLevel, setPracticingLevel] = useState(profile.practicingLevel);//excellent, veryHigh, high, medium, low, kafir
                                                    //description
    //aboutMe
    const [aboutMe, setAboutMe] = useState(profile.aboutMe);
    //myExpectation
    const [myExpectation, setMyExpectation] = useState(profile.myExpectation);
    //quranVerse
    const [quranVerse, setQuranVerse] = useState(profile.quranVerse);
                                                    //myTaste
    //scholars
    const [scholars, setScholars] = useState(profile.scholars);
    //youtubeChannels
    const [youtubeChannels, setYoutubeChannels] = useState(profile.youtubeChannels);
    //socialMediaInfluencers
    const [socialMediaInfluencers, setSocialMediaInfluencers] = useState(profile.socialMediaInfluencers);
    useEffect(() => {
        const handlePwdRadioChange = (e) => {
            const pwdTypeInput = document.getElementById('pwd-type-input');
            pwdTypeInput.style.display = e.target.value === 'yes' ? 'block' : 'none';
        };
    
        document.getElementById('pwd-radio-one').addEventListener('change', handlePwdRadioChange);
        document.getElementById('pwd-radio-two').addEventListener('change', handlePwdRadioChange);
    
        // Clean up function
        return () => {
            document.getElementById('pwd-radio-one').removeEventListener('change', handlePwdRadioChange);
            document.getElementById('pwd-radio-two').removeEventListener('change', handlePwdRadioChange);
        };
    }, []);
    const profileData = {
        'dateOfBirth': dob,
        'languagesKnown': languages,
        'maritalStatus': maritalStatus,
        'height': height,
        'weight': weight,
        'pwd':pwd,
        'pwdType':pwdType,
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
        'myExpectation': myExpectation,
        'isRevert': isRevert,
        'startedPracticing': startedPracticing,
        'sect': sect,
        'scholars': scholars,
        'youtubeChannels': youtubeChannels,
        'socialMediaInfluencers': socialMediaInfluencers
    };
    const jsonProfileData = JSON.stringify(profileData);

    //handleSubmit buttton
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(jsonProfileData)
        try {
            const response = await fetch(`http://localhost:8080/api/${profile.id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: jsonProfileData
            });
            if (response.status === 200) {
                const responseData = await response.json();
                console.log(responseData);
                alert('Profile Updated Successfully !');
            } else {
                alert('Something Happened, Please try again later');
            }
        } catch (error) {
            console.error(error);
            // Handle errors
            alert('Something Happened, Please Retry again');
        }
    };
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
                    <h2><input type="text" value={profileName} onChange={(e)=> setProfileName(e.target.value)} /></h2>
                </span>
            </div>
            <div id="border" ></div>
            <div id="edit-my-profile-main">
                <div id="category-group">
                    <div id="categories">
                        <p id='title'>Basic Information</p>
                        <div id="category">
                            <span id='name'>Date Of Birth 📆</span>
                            <input placeholder='Enter DOB' title='Enter DOB' type='date' id='value' value={dob} onChange={(e)=>setDob(e.target.value)}/>
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
                            <input title='Enter All the know languages seperated by comma' placeholder='Enter All the know languages seperated by comma' 
                                type="text" name="language" id="language-input" value={languages} onChange={(e)=> setLanguages(e.target.value)}
                                style={{width: '250px'}}/>(seperated by comma)
                            {/* <p id='value'>🗣️{profile.languagesKnown}</p> */}
                        </div>
                        <div id="category">
                            <span id='name'>Marital Status ⚭</span>
                            <select name="maritalStatus" id="maritalStatus-input" value={maritalStatus} onChange={(e)=> setMaritalStatus(e.target.value)}>
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
                            <b>Height : </b><input title='Enter height' placeholder='Enter height' type="number" name="height" id="height-input" style={{width : '100px'}} value={height} onChange={(e) => setHeight(e.target.value)} />{' CM'}<br />
                            <b>Weight : </b><input title='Enter weight' placeholder='Enter weight' type="number" name="weight" id="weight-input" style={{width : '100px'}} value={weight} onChange={(e) => setWeight(e.target.value)} />{' Kg'}<br />
                               {/* <b> Weight</b> - {profile.weight}{'Kg  '} */}
                               <b> BMI index</b> - {bmi}
                            </div>
                            <div class="pwd-switch-field"><b style={{}}>Differently Abled ?</b>
		                        <input title='Are you Differently Abled ?' type="radio" id="pwd-radio-one" name="pwd-switch-one" value={'yes'} onChange={(e)=> setPwd(e.target.value)}/>
		                        <label for="pwd-radio-one">Yes</label>
		                        <input title='Are you Differently Abled ?' type="radio" id="pwd-radio-two" name="pwd-switch-one" value={'no'} onChange={(e)=> setPwd(e.target.value)} />
		                        <label for="pwd-radio-two">No</label>
	                        </div>
                            <div id="pwd-type-input" style={{display:'none'}}>
                                <label htmlFor="pwd-type">Type Of Disability</label>
                                <input type="text" name="pwd-type-input" id="pwt-type-input" value={pwdType} onChange={(e)=> setPwdType(e.target.value)} />
                            </div>
                        </div>
                        <div id="category">
                            <span id='name'>Blood Group 🩸</span>
                            <input title='Enter your Blood Group' placeholder='Enter your Blood Group' type="text" name="bloodGroup" id="bloodGroup-input" value={bloodGroup} onChange={(e)=> setBloodGroup(e.target.value)} />
                            {/* <p id='value'>{profile.bloodGroup}</p> */}
                        </div>

                    </div>
                    <div id="categories">
                        <p id='title'>Professional background</p>
                        <div id="category">
                            <span id='name'>Education👨🏻‍🎓</span>
                            <input title='Enter your highest degree of qualification' placeholder='Enter your highest degree' 
                            type="text" name="education" id="education-input" value={education} onChange={(e)=> setEducation(e.target.value)}
                            style={{width: '250px'}}/>
                        </div>
                        <div id="category">
                            <span id='name'>Occupation💼</span>
                            <input title='Enter your Job/Occupation' placeholder='Enter your Job/Occupation' type="text" name="occupation" id="occupation-input" value={occupation} onChange={(e)=> setOccupation(e.target.value)}/>
                        </div>
                        <div id="category">
                            <span id='name'>Income ₹</span>
                            <input title='Enter your Salary/Income' placeholder='Enter Salary/Income' type="number" name="income" id="income-input" value={income} onChange={(e)=> setIncome(e.target.value)}/>
                        </div>
                        <div id="category">
                            <span id='name'>Now Working at 🏬</span>
                            <input title='Enter your Company/Organization' placeholder='Enter Company/Organization' type="text" name="comapeny" id="company-input" value={company} onChange={(e)=> setCompany(e.target.value)}/>
                        </div>
                        <div id="category">
                            <span id='name'>Work Location📍</span>
                            <input title='Enter your Current Work Location' placeholder='Enter your Work Location' type="text" name="location" id="location-input" value={workLocation} onChange={(e)=> setWorkLocation(e.target.value)}/>
                        </div>
                        <div id="category">
                            <span id='name'>Work Experience✅</span>
                            <div className="d-flex">
                                <input title='Enter No. of years of Experience' placeholder='Enter No. of years' 
                                type="number" name="workExperience" id="workExperience-input" value={workExperience} onChange={(e)=> setWorkExperience(e.target.value)}
                                style={{width : '150px', margin : '0 10px 0 0'}} />years
                            </div>
                        </div>
                    </div>
                    <div id="categories">
                        <p id="title">Contact Information</p>
                        <div id="category">
                            <span id='name'>Father's Occupation🏗</span>
                            <input title="Enter your Father's occupation" placeholder="Enter your Father's occupation" 
                            type="text" name="fatherOccupation" id="fatherOccupation-input" value={fatherOccupation} 
                            onChange={(e)=> setFatherOccupation(e.target.value)}/>
                        </div>
                        <div id="category">
                            <span id='name'>Enter your {mfgValue ? mfgValue : 'Parent'}'s name 👨‍👩‍👧‍👧</span>
                            <select name="mfg" id="mfg-select" value={mfgValue} onChange={(e)=> handleMfg(e.target.value)}>
                                <option name='parent' value="parent">Select Parent</option>
                                <option name='mom' value="mom">Mother</option>
                                <option name='dad' value="dad">Father</option>
                                <option name='guardian' value="guardian">Guardian</option>
                            </select>
                            <input title={`Enter your ${mfgValue ? mfgValue : 'Parent'}'s name`} placeholder={`Enter your ${mfgValue ? mfgValue : 'Parent'}'s name`} type="text" name="parentName" id="parentName-input" 
                                value={ parentName ? parentName.substring(2) : ''} onChange={(e)=> handleParentName(e.target.value)}/>
                            {/* <p id='value'>{profile.parentName && profile.parentName.substring(0,1) == 'm' ? 'Mom :  ' : 'Dad :  '} {profile.parentName.substring(2)}</p> */}
                        </div>
                        <div id="category">
                            <span id='name'>Enter your {mfgValue ? mfgValue : 'Parent'}'s Number📞</span>
                            <input title='Enter number with country code' placeholder='Enter number with country code' 
                            type="number" name="parentNumber" id="parentNumber-input" value={parentNumber} onChange={(e)=> setParentNumber(e.target.value)}/>
                            {/* <p id='value'>📞{profile.parentNumber.substring(0,5)+'*****'}</p> */}
                            Check the bottom note
                        </div>
                        <div id="category">
                            <span id='name'>Email Id📧</span>
                            <input title='Enter your Email id' placeholder="Enter your Email id" type="email" name="email" id="email-input" 
                            value={email} onChange={(e)=> setEmail(e.target.value)}/>
                            {/* <p id='value'><a href={'mailto:'+profile.email}>{profile.email}</a></p> */}
                        </div>
                        <div id="category">
                            <span id='name'>Social Media Handles📲</span>
                            <input title="Put your Page's link" placeholder="Put your Page's link" 
                            type="text" name="socialLinks" id="socialLinks-input" value={socialLinks} onChange={(e)=> setSocialLinks(e.target.value)}
                            style={{width: '250px'}}/>
                            Paste your Social Media profile page's link here                       
                            {/* <p id='value'><a target={'_blank'} 
                                href={profile.socialLinks}>{profile.socialLinks && profile.socialLinks.includes('instagram') ? 'Instagram' :   profile.socialLinks.includes('facebook') ? 'Facebook' : profile.socialLinks.includes('twitter') ? 'Twitter' : 'Social Media' }  </a></p> */}
                        </div>
                        <div id="category">
                            <span id='name'>Mobile Number📞</span>
                            <input title='Enter Mobile Number with country code' placeholder='Enter Mobile number with country code' 
                            type="number" name="mobileNumber" id="mobileNumber-input" value={mobileNumber} onChange={(e)=> setMobileNumber(e.target.value)}/>
                            {/* <p id='value'>{profile.mobileNumber.substring(0,5)+'*****'}</p> */}
                            Check the bottom note
                        </div>
                    </div>
                    <div id="categories">
                        <p id="title">Religious Information</p>
                        <div id="category">
                            <div class="switch-field"><b style={{marginRight: '10px'}}>Revert</b>
		                        <input type="radio" id="radio-one" name="switch-one" value={true} onChange={(e)=> setIsRevert(e.target.value)}/>
		                        <label for="radio-one">Yes</label>
		                        <input type="radio" id="radio-two" name="switch-one" value={false} defaultChecked onChange={(e)=> setIsRevert(e.target.value)} />
		                        <label for="radio-two">No</label>
	                        </div>
                        </div>
                        <div id="category">
                            <span id='name'>Started Practicing from 📆</span>
                            <input placeholder='Enter rough date' title='Enter rough date' type='date' id='value' value={startedPracticing} onChange={(e)=>setStartedPracticing(e.target.value)}/>
                        </div>
                        <div id="category">
                            <label id='name' htmlFor="sect">Select your sect👩‍👩‍👧‍👦</label>
                            <select title='Select your sect' name="sect" id="sect-input" value={sect} onChange={(e)=>setSectInput(e.target.value)}>
                                <option value="sunni" name="sunni">Sunni</option>
                                <option value="preferNotToSay" name="preferNotToSay">PreferNotToSay</option>
                                <option value="shia" name="shia">Shia</option>
                                <option value="zaydiya" name="zaydiya">Zaydiya</option>
                                <option value="ismayiliya" name="ismayiliya">Ismayiliya</option>
                                <option value="ibadiya" name="ibadiya">Ibadiya</option>
                                <option value="ahmediya" name="ahmediya">Ahmediya</option>
                                <option value="nizari" name="nizari">Nizari</option>
                                <option value="sufi" name="sufi">Sufi</option>
                                <option value="salafi" name="salafi">Salafi</option>
                                <option value="wahhabi" name="wahhabi">Wahhabi</option>
                                <option value="deobandi" name="deobandi">Deobandi</option>
                                <option value="barelvi" name="barelvi">Barelvi</option>
                                <option value="others" name="others">Others</option>
                            </select>
                        </div>
                        <div id="category">
                            <label htmlFor="Salah Pattern" id="name">Salah Pattern🤲🏼</label>
                            <select title='Select your Salah Pattern' name="select" id="salahPattern-input" value={salahPattern} required onChange={(e)=> setSalahPattern(e.target.value)}
                            style={{maxWidth: '240px'}}>
                                <option value="select">Select your Salah patern</option>
                                <option value="veryHigh">Never Leave Fardh</option>
                                <option value="high">Always Pray but leaves occasionaly</option>
                                <option value="medium">Pray Sometimes</option>
                                <option value="low">Pray Only Jummah and Eid</option>
                                <option value="kafir">Never Prays</option>
                            </select>
                        </div>
                        <div id="category">
                            <label htmlFor="Practicing level" id="name">Practicing level🕌</label>
                            <select title='Select your practicing level of deen' name="select" id="practicingLevel-input" 
                            value={practicingLevel} required onChange={(e)=> setPracticingLevel(e.target.value)}
                            style={{maxWidth: '240px'}}>
                                <option value="select">Select your practicing Level</option>
                                <option value="excellent">Fullfills All the Fardh and AllMost of the Sunnah acts And abstain from all the major & minor sins</option>
                                <option value="veryHigh">Fullfills fardh and abstain from major sins</option>
                                <option value="high">Fullfills fardh</option>
                                <option value="medium">Partially Fullfills the Fardh</option>
                                <option value="low">Occasionaly Practice Islam</option>
                                <option value="kafir">I'm a modern liberal</option>
                            </select>
                        </div>
                        <div id="category">
                            <label htmlFor="scholars" id='name'>Name Some of the Scholars you follow👨‍🏫</label>
                            <input title='Enter some scholars name whom you follow' type="text" name="scholars" id="scholars-input"
                            placeholder='Enter multiple scholars seperated by comma'
                            value={scholars} onChange={(e)=> setScholars(e.target.value)}/>(seperated by comma)
                        </div>
                        
                    </div>
                </div>
                <div id="description">
                    <div id="description-container">
                        <span id="title">About Me</span><br/>
                        <textarea className='textarea' type="text" name="aboutMe" id="aboutMe-input" 
                         value={aboutMe} onChange={(e)=> setAboutMe(e.target.value)}
                         title='Enter About yourself in great detail' placeholder='Enter About yourself in great detail'    style={{resize : 'both', marginBottom : '10px', minHeight : 'fit-content'}} />
                    </div>
                    <div id="description-container">
                        <span id="title">My Expectation</span><br/>
                        <textarea className='textarea1' type="text" name="myExpectation" id="myExpectation-input" 
                        value={myExpectation} onChange={(e)=> setMyExpectation(e.target.value)}
                        title='Describe your Expectation in Great detail' placeholder='Describe your Expectation in Great detail'    style={{resize : 'both', marginBottom : '10px', minHeight : '150px'}} />
                    </div>
                    <div id="description-container">
                        <span id="title">Quran Verse Which I Suggest</span><br/>
                        <textarea className='textarea2' type="text" name="quranVerse" id="quranVerse-input" value={quranVerse} onChange={(e)=> setQuranVerse(e.target.value)}
                        title='Suggest One Quran Verse' placeholder="Suggest One Quran Verse along with the reference. For Example : '...They(wife) are a clothing for you and you are a clothing for them...'(Quran 2:187) "    style={{resize : 'both', marginBottom : '10px', minHeight : '150px'}} />
                    </div>
                    <div id="description-container" className='d-block justify-content-center'>
                        <span id="title">My Taste</span><br/>
                        <div id="category">
                            <label htmlFor="youtubeChannels" id='name'>Name some youtube channels you like</label>
                            <input title='Enter some youtube channels name you follow' type="text" name="youtubeChannels" id="youtubeChannels-input"
                            placeholder='Enter some youtube channels name you follow'
                            value={youtubeChannels} onChange={(e)=> setYoutubeChannels(e.target.value)}/>(seperated by comma)
                        </div>
                        <div id="category">
                            <label htmlFor="socialMediaInfluencers" id='name'>Name some Social Media Pages you like</label>
                            <input title='Enter some Social Media Pages/Influencers you follow' type="text" name="socialMediaInfluencers" id="socialMediaInfluencers-input"
                            placeholder='Enter some Social Media Pages/Influencers you follow'
                            value={socialMediaInfluencers} onChange={(e)=> setSocialMediaInfluencers(e.target.value)}/>(seperated by comma)
                        </div>
                    </div>
                </div>
            </div>
            <div id="submit" className='d-flex justify-content-center' style={{margin : '20px', gap:'20px'}}>
                <button id='submit-button' className="btn btn-success" onClick={(e)=>handleSubmit(e)}>Update Profile</button>
                <a id='cancel-button' href='/myprofile' className="btn btn-dark">Cancel</a>
            </div>
            <p id='value' style={{margin : '10px'}}><b>Note : </b>⚠️We will not expose any of the user's mobile number because of spamming and privacy concerns. Entering your MobileNumber is upto your preference but we won't disclose or expose any of the user's mobile number to any of the user. The reason we collect your mobile number is to send the SMS if someone clicks on "Show Interest" button.</p>
        </div>
    </div>
    )
}
export default EditMyProfile;