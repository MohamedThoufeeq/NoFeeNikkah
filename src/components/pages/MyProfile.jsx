import samplejsonprofile from '../../../public/GetAllProfilesSample.json';
import '../css/MyProfile.css';
import { FaUserEdit } from "react-icons/fa";
import AgeCalculator from '../EditMyProfile/AgeCalculator';
import ScholarsList from '../files/ScholarsList.json';


function MyProfile(){
    const profile = samplejsonprofile.profiles[5];

    // Fixing upto 2 decimal places
    let bmi = (profile.weight / ((profile.height * profile.height) / 10000)).toFixed(2);
    const educationDefn = `{
        "primary": "Primary (Grade 1-7)",
        "secondary": "Secondary (Grade 8-10)",
        "higher": "Higher (Grade 11-12)",
        "diploma": "Diploma (Polytechnic)",
        "ug": "Bachelor's(UG)",
        "pg": "Master's(PG)",
        "phd": "Doctoral degree (Ph.D)"
     }`;
    const financialStatusDefn = `{
        "affluent": "Affluent",
        "rich": "Rich",
        "upper": "Upper Middle Class",
        "middle": "Middle Class",
        "lower": "Lower Middle Class",
        "poor": "Poor",
        "no": "Prefer Not To Say"
    }`;
    const sectDefn = `{
      "pureSunni": "Pure Sunni",
      "bidahSunni": "Sunni (non-Dargah) (Mawlid, Fatiha, etc..) (Ahlul Sunna val Jamath)",
      "dargahSunni": "Sunni (Dargah)",
      "shia": "Shia",
      "zaydiya": "Zaydiya",
      "ismayiliya": "Ismayiliya",
      "ibadiya": "Ibadiya",
      "ahmediya": "Ahmediya",
      "nizari": "Nizari",
      "sufi": "Sufi",
      "salafi": "Salafi",
      "wahhabi": "Wahhabi",
      "deobandi": "Deobandi",
      "barelvi": "Barelvi",
      "others": "Others",
      "preferNotToSay": "Prefer Not To Say"
    }`;
    const salahPatternDefn = `{
        "veryHigh": "Never Leave Fardh",
        "high": "Always Pray but leaves occassionaly",
        "medium": "Pray Sometimes",
        "low": "Pray Only Jummah and Eid",
        "kafir": "Never Prays"
    }`;
    const quranReadDefn = `{
        "daily": "Daily Read Quran",
        "veryOften": "More than Once a Week",
        "often": "Often Read",
        "ramadhan": "Only in Ramadhan",
        "not": "I don't have time to read consistently",
        "never": "Not Interested to read the Quran"
    }`;
    const practicingLevelDefn = `{
        "excellent": "Fullfills All the Fardh and AllMost of the Sunnah acts And abstain from all the major & minor sins",
        "veryHigh": "Fullfills fardh and abstain from major sins",
        "high": "Fullfills fardh",
        "medium": "Partially Fullfills the Fardh",
        "low": "Occasionaly Practice Islam",
        "kafir": "I'm a modern liberal"
    }`;
    const educationJson = JSON.parse(educationDefn);
    const financialStatusJson = JSON.parse(financialStatusDefn);
    const sectDefnJson = JSON.parse(sectDefn);
    const salahPatternJson = JSON.parse(salahPatternDefn);
    const quranReadJson = JSON.parse(quranReadDefn);
    const practicingLevelJson = JSON.parse(practicingLevelDefn);

    const age = AgeCalculator(profile.dateOfBirth);
    
    const scholars = [];

    profile.scholars.forEach(value => {
      const match = ScholarsList.scholars.find(scholar => scholar.value === value);
      if (match) {
        scholars.push(match.label);
      }
    });

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
                            <span id='name'>Gender </span>
                            <p id='value'>{profile.gender ? profile.gender == 'male' ? '♂ Male' : 'Female ♀ ' : ''}</p>
                        </div>
                        <div id="category">
                            <span id='name'>Date Of Birth</span>
                            <p id='value'>📆{profile.dateOfBirth}</p>
                        </div>
                        <div id="category">
                            <span id='name'>Age</span>
                            <p id='value'>🔢{age}</p>
                        </div>
                        <div id="category">
                            <span id='name'>Living in</span>
                            <p id='value'>📍{profile.city}, {profile.state}, {profile.country}</p>
                        </div>
                        <div id="category">
                            <span id='name'>Languages Known</span>
                            <p id='value'>🗣️{profile.languagesKnownArray.join(", ")}</p>
                        </div>
                        <div id="category">
                            <span id='name'>Marital Status</span>
                            <p id='value'>⚭  {profile.maritalStatus}</p>
                        </div>
                        <div id="category">
                            <span id='name'>Children</span>
                            <p id='value'>{'Children :  '+profile.children}
                                {profile.children == 'both' ?  (', No. of '+"Sons and Daughters"+' : '+profile.childrenCount) : 
                                    profile.children != '' 
                                    ? (', No. of '+ profile.children+' : '+profile.childrenCount)
                                    : null
                                }
                            </p>
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
                            <p id='value'>👨🏻‍🎓{educationJson[profile.education]}</p>
                        </div>
                        <div id="category">
                            <span id='name'>Occupation</span>
                            <p id='value'>💼{profile.occupationArray.join(", ")}</p>
                        </div>
                        <div id="category">
                            <span id='name'>Income / Salary (per month)</span>
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
                        <p id="title">Family Details</p>
                        <div id="category">
                            <span id='name'>Permenant Address</span>
                            <p id='value'>📍{profile.permenantCity}, {profile.permenantState}, {profile.permenantCountry}</p>
                        </div>
                        <div id="category">
                            <span id='name'>Father's Status / Occupation</span>
                            <p id='value'>🏗  {profile.fatherOccupation.join(", ")}</p>
                        </div>
                        <div id="category">
                            <span id='name'>Mother's Status / Occupation</span>
                            <p id='value'>👩‍💼 {profile.motherOccupation.join(", ")}</p>
                        </div>
                        <div id="category">
                            <span id='name'>Sibilings 👨‍👩‍👧‍👧</span>
                            <p id='value'> No. Of Brother : {profile.noOfBrother}<br/>
                                No. Of Sister : {profile.noOfSister}
                            </p>
                        </div>
                        <div id="category">
                            <span id='name'>Financial Status</span>
                            <p id="value">💵 {financialStatusJson[profile.financialStatus]}</p>
                        </div>
                    </div>
                
                <div id="categories">
                    <p id="title">Religious Information</p>
                    <div id="category">
                        <span id='name'>Revert</span>
                        <p id="value">{profile.isRevert ? 'yes' : 'no'}</p>
                        <p id="value">{profile.revertedFrom ? "Reverted From : "+ profile.revertedFrom: ''}</p>
                    </div>
                    <div id="category">
                        <span id='name'>Started Practicing From</span>
                        <p id="value">📆 {profile.startedPracticing}</p>
                    </div>
                    <div id="category">
                        <span id="name">Sect</span>
                        <p id="value">👩‍👩‍👧‍👦 {sectDefnJson[profile.sect]}</p>
                    </div>
                    <div id="category">
                        <span id="name">Salah Pattern</span>
                        <p id="value">🤲🏼 {salahPatternJson[profile.salahPattern]}</p>
                    </div>
                    <div id="category">
                        <span id="name">Quran Reading Consistency</span>
                        <p id="value">📖 {quranReadJson[profile.quranRead]}</p>
                    </div>
                    <div id="category">
                        <span id="name">Practicing level of Deen</span>
                        <p id="value">🕌 {practicingLevelJson[profile.practicingLevel]}</p>
                    </div>
                    <div id="category">
                        <span id="name">Islamic Scholars i follow</span>
                        <p id="value">👨‍🏫 {scholars.join(", ")}</p>
                    </div>
                </div>    
                <div id="categories">
                    <p id="title">Contact Information</p>
                </div>
                <div id="categories">
                    <p id="title">Contact Information</p>
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