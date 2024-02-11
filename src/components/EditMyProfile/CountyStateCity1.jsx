import { useEffect, useState } from "react";
import jsondata from "../files/country-state-city.json";
import "../css/CountryStateCity.css";
// import the Autocomplete component
import Autocomplete from "./Autocomplete.jsx";

function CountryStateCity1(profile) {
  const [data, setData] = useState([]);
  const [state, setState] = useState([]);
  const [city, setCity] = useState([]);

  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  useEffect(() => {
    setData(jsondata.content);
  }, []);

  //removing duplicate country names
  let country = [...new Set(data.map((item) => item.country))];
  country.sort();

  const handleCountryChange = (value) => {
    console.log(value);
    setState("Select State");
    setCity("Select City");
    //As you select country from select box, in below line we filter that country from all data so that we can get subcountry(state), name(city) out of it.
    let Singlecountry = data.filter((item) => item.country === value);
    setSelectedCountry(value);
    //now this singleCountry which is getting the name of subcountry(state) multiple times. So to remove duplicates set is used.
    let states = [...new Set(Singlecountry.map((item) => item.subcountry))];
    //after removing the duplicate subcountry names(state names). we have saved the data in state state using setState.
    setState(states);
    document.querySelector("#state-input").style.display = "block";
  };

  const handleStateChange = (value) => {
    //here when user selects particular subcountry(state name), we have checked again with original data to get all subcounty that match that name. to get the data of perticular city.
    let singleCity = data.filter((item) => item.subcountry === value);
    setSelectedState(value);
    setCity(singleCity);
    document.querySelector("#city-input").style.display = "block";
  };
  const countryData = { selectedCountry, selectedState, selectedCity };
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
          {/* replace the select element with the Autocomplete element */}
          <Autocomplete
            data={country}
            label="Country:"
            value={selectedCountry}
            onChange={(value) => handleCountryChange(value)}
          />
        </div>

        {/*State Selection */}
        <div className="onefield" id="state-input">
          {/* replace the select element with the Autocomplete element */}
          <Autocomplete
            data={state}
            label="State:"
            value={selectedState}
            onChange={(value) => handleStateChange(value)}
          />
        </div>
        {/*City Selection */}
        <div className="onefield" id="city-input">
          <label>City: (optional) </label>
          <br></br>
          {/* replace the select element with the Autocomplete element */}
          <Autocomplete
            data={city.map((item) => item.name)}
            label="City:"
            value={selectedCity}
            onChange={(value) => setSelectedCity(value)}
          />
        </div>
      </>
    ),
  };
}

export default CountryStateCity1;
