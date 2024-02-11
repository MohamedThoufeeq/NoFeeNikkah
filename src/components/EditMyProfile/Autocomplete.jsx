import React, { useState } from "react";
import "./AutoComplete.css"

function Autocomplete({ data, label }) {
  // create state variables for input and suggestions
  const [input, setInput] = useState("");
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
    console.log(item);
    // get the suggestion value
    // const value = e.target.innerText;
    // update the input state with the suggestion value
    setInput(value);
    // clear the suggestions state
    setSuggestions([]);
  };

  return (
    <div className="autocomplete">
      <label>{label}</label>
      <br />
      <input className="border border-dark"
        type="text"
        value={input}
        onChange={(e)=>handleChange(e)}
        onFocus={(e)=>handleChange(e)}
        onBlur={(e) => setSuggestions([])}
      />
      {suggestions.length > 0 && (
        <ul className="suggestions">
          {suggestions.map((item, index) => (
            <option className="list" value={item} key={index} 
            onClick={()=>handleClick(item)} 
            onClickCapture={()=>handleClick(item)} 
            onFocus={()=>handleClick(item)}>
              {item}
            </option>
          ))}
        </ul>
      )}
      {/* add some styles to the suggestions list and item elements */}
    </div>
  );
}

export default Autocomplete;
