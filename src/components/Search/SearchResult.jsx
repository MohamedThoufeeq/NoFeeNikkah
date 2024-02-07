import { useState } from "react";
import ProfileCard from "./ProfileCard";

function SearchResult(props) {
  // console.log('profile', props.getDataFromBackend.profiles[3]);
  const SampleJsonProfiles = props.getDataFromBackend.profiles;

  const [sortByIncome, setSortByIncome] = useState(null);

  //Function to handle sortByIncome
  const handleSortByIncome = (e) => {
    setSortByIncome(e.target.value);
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

  //Sort the profiles based on INcome
  const sortedProfiles = SampleJsonProfiles.slice().sort(compareIncome);

  return (
    <div id="result">
      <span id="results-header">
        <h4>Search Results</h4>
        <div id="header-bar">
          Filter your results
          <div id="filters">
            <select name="sort" onChange={handleSortByIncome}>
              <option value="">Sort By Income</option>
              <option value="asc">Low To High</option>
              <option value="desc">High To Low</option>
            </select>
          </div>
        </div>
      </span>
      <div id="profile-cards">
        {sortedProfiles.map((profile, index) => (
          <ProfileCard key={index} profile={profile} />
        ))}
        {/* <ProfileCard SampleJsonProfiles={SampleJsonProfiles} />
            <ProfileCard SampleJsonProfiles={SampleJsonProfiles} /> */}
      </div>
    </div>
  );
}
export default SearchResult;
