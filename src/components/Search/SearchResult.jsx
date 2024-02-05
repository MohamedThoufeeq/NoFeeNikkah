import ProfileCard from "./ProfileCard";

function SearchResult(props){
    // console.log('profile', props.getDataFromBackend.profiles[3]);
    const SampleJsonProfiles = props.getDataFromBackend.profiles;
    return (
        <div id="result">
            {SampleJsonProfiles.map((profile, index) => (
                <ProfileCard key={index} profile={profile} />
            ))}
            {/* <ProfileCard SampleJsonProfiles={SampleJsonProfiles} />
            <ProfileCard SampleJsonProfiles={SampleJsonProfiles} /> */}
        </div>
    )
}
export default SearchResult;