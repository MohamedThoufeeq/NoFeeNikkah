import { useEffect, useState } from "react";
import jsondata from "../files/country-state-city.json";
import '../css/CountryStateCity.css';

function CountryStateCity() {
  const [data, setData] = useState([]);
  const [state, setState] = useState([]);
  const [city, setCity] = useState([]);
  
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');


  useEffect(() => {
    setData(jsondata.content);
  }, []);

  //removing duplicate country names
  let country = [...new Set(data.map((item) => item.country))];
  country.sort();

  const handleCountryChange = (e) => {
    setState("Select State");
    setCity("Select City");
    //As you select country from select box, in below line we filter that country from all data so that we can get subcountry(state), name(city) out of it.
    let Singlecountry = data.filter((item) => item.country === e.target.value);
    setSelectedCountry(e.target.value);
    //now this singleCountry which is getting the name of subcountry(state) multiple times. So to remove duplicates set is used.
    let states = [...new Set(Singlecountry.map((item) => item.subcountry))];
    //after removing the duplicate subcountry names(state names). we have saved the data in state state using setState.
    setState(states);
    document.querySelector("#state-input").style.display='block';
  };

  const handleStateChange = (e) => {
    //here when user selects particular subcountry(state name), we have checked again with original data to get all subcounty that match that name. to get the data of perticular city.
    let singleCity = data.filter((item) => item.subcountry === e.target.value);
    setSelectedState(e.target.value);
    setCity(singleCity);
    document.querySelector("#city-input").style.display='block';
  };
  const countryData = {selectedCountry,selectedState,selectedCity};
  // props.getCountryData(countryData);
  // {console.log(selectedCountry, selectedState, selectedCity);}
  return {
    selectedCountry,
    selectedState,
    selectedCity,
    renderCSC: (
      <>
        {/*Country Selection */}
        <div className="onefield">
          <label>Country: </label>
          <br />
          <select onChange={(e) => handleCountryChange(e)}>
            <option>Select Country</option>
            {country?.map((item, index) => (
              <option key={index} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        {/*State Selection */}
        <div className="onefield" id="state-input">
          <label>State: </label>
          <br />
          <select onChange={(e) => handleStateChange(e)}>
            <option>Select State</option>
            {state !== "Select State" &&
              state?.map((item, index) => (
                <option key={index} value={item}>
                  {item}
                </option>
              ))}
          </select>
        </div>
        {/*City Selection */}
        <div className="onefield" id="city-input">
          <label>City: (optional) </label>
          <br></br>
          <select onChange={(e) => setSelectedCity(e.target.value)}>
            <option>Select City</option>
            {city !== "Select City" &&
              city?.map((item, index) => (
                <option key={index} value={item?.name}>
                  {item?.name}
                </option>
              ))}
          </select>
        </div>
        
      </>
    ),
  };
}

export default CountryStateCity;
