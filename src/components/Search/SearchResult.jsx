import { useState } from "react";
import ProfileCard from "./ProfileCard";

function SearchResult(props) {
  // console.log('profile', props.getDataFromBackend.profiles[3]);
  const SampleJsonProfiles = props.getDataFromBackend.profiles;

  const [sortByIncome, setSortByIncome] = useState(null);
  const [sortByAge, setSortByAge] = useState(null);

  //Function to handle sortByIncome
  const handleSortByIncome = (e) => {
    setSortByIncome(e.target.value);
  };
  //Function to handle sortByAge
  const handleSortByAge = (e) => {
    setSortByAge(e.target.value);
  };
  //Function to compare the incomes for sorting
  const compareIncome = (a, b) => {
    const incomeA = parseInt(a.income);
    const incomeB = parseInt(b.income);
    if (sortByIncome === "asc") {
      return incomeA - incomeB;
    } else {
      return incomeB - incomeA;
    }
  };
  //Function to compare the age for sorting
  const compareAge = (a, b) => {
    const ageA = parseInt(a.age.substring(0,2));
    const ageB = parseInt(b.age.substring(0,2));
    if (sortByAge === "asc") {
      return ageA - ageB;
    } else {
      return ageB - ageA;
    }
  };

  //Sort the profiles based on sorting criteria
  let sortedProfiles = SampleJsonProfiles.slice();
  if(sortByIncome){
    sortedProfiles = sortedProfiles.sort(compareIncome);
  }
  if(sortByAge){
    sortedProfiles = sortedProfiles.sort(compareAge);
  }

  return (
    <div id="result">
      <span id="results-header">
        <h4>Search Results</h4>
        <div id="header-bar">
          Filter your results
          <div id="filters">
            <select name="sort" onChange={handleSortByIncome}>
              <option value="">Sort By Income</option>
              <option value="desc">High To Low</option>
              <option value="asc">Low To High</option>
            </select>
          </div>
          <div id="filters">
            <select name="sort" onChange={handleSortByAge}>
              <option value="">Sort By Age</option>
              <option value="desc">High To Low</option>
              <option value="asc">Low To High</option>
            </select>
          </div>
        </div>
      </span>
      <div id="profile-cards">
        {sortedProfiles.map((profile, index) => (
          <ProfileCard key={index} profile={profile} />
        ))}
      </div>
    </div>
  );
}
export default SearchResult;
