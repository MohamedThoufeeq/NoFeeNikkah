import React, { useState } from "react";
import "./AutoComplete.css"

function Autocomplete({ data, label , handleCountrySelect, handleStateSelect, countryData}) {
  // create state variables for input and suggestions
  const [input, setInput] = useState(countryData);
  const [suggestions, setSuggestions] = useState([]);

  // create a function to filter the suggestions
  const filterSuggestions = (value) => {
    // get the suggestions that match the input value
    const filtered = data.filter((item) =>
      item.toLowerCase().includes(value.toLowerCase())
    );
    // update the suggestions state
    setSuggestions(filtered);
  };

  // create a function to handle the input change
  const handleChange = (e) => {
    // get the input value
    const value = e.target.value;
    // update the input state
    setInput(value);
    // filter the suggestions
    filterSuggestions(value);
  };

  // create a function to handle the suggestion click
  const handleClick = (value) => {
    if(handleCountrySelect){
        handleCountrySelect(value);
    } else if(handleStateSelect) {
        handleStateSelect(value);
    }
    setInput(value);
    // clear the suggestions state
    setSuggestions([]);
  };

  return (
    <div className="autocomplete">
      <label>{label}</label>
      <br />
      <input className="border border-dark"
        placeholder={'Enter '+label}
        title = {'Enter '+label}
        type="text"
        value={input}
        onClickCapture={(e)=>handleChange(e)}
        onClick={(e)=>handleChange(e)}
        onChange={(e)=>handleChange(e)}
        onFocus={(e)=>handleChange(e)}
        style={{minWidth:'240px'}}
      />
      {suggestions.length > 0 && (
        <ul className="suggestions">
          {suggestions.map((item, index) => (
            <div className="list" key={index} onClick={()=>handleClick(item)}>
              {item}
            </div>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Autocomplete;
