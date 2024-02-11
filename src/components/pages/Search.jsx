import { useState } from "react";
import CountryStateCity from "../Search/CountryStateCity";
import "../css/Search.css";
import GetAllProfileJsonSample from '../../../public/GetAllProfilesSample.json';
import SearchResult from "../Search/SearchResult";

function Search() {
  //seacrh url
  let searchurl = "http://localhost:8080/api/filter?";

  //Search form variables
  const [gender, setGender] = useState('');
  const [country, setCountry] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [age, setAge] = useState('');
  const [language, setLanguage] = useState("");
  const [occupation, setOccupation] = useState("");
  const [income, setIncome] = useState("");

  // const getCountryData = (searchData) => {
  //   setCountry(searchData.selectedCountry);
  //   setState(searchData.selectedState);
  //   setCity(searchData.selectedCity);
  //   setLanguage(searchData.selectedLanguage);
  // };
  const { renderCSC, selectedCountry, selectedState, selectedCity } = CountryStateCity();
  
  const handleSubmit = (e) => {
    setCountry(selectedCountry);
    setState(selectedState);
    setCity(selectedCity);
    e.preventDefault();
    //building the url based on the search input data
    searchurl = searchurl + (gender != '' ? `gender=${gender}` : 'gender=both');
    searchurl = searchurl + (selectedCountry != '' ? `&country=${selectedCountry}` : '');
    searchurl = searchurl + (selectedState != '' ? `&state=${selectedState}` : '');
    searchurl = searchurl + (selectedCity != '' ? `&city=${selectedCity}` : '');
    searchurl = searchurl + (language != '' ? `&language=${language}` : '');
    searchurl = searchurl + (age != '' ? `&age=${age}` : '');
    searchurl = searchurl + (income != '' ? `&income=${income}` : '');
    searchurl = searchurl + (occupation != '' ? `&occupation=${occupation}` : '');

    console.log(gender, country, state, city, language, age, income, occupation);
    console.log(searchurl);
    getDataFromBackend(searchurl);
    searchurl = 'http://localhost:8080/api/filter?';
  }
  const getDataFromBackend = (url) => {
    //perform get call and get the list of data in json format and return the json

    return GetAllProfileJsonSample;
  }
  return (
    <div id="search-page-container">
      <div id="search-form">
      <span id="search-header">
                <h4>Search Form</h4>
            </span>
        <div id="search-form-container">
        <div className="onefield">
            <label htmlFor="gender">Searching for:</label>
            <select name="gender" id="gender" defaultValue='both' onChange={(e)=> setGender(e.target.value)}>Select
              <option value="both" defaultChecked='both'>Bride & Groom</option>
              <option value="female">Bride</option>
              <option value="male">Groom</option>
            </select>
          </div>
          <div id="country-state-city">
            {renderCSC} {/* rendering the CountryStateCityLanguage */}
          </div>
          {/* Language Input */}
          <div className="onefield">
            <label htmlFor="language">Language:(optional)</label><br />
            <input placeholder="Expected Language" type="text" onChange={(e) => setLanguage(e.target.value) }/>
          </div>
          <div className="onefield">
            <label htmlFor="age">Age Limit:</label>
            <input type="number" name="age" placeholder="Expected Age"  onChange={(e) => setAge(e.target.value)} />
          </div>
          <div className="onefield">
            <label htmlFor="income">Income(INR):</label>
            <input type="number" name="income" placeholder="Expected Income"  onChange={(e) => setIncome(e.target.value)} />
          </div>
          <div className="onefield">
            <label htmlFor="occupation">Occupation:</label>
            <input type="text" name="occupation" placeholder="Expected Occupation"  onChange={(e) => setOccupation(e.target.value)} />
          </div>
          
      </div>
        <div className="onefield" id='submit-button'>
          <label htmlFor=""></label><br />
          <button className="btn btn-dark" type="submit" onClick={(e)=>handleSubmit(e)}>search</button>
        </div>
        </div>
      <div id="result-container">
        <SearchResult getDataFromBackend={getDataFromBackend(searchurl)}  />
      </div>
    </div>
  );
}
export default Search;
