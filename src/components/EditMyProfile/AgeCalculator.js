import React, { useState, useEffect } from "react";

const AgeCalculator = (dob) => {
  // create state variables for date input and age output
  const [dateInput, setDateInput] = useState(null);
  const [ageOutput, setAgeOutput] = useState(null);

  // create a function to calculate the age from the date input
  const calculateAge = (date) => {
    // create a date object from the date string
    let birthDate = new Date(date);
    // get the current date
    let today = new Date();
    // get the difference in years
    let years = today.getFullYear() - birthDate.getFullYear();
    // get the difference in months
    let months = today.getMonth() - birthDate.getMonth();
    // get the difference in days
    let days = today.getDate() - birthDate.getDate();
    // adjust the values if they are negative or zero
    if (months <= 0) {
      years--;
      months = 12 + months;
    }
    if (days <= 0) {
      months--;
      days = 30 + days;
    }
    // return an object with the age values
    return { years, months, days };
  };

  // create a function to format the age in the desired format
  const formatAge = (age) => {
    // use string concatenation or template literals to create the output string
    return `${age.years} years, ${age.months} months, ${age.days} days`;
  };

  // use a useEffect hook to update the state based on the dob prop
  useEffect(() => {
    // check if dob is not empty
    if (dob) {
      // update the date input value
      setDateInput(dob);
      // calculate the age from the date input
      let age = calculateAge(dob);
      // format the age in the desired format
      let output = formatAge(age);
      // update the age output value
      setAgeOutput(output);
    } else {
      // if dob is empty, set ageOutput to null or any default value
      setAgeOutput("N/A"); // or set a default value like "N/A"
    }
  }, [dob]); // pass the dob prop as a dependency
  

  return ageOutput;
};
export default AgeCalculator;
