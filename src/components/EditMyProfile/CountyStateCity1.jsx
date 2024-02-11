import { useEffect, useState } from "react";
import jsondata from "../files/country-state-city.json";
import "../css/CountryStateCity.css";
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

  const handleCountrySelect = (value) => {
    setSelectedCity(value);
    setState("Select State");
    setCity([]); // Clear city array when country is selected
    let singleCountry = data.filter((item) => item.country === value);
    let states = [...new Set(singleCountry.map((item) => item.subcountry))];
    setState(states);
    document.querySelector("#state-input").style.display = "block";
  };

  const handleStateSelect = (value) => {
    setSelectedState(value);
    let cities = data
      .filter((item) => item.subcountry === value)
      .map((item) => item.name); // Extract city names from objects
    setCity(cities);
    document.querySelector("#city-input").style.display = "block";
  };

  const countryData = { selectedCountry, selectedState, selectedCity };

  return {
    selectedCountry,
    selectedState,
    selectedCity,
    renderCSC: (
      <>
        {/* Country Selection */}
        <div className="onefield" id="country-input">
          <Autocomplete
            data={country}
            label="Country:"
            value={selectedCountry}
            handleCountrySelect={handleCountrySelect}
          />
        </div>

        {/* State Selection */}
        <div className="onefield" id="state-input">
          <Autocomplete
            data={state}
            label="State:"
            value={selectedState}
            handleStateSelect={handleStateSelect}
          />
        </div>

        {/* City Selection */}
        <div className="onefield" id="city-input">
          <Autocomplete
            data={city}
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
