import samplejsonprofile from '../../../public/GetAllProfilesSample.json';
import { FaFileUpload } from "react-icons/fa";
import { useRef, useEffect, useState } from 'react';
import '../css/EditMyProfile.css';
import AgeCalculator from '../EditMyProfile/AgeCalculator.js';
import CountryStateCity from '../EditMyProfile/CountyStateCity1';
import MultipleSelectInput from '../EditMyProfile/MultipleSelectInput';
import languageJson from '../files/LanguageList.json';
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'
import JobsList from '../files/JobsList.json';
import HobbiesList from '../files/HobbiesList.json';
import EthnicityList from '../files/EthnicityList.json';

function EditMyProfile(){
    const profile = samplejsonprofile.profiles[5];
    
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
    //gender
    const [gender, setGender] = useState(profile.gender);     
    //dob, age
    const [dob, setDob] = useState(profile.dateOfBirth);
    const age = AgeCalculator(dob);

    //countryStateCity
    const { renderCSC, selectedCountry, selectedState, selectedCity } = CountryStateCity(profile);
    //maritalStatus
    const [maritalStatus, setMaritalStatus] = useState(profile.maritalStatus);
    //children
    const [children, setChildren] = useState(profile.children ? profile.children : '');
    //childrenCount
    const [childrenCount, setChildrenCount] = useState(profile.childrenCount ? profile.childrenCount : '');
    //height
    const [height, setHeight] = useState(profile.height);
    //weight
    const [weight, setWeight] = useState(profile.weight);
    //bmi
    let bmi = (weight / ((height * height) / 10000)).toFixed(2);
    //pwd
    const [pwd, setPwd] = useState('no');
    //bloodgroup
    const [pwdType, setPwdType] = useState(profile.pwdType);
    //bloodgroup
    const [bloodGroup, setBloodGroup] = useState(profile.bloodGroup);
    //ethnicity
    const [ethnicity, setEthnicity] = useState(profile.ethnicity);
                                                    //Professional background
    //education
    const [education, setEducation] = useState(profile.education); //primary, secondary, higher, diploma, ug, pg, phd
    //ugCourse
    const [ugCourse, setUgCourse] = useState(profile.ugCourse);
    //pgCourse
    const [pgCourse, setPgCourse] = useState(profile.pgCourse);
    //occupation
    const [occupationArray, setOccupationArray] = useState(profile.occupationArray);
    // //occupation
    // const [occupation, setOccupation] = useState(profile.occupation);
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
    //fatherOccupation
    const [motherOccupation, setMotherOccupation] = useState(profile.motherOccupation);
    //parent
    const [parent, setParent] = useState(profile.parent);
    //parentName
    const [parentName, setParentName] = useState(profile.parentName);
    //noOfBrother
    const [noOfBrother, setNoOfBrother] = useState(profile.noOfBrother);
    //noOfSister
    const [noOfSister, setNoOfSister] = useState(profile.noOfSister);
    //financialStatus
    const [financialStatus, setFinancialStatus] = useState(profile.financialStatus);
    //familyLivingIn
    const [familyLivingIn, setFamilyLivingIn] = useState(profile.familyLivingIn);
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
    //revertedFrom
    const [revertedFrom, setRevertedFrom] = useState(profile.revertedFrom);
    //startedPracticing
    const [startedPracticing, setStartedPracticing] = useState(profile.startedPracticing);
    //sect
    const [sect, setSect] = useState(profile.sect);
    //salahPattern
    const [salahPattern, setSalahPattern] = useState(profile.salahPattern);//veryHigh, high, medium, low, kafir
    //salahPattern
    const [quranRead, setQuranRead] = useState(profile.quranRead);//daily, veryOften, often, ramadhan, not, never
    //practicingLevel
    const [practicingLevel, setPracticingLevel] = useState(profile.practicingLevel);//excellent, veryHigh, high, medium, low, kafir
                                                    //description
    //aboutMe
    const [aboutMe, setAboutMe] = useState(profile.aboutMe);
    //myExpectation
    const [myExpectation, setMyExpectation] = useState(profile.myExpectation);
    //partnerEducated
    const [partnerEducated, setPartnerEducated] = useState(profile.partnerEducated);
    //isPartnerProfessional
    const [isPartnerProfessional, setIsPartnerProfessional] = useState(profile.isPartnerProfessional);
    //partnerProfessional
    const [partnersProfession, setPartnersProfession] = useState(profile.partnersProfessionArray);
    //partnerEducation
    const [partnerEducation, setPartnerEducation] = useState(profile.partnerEducation); //primary, secondary, higher, diploma, ug, pg, phd
    //quranVerse
    const [quranVerse, setQuranVerse] = useState(profile.quranVerse);
                                                    //myTaste
    //scholars
    // const [scholars, setScholars] = useState(profile.scholars);
    const initialOptionsForScholars = [
        { value: 'ahmeddeedat', label: 'Ahmed Deedat' },
        { value: 'zakirnaik', label: 'Zakir Naik' },
        { value: 'shabirally', label: 'Shabir Ally' },
        // Add more options as needed
      ];
    const [scholarArray, setScholarArray] = useState([]);
    //languagesKnown
    const [languagesKnownArray, setLanguagesKnownAray] = useState([]);
    //youtubeChannels
    const [youtubeChannels, setYoutubeChannels] = useState(profile.youtubeChannels);
    //socialMediaInfluencers
    const [socialMediaInfluencers, setSocialMediaInfluencers] = useState(profile.socialMediaInfluencers);
    //political
    const [political, setPolitical] = useState(profile.political); //high, medium, low, never
    //hobbies
    const [hobbies, setHobbies] = useState(profile.hobbies);

    useEffect(() => {
        profile.isRevert === 'no' || profile.isRevert === null ? document.getElementById('radio-two').setAttribute('checked', true) 
            : profile.isRevert === 'yes' ? document.getElementById('radio-one').setAttribute('checked', true) : null;

        profile.pwd === 'no' || profile.pwd === null ? document.getElementById('pwd-radio-two').setAttribute('checked', true) 
            : profile.pwd === 'yes' ? document.getElementById('pwd-radio-one').setAttribute('checked', true) : null;
        
            const handlePwdRadioChange = (e) => {
            const pwdTypeInput = document.getElementById('pwd-type-input');
            pwdTypeInput.style.display = e.target.value === 'yes' ? 'block' : 'none';

        };

        document.getElementById('radio-one').addEventListener('change', ()=> {
            document.getElementById('radio-one').value === 'yes' ? document.getElementById('revertedFrom').style.display="block" : null;
        })
        document.getElementById('radio-two').addEventListener('change', ()=> {
            document.getElementById('radio-two').value === 'no' ? document.getElementById('revertedFrom').style.display="none" : null;
        })


        document.getElementById('pwd-radio-one').addEventListener('change', handlePwdRadioChange);
        document.getElementById('pwd-radio-two').addEventListener('change', handlePwdRadioChange);
        // Clean up function
        return () => {
            document.getElementById('revertedFrom').style.display="none";
            document.getElementById('pwd-radio-one').removeEventListener('change', handlePwdRadioChange);
            document.getElementById('pwd-radio-two').removeEventListener('change', handlePwdRadioChange);
        };
    }, []);
    const profileData = {
        'fullName': profileName,
        'gender': gender,
        'dateOfBirth': dob,
        'country': selectedCountry,
        'state': selectedState,
        'city': selectedCity,
        'languagesKnownArray': languagesKnownArray,
        'maritalStatus': maritalStatus,
        'children': children,
        'childrenCount': childrenCount,
        'height': height,
        'weight': weight,
        'pwd':pwd,
        'pwdType':pwdType,
        'bloodGroup': bloodGroup,
        'ethnicity': ethnicity,
        'education': education,
        'occupationArray': occupationArray,
        'income': income,
        'company': company,
        'workLocation': workLocation,
        'workExperience': workExperience,
        'motherOccupation': motherOccupation,
        'fatherOccupation': fatherOccupation,
        'noOfBrother': noOfBrother,
        'noOfSister': noOfSister,
        'parent': parent,
        'parentName': parentName,
        'parentNumber': parentNumber,
        'socialLinks': socialLinks,
        'email': email,
        'mobileNumber': mobileNumber,
        'aboutMe': aboutMe,
        'myExpectation': myExpectation,
        'isRevert': isRevert,
        'quranVerse': quranVerse,
        'quranRead': quranRead,
        'revertedFrom': revertedFrom,
        'startedPracticing': startedPracticing,
        'sect': sect,
        'scholarArray': scholarArray,
        'youtubeChannels': youtubeChannels,
        'socialMediaInfluencers': socialMediaInfluencers,
        'hobbies': hobbies,
        'partnerEducated': partnerEducated,
        'partnerEducation': partnerEducation,
        'isPartnerProfessional': isPartnerProfessional,
        'partnersProfession': partnersProfession
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
                    <input accept='image/*' title='Upload your profile photo in 1:1 aspect ration (square)' type="file" ref={inputref} className='d-none' onChange={(e) => handleUpload(e)}></input>
                    <img src={image} id='preview-image' className={image ? 'd-flex' : 'd-none'} alt="Profile Picture Preview" />
                    <img src="../../../public/profile_img_boy.jpg" className={image ? 'd-none' : 'd-flex'} alt="Profile Picture" />
                </div> <span id='username' title='username'>{profile.username}</span>

                <span id="name">
                    <h2><input placeholder='Enter your Full Name' title='Enter your Full Name' type="text" value={profileName} onChange={(e)=> setProfileName(e.target.value)} /></h2>
                </span>
            </div>
            <div id="border" ></div>
            <div id="edit-my-profile-main">
                <div id="category-group">
                    <div id="categories">
                        <p id='title'>Basic Information</p>
                        <div id="category" title='Chooose Gender'>
                            <span id='name'>♀ Gender ♂</span>
                            <select name="gender" id="gender-input" value={gender} onChange={(e)=> setGender(e.target.value)}>
                                <option value={null}>Select Gender</option>
                                <option value="male">Male ♂ </option>
                                <option value="female">Female ♀ </option>
                            </select>
                        </div>
                        <div id="category" title='Enter DOB'>
                            <span id='name'>Date Of Birth 📆</span>
                            <input placeholder='Enter DOB' title='Enter DOB' type='date' id='value' value={dob} onChange={(e)=>setDob(e.target.value)}/>
                        </div>
                        <div id="category">
                            <span id='name'>Age 🔢</span>
                            <p id='value'>{age}</p>
                        </div>
                        <div id="category" title='Enter your Country State City you belongs to'>
                            <span id='name'>Living in 📍</span>
                            <div id='value'>{renderCSC}</div>
                        </div>
                        <div id="category" title='Enter your known languages'>
                            <span id='name'>Languages Known 🗣️</span>
                            <MultipleSelectInput  onCreateOption={false} inputData={languageJson.lang} setArray={setLanguagesKnownAray} isLanguage={true}
                                placeholder={'Enter all the languages you know'}/>
                            Select your Mother Tongue as First option
                        </div>
                    </div>
                    <div id="categories">
                    <p id='title'>Basic Information</p>
                        <div id="category" title='Enter your Marital Status'>
                            <span id='name'>Marital Status ⚭</span>
                            <select title='Enter you Marital Status' name="maritalStatus" id="maritalStatus-input" value={maritalStatus} onChange={(e)=> setMaritalStatus(e.target.value)}>
                                <option value={null}>Select Marital Status</option>
                                <option value="single">Single</option>
                                <option value="married">Married</option>
                                <option value="divorcee">Divorcee</option>
                                <option value="widow">Widow</option>
                                <option value="widower">Widower</option>
                            </select>
                        </div>
                        <div id="category" title='Enter your children (if any)'>
                            <span id="name">Children (if any)</span>
                            <select title='Choose your children' id='children-input' value={children} onChange={(e)=> setChildren(e.target.value)} >
                                <option value=''>Select Children</option>
                                <option value="son">Son</option>
                                <option value="daughter">Daughter</option>
                                <option value="both">Both</option>
                            </select>
                            <input type="number" title={'Enter No. of '+children} placeholder={`Enter No. of ${children === '' ? 'Children' : children+"s"}`} value={childrenCount} 
                                onChange={(e)=> setChildrenCount(e.target.value)} style={{marginTop:'10px'}} />
                        </div>
                        <div id="category" title='Enter your Height and Weight'>
                            <span id='name'>Physical Information 💪🏻</span>
                            <div id='value'>
                                {'Height : '}
                                <input title='Enter height' placeholder='Enter height' type="number" name="height" id="height-input" 
                                    style={{width : '150px', marginBottom:'10px'}} value={height} onChange={(e) => setHeight(e.target.value)} />{' CM'}<br />
                                {'Weight : '}
                                <input title='Enter weight' placeholder='Enter weight' type="number" name="weight" id="weight-input" 
                                    style={{width : '150px'}} value={weight} onChange={(e) => setWeight(e.target.value)} />{' Kg'}<br />
                                   {/* <b> Weight</b> - {profile.weight}{'Kg  '} */}
                            </div>
                        </div>
                        <div id="category">
                            <span id='name'>BMI 🧍🏼</span>
                            <p id='value'>{bmi}</p>
                        </div>
                        <div id="category" title='Are you Differently Abled ?'>
                            <span id="name">PWD♿️</span>
                            <div class="pwd-switch-field" title='Are you Differently Abled ?'>Differently Abled ?
		                        <input  title='Are you Differently Abled ?' type="radio" id="pwd-radio-one" name="pwd-switch-one" value={'yes'} onChange={(e)=> setPwd(e.target.value)}/>
		                        <label style={{marginLeft:'10px'}} for="pwd-radio-one">Yes</label>
		                        <input title='Are you Differently Abled ?' type="radio" id="pwd-radio-two" name="pwd-switch-one" value={'no'} onChange={(e)=> setPwd(e.target.value)} />
		                        <label for="pwd-radio-two">No</label>
	                        </div>
                            <div id="pwd-type-input" style={{display:'none'}} title='Enter your Type of Disability'>
                                <label htmlFor="pwd-type">Type Of Disability :</label>
                                <input type="text" name="pwd-type-input" id="pwt-type-input" value={pwdType} 
                                    onChange={(e)=> setPwdType(e.target.value)} placeholder='Enter your Type of Disability' style={{width : '100%'}}/>
                            </div>
                        </div>
                        <div id="category" title='Enter your Blood Group'>
                            <span id='name'>Blood Group 🩸</span>
                            <input title='Enter your Blood Group' placeholder='Enter your Blood Group' type="text" name="bloodGroup" id="bloodGroup-input" value={bloodGroup} onChange={(e)=> setBloodGroup(e.target.value)} />
                        </div>
                        <div id="category" title='Enter your Ethnicity'>
                            <span id='name'>Enter your Ethnicity 🗺 </span>
                            <MultipleSelectInput  onCreateOption={false} inputData={EthnicityList.data} setArray={setEthnicity} isLanguage={false}
                            placeholder={"Enter your Ethnicity"}/>
                        </div>
                    </div>
                    <div id="categories">
                        <p id='title'>Professional background</p>
                        <div id="category" title='Fill out your education details'>
                            <span id='name'>Education👨🏻‍🎓</span>
                            <select title='Select your highest degree of qualificatoin'
                                type="text" name="education" id="education-input" value={education} onChange={(e)=> setEducation(e.target.value)}
                                style={{width: '250px'}}>
                                <option value={null}>Select your highest qualification</option>
                                <option value="primary">Primary (Grade 1-7)</option>
                                <option value="secondary">Secondary (Grade 8-10)</option>
                                <option value="higher">Higher (Grade 11-12)</option>
                                <option value="diploma">Diploma (Polytechnic)</option>
                                <option value="ug">Bachelor's (UG)</option>
                                <option value="pg">Master's (PG)</option>
                                <option value="phd">Doctoral degree (Ph.D)</option>
                            </select>
                            <input type="text" className={education != 'Select your highest qualification' || education != null ?( education == 'primary'|| education == 'secondary' || education == 'higher'  ? 'd-none' : 'block' ) : 'd-none' }
                                placeholder={'Enter your Stream in '+(education == 'pg' || education == 'phd' ? 'ug' : education)}
                                title={'Enter your Stream in '+(education == 'pg' || education == 'phd' ? 'ug' : education)}
                                value={ugCourse} onChange={(e)=> setUgCourse(e.target.value)}
                                style={{marginBlock: '10px'}}/>

                            <input className={education ?( education == 'pg'|| education == 'phd' ? 'block' : 'd-none' ) : 'd-none' } type="text" 
                                title={'Enter your Stream in '+ education} placeholder={'Enter your Stream in '+ education} 
                                value={pgCourse} onChange={(e)=> setPgCourse(e.target.value)}/>
                        </div>
                        <div id="category"  title='Enter your Job / Occupation'>
                            <span id='name'>Occupation💼</span>
                            <MultipleSelectInput  onCreateOption={true} inputData={JobsList.occupations} setArray={setOccupationArray} isLanguage={false}
                                placeholder={'Enter your Profession'}/>
                            Enter your Job/Occupation
                        </div>
                        <div id="category" title='Enter your Salary/Income per month'>
                            <span id='name'>Income per month ₹</span>
                            <input title='Enter your Salary/Income per month' placeholder='Enter Salary/Income per month' type="number" name="income" id="income-input" value={income} onChange={(e)=> setIncome(e.target.value)}/>
                        </div>
                        <div id="category" title='Enter your Company/Organization'>
                            <span id='name'>Now Working at 🏬</span>
                            <input title='Enter your Company/Organization' placeholder='Enter Company/Organization' type="text" name="comapeny" id="company-input" value={company} onChange={(e)=> setCompany(e.target.value)}/>
                        </div>
                        <div id="category" title='Enter your Current Work Location'>
                            <span id='name'>Work Location📍</span>
                            <input title='Enter your Current Work Location' placeholder='Enter your Work Location' type="text" name="location" id="location-input" value={workLocation} onChange={(e)=> setWorkLocation(e.target.value)}/>
                        </div>
                        <div id="category" title='Enter No. of years of Experience'>
                            <span id='name'>Work Experience✅</span>
                            <div className="d-flex">
                                <input title='Enter No. of years of Experience' placeholder='Enter No. of years' 
                                    type="number" name="workExperience" id="workExperience-input" value={workExperience} onChange={(e)=> setWorkExperience(e.target.value)}
                                    style={{width : '150px', margin : '0 10px 0 0'}} />years
                            </div>
                        </div>
                    </div>
                    <div id="categories">
                        <p id="title">Family Details</p>
                        
                        <div id="category" title="Enter your Father's status / occupation">
                            <span id='name'>Father's Status / Occupation🏗</span>
                            {/* <input placeholder="Enter your Father's status / occupation" 
                            type="text" name="fatherOccupation" id="fatherOccupation-input" value={fatherOccupation} 
                            onChange={(e)=> setFatherOccupation(e.target.value)}/> */}
                            <MultipleSelectInput  onCreateOption={true} inputData={JobsList.occupations} setArray={setFatherOccupation} isLanguage={false}
                                placeholder={"Enter your Father's  Profession/Status"}/>
                        </div>
                        <div id="category" title="Enter your Mother's status / occupation">
                            <span id='name'>Mother's Status / Occupation👩‍💼</span>
                            {/* <input placeholder="Enter your Mother's status / occupation" 
                            type="text" name="motherrOccupation" id="motherOccupation-input" value={motherOccupation} 
                            onChange={(e)=> setMotherOccupation(e.target.value)}/> */}
                            <MultipleSelectInput  onCreateOption={true} inputData={JobsList.occupations} setArray={setMotherOccupation} isLanguage={false}
                                placeholder={"Enter your Mother's  Profession/Status"}/>
                        </div>
                        <div id="category" className='d-block' title='Enter your sibilings data'>
                            <span id='name'>Sibilings👨‍👧‍👦</span><br />
                            <label htmlFor="brother" style={{paddingRight: '10px'}}>Brother :</label>
                            <input type="number" id='brother-input' placeholder='Enter No. Of Brothers' title='No. Of Brothers' 
                                value={noOfBrother} onChange={(e)=> setNoOfBrother(e.target.value)} style={{ width:'70%', marginBottom: '10px'}}/><br/>
                            <label htmlFor="brother" style={{paddingRight: '10px'}}>Sister :</label>
                            <input type="number" id='sister-input' placeholder='Enter No. Of Sisters' title='No. Of Sisters' 
                                value={noOfSister} onChange={(e)=> setNoOfSister(e.target.value)} style={{width:'70%'}}/>
                        </div>
                        <div id="category" title='Enter your sibilings data'>
                            <span id='name'>Family's financial status 💵</span>
                            <select name="financial-status" id="financialStatus-select" value={financialStatus} onChange={(e)=> setFinancialStatus(e.target.value)}>
                                <option value={null}>Select</option>
                                <option value="affluent">Affluent</option>
                                <option value="rich">Rich</option>
                                <option value="upper">Upper Middle Class</option>
                                <option value="middle">Middle Class</option>
                                <option value="lower">Lower Middle Class</option>
                                <option value="poor">Poor</option>
                                <option value="no">Prefer Not To Say</option>
                            </select>
                        </div>
                        <div id="category" title='Enter the location of Family Living in'>
                        <span id='name'>Family living in 👨‍👨‍👧‍👧 📍</span>
                        <input type="text" placeholder='City, State, Country' value={familyLivingIn} onChange={(e)=> setFamilyLivingIn(e.target.value)} />
                        </div>
                    </div>
                    <div id="categories">
                        <p id="title">Religious Information</p>
                        <div id="category" title='Are you a revert ? Enter your past faith'>
                            <div class="switch-field"><b style={{marginRight: '10px'}}>Revert</b>
		                        <input type="radio" id="radio-one" name="switch-one" value={'yes'} onChange={(e)=> setIsRevert(e.target.value)}/>
		                        <label for="radio-one">Yes</label>
		                        <input type="radio" id="radio-two" name="switch-one" value={'no'} onChange={(e)=>setIsRevert(e.target.value)}/>
		                        <label for="radio-two">No</label>
	                        </div>
                            <label htmlFor="Reverted from" id='revertedFrom'><b>Reverted From</b>
                            <input type="text" placeholder='Enter your past faith'  value={revertedFrom} onChange={(e)=> setRevertedFrom(e.target.value)}/></label>
                        </div>
                        <div id="category" title='Enter the approximate date when you started to practise Islam in a full pace'>
                            <span id='name'>Started Practicing from 📆</span>
                            <input placeholder='Enter rough date' title='Enter rough date' type='date' id='value' value={startedPracticing} onChange={(e)=>setStartedPracticing(e.target.value)}/>
                        </div>
                        <div id="category"  title='Select your sect'>
                            <label id='name' htmlFor="sect">Select your sect👩‍👩‍👧‍👦</label>
                            <select name="sect" id="sect-input" value={sect} onChange={(e)=>setSectInput(e.target.value)} width={'250'}
                                style={{maxWidth: '240px'}}>
                                <option value="pure-sunni" name="pure-sunni">Pure Sunni</option>
                                <option value="bidah-sunni" name="bidah-sunni">Sunni (non-Dargah) (Mawlid, Fatiha, etc..) (Ahlul Sunna val Jamath)</option>
                                <option value="dargah-sunni" name="dargah-sunni">Sunni (Dargah)</option>
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
                                <option value="preferNotToSay" name="preferNotToSay">PreferNotToSay</option>
                            </select>
                        </div>
                        <div id="category"  title='Select your Salah Pattern'>
                            <label htmlFor="Salah Pattern" id="name">Salah Pattern🤲🏼</label>
                            <select name="select" id="salahPattern-input" value={salahPattern} required onChange={(e)=> setSalahPattern(e.target.value)}
                                style={{maxWidth: '240px'}}>
                                <option value={null}>Select your Salah patern</option>
                                <option value="veryHigh">Never Leave Fardh</option>
                                <option value="high">Always Pray but leaves occasionaly</option>
                                <option value="medium">Pray Sometimes</option>
                                <option value="low">Pray Only Jummah and Eid</option>
                                <option value="kafir">Never Prays</option>
                            </select>
                        </div>
                        <div id="category" title='Enter your consistency'>
                            <span id="name">How Often you read the Quran 📖</span>
                            <select name="quranRead" id="quranRead-input" value={quranRead} onChange={(e)=> setQuranRear(e.target.value)} style={{maxWidth: '240px'}}>
                                <option value={null}>Select your Consistency</option>
                                <option value="daily">Daily</option>
                                <option value="veryOften">More than Once a Week</option>
                                <option value="often">Often Read</option>
                                <option value="ramadhan">Only in Ramadhan</option>
                                <option value="not">I don't have time to read consistently</option>
                                <option value="never">Not Interested to read the Quran</option>
                            </select>
                        </div>
                        <div id="category" title='Select your practicing level of deen'>
                            <label htmlFor="Practicing level" id="name">Practicing level🕌</label>
                            <select name="select" id="practicingLevel-input" 
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
                        <div id="category" title='Enter the scholars you like / follow'>
                            <label htmlFor="scholars" id='name'>Name Some of the Scholars you follow👨‍🏫</label>
                            <MultipleSelectInput  onCreateOption={true} inputData={initialOptionsForScholars} setArray={setScholarArray} isLanguage={false}
                                placeholder={'Enter some scholars which you follow'}/>
                        </div>
                    </div>
                    <div id="categories">
                        <p id='title'>My Taste and Preferences</p>
                        <div id="category" title='Enter some youtube channels name you follow' >
                            <label htmlFor="youtubeChannels" id='name'>Name some youtube channels you like</label>
                            <input type="text" name="youtubeChannels" id="youtubeChannels-input"
                                placeholder='Enter some youtube channels name you follow'
                                value={youtubeChannels} onChange={(e)=> setYoutubeChannels(e.target.value)}/>(multiple entries seperated by comma)
                        </div>
                        <div id="category" title='Enter some Social Media Pages/Influencers you follow'>
                            <label htmlFor="socialMediaInfluencers" id='name'>Name some Social Media Pages you like</label>
                            <input type="text" name="socialMediaInfluencers" id="socialMediaInfluencers-input"
                                placeholder='Enter some Social Media Pages/Influencers you follow'
                                value={socialMediaInfluencers} onChange={(e)=> setSocialMediaInfluencers(e.target.value)}/>(multiple entries seperated by comma)
                        </div>
                        <div id='category' title='Select your political awareness'>
                            <span id='name'>How political are you ?</span>
                            <select id='political-select' value={political} onChange={(e)=> setPolitical(e.target.value)} 
                            style={{width:'100%'}}>
                                <option value={null}>Selct your awareness</option>
                                <option value='high'>Highly aware (GeoPoliitics)</option>
                                <option value='medium'>Aware of (Local Politics)</option>
                                <option value='low'>Unaware of Politics</option>
                                <option value='never'>Not interested in knowing politics</option>
                            </select>
                        </div>
                        <div id='category' title='Enter your Interests'>
                            <span id="name">Hobbies / Interests</span>
                            <MultipleSelectInput  isLanguage={false} onCreateOption={true} inputData={HobbiesList.hobbies} setArray={setHobbies}
                                placeholder={'Enter your hobbies and interests'}/>
                        </div>
                        <div id="category">
                            <span id="name"> Do you want your Partner to be working professional ?</span>
                            <select name="partner-professional" id="partner-professional-select" value={isPartnerProfessional} onChange={(e)=> setIsPartnerProfessional(e.target.value)} >
                                <option value={null}>Select</option>
                                <option value={'yes'}>Yes</option>
                                <option value={'no'}>No</option>
                            </select>
                            <div style={{textAlign: 'left'}} className={isPartnerProfessional ? (isPartnerProfessional == 'yes' ? 'd-block text-align-left' : 'd-none text-align-left') : 'd-none text-align-left' }>
                                <MultipleSelectInput  onCreateOption={true} inputData={JobsList.occupations} setArray={setPartnersProfession} isLanguage={false} placeholder={'Select the professions that you are ok with it'}/>
                            </div>
                        </div>
                        <div id="category">
                            <span id="name"> Do you want your Partner to be Educated ?</span>
                            <select name="partner-educated" id="partner-educated-select" value={partnerEducated} onChange={(e)=> setPartnerEducated(e.target.value)}>
                                <option value={null}>Select</option>
                                <option value={'yes'}>Yes</option>
                                <option value={'no'}>No</option>
                            </select>
                            <select className={partnerEducated ? (partnerEducated == 'yes' ? 'd-block' : 'd-none') : 'd-none'} title="Select your partner's highest degree of qualificatoin"
                                name="partner-education" id="partner-education-input" value={partnerEducation} onChange={(e)=> setPartnerEducation(e.target.value)}
                                style={{width: '100%'}}>
                                <option value={null}>Select your partner's highest qualification</option>
                                <option value="primary">Primary (Grade 1-7)</option>
                                <option value="secondary">Secondary (Grade 8-10)</option>
                                <option value="higher">Higher (Grade 11-12)</option>
                                <option value="diploma">Diploma (Polytechnic)</option>
                                <option value="ug">Bachelor's (UG)</option>
                                <option value="pg">Master's (PG)</option>
                                <option value="phd">Doctoral degree (Ph.D)</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div id="description">
                    <div id="description-container">
                        <span id='title'>Contact information</span>
                        <div className='dc-fields' title='Enter your Email id' style={{ paddingBottom:'15px'}}>
                            <span id='name'>Email Id📧</span>
                            <input placeholder="Enter your Email id" type="email" name="email" id="email-input" 
                                value={email} onChange={(e)=> setEmail(e.target.value)} style={{width:'90%'}}/>
                            {/* <p id='value'><a href={'mailto:'+profile.email}>{profile.email}</a></p> */}
                        </div>
                        <div className='dc-fields' title="Put your Page's link">
                            <span id='name'>Social Media Handles📲</span>
                            <input  placeholder="Put your Page's link" 
                                type="text" name="socialLinks" id="socialLinks-input" value={socialLinks} onChange={(e)=> setSocialLinks(e.target.value)}
                                style={{width:'90%'}}/>
                            Paste your Social Media profile page's link here                       
                            {/* <p id='value'><a target={'_blank'} 
                                href={profile.socialLinks}>{profile.socialLinks && profile.socialLinks.includes('instagram') ? 'Instagram' :   profile.socialLinks.includes('facebook') ? 'Facebook' : profile.socialLinks.includes('twitter') ? 'Twitter' : 'Social Media' }  </a></p> */}
                        </div>
                        <div className='dc-fields' title='Enter Mobile Number with country code'>
                            <span id='name'>Mobile Number📞</span>
                            <PhoneInput international defaultCountry="IN" value={mobileNumber} onChange={setMobileNumber}/>
                            {/* <input placeholder='Enter Mobile number with country code' 
                            type="number" name="mobileNumber" id="mobileNumber-input" value={mobileNumber} onChange={(e)=> setMobileNumber(e.target.value)}
                            style={{width:'90%'}}/> */}
                            {/* <p id='value'>{profile.mobileNumber.substring(0,5)+'*****'}</p> */}
                            Check the bottom note
                        </div>
                        <div id="category" title={`Enter your ${parent ? parent : 'Parent'}'s name`}>
                            <span id='name'>Enter your {parent ? parent : 'Parent'}'s name 👨‍👩‍👧‍👧</span>
                            <select name="mfg" id="mfg-select" value={parent} onChange={(e)=> setParent(e.target.value)}>
                                <option name='parent' value="">Select Parent</option>
                                <option name='mom' value="mom">Mother</option>
                                <option name='dad' value="dad">Father</option>
                                <option name='guardian' value="guardian">Guardian</option>
                            </select>
                            <input title={`Enter your ${parent ? parent : 'Parent'}'s name`} placeholder={`Enter your ${parent ? parent : 'Parent'}'s name`} type="text" name="parentName" id="parentName-input" 
                                value={ parentName ? parentName.substring(2) : ''} onChange={(e)=> setParentName(e.target.value)}/>
                            {/* <p id='value'>{profile.parentName && profile.parentName.substring(0,1) == 'm' ? 'Mom :  ' : 'Dad :  '} {profile.parentName.substring(2)}</p> */}
                        </div>
                        <div id="category" title='Enter number with country code'>
                            <span id='name'>Enter your {parent ? parent : 'Parent'}'s Number📞</span>
                            <PhoneInput international defaultCountry="IN" value={parentNumber} onChange={setParentNumber}/>
                            {/* <input placeholder='Enter number with country code' 
                            type="phone" name="parentNumber" id="parentNumber-input" value={parentNumber} onChange={(e)=> setParentNumber(e.target.value)}/> */}
                            {/* <p id='value'>📞{profile.parentNumber.substring(0,5)+'*****'}</p> */}
                            Check the bottom note
                        </div>
                    </div>
                    <div id="description-container" title='Enter About yourself in great detail'>
                        <br /><span id="title">About Me</span><br/>
                        <textarea className='textarea' type="text" name="aboutMe" id="aboutMe-input" 
                         value={aboutMe} onChange={(e)=> setAboutMe(e.target.value)}
                         placeholder='Enter About yourself in great detail'    
                         style={{resize : 'vertical', marginBottom : '10px', minHeight : '150px', width: '90%'}} />
                    </div>
                    <div id="description-container" title='Describe your Expectation in Great detail'>
                        <br /><span id='title'>Describe your Expectation in words</span><br />
                        <textarea className='textarea1' type="text" name="myExpectation" id="myExpectation-input" 
                            value={myExpectation} onChange={(e)=> setMyExpectation(e.target.value)}
                            placeholder='Describe your Expectation in Great detail'    
                            style={{resize : 'vertical', marginBottom : '10px', minHeight : '150px',  width: '90%'}} />
                    </div>
                    <div id="description-container" title='Suggest One Quran Verse'>
                        <br /><span id="title">Quran Verse Which I Suggest</span><br/>
                        <textarea className='textarea2' type="text" name="quranVerse" id="quranVerse-input" value={quranVerse} onChange={(e)=> setQuranVerse(e.target.value)}
                            placeholder="Suggest One Quran Verse along with the reference. For Example : '...They(wife) are a clothing for you and you are a clothing for them...'(Quran 2:187) "    
                            style={{resize : 'vertical', marginBottom : '10px', minHeight : '150px', width:'90%'}} />
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