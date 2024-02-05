import ProfileCard from "./ProfileCard";

function SearchResult(props){
    console.log('profile', props.getDataFromBackend.profiles[3]);
    const SampleJsonProfiles = props.getDataFromBackend.profiles[3];
    return (
        <div id="result">
            <ProfileCard SampleJsonProfiles={SampleJsonProfiles} />
            <ProfileCard SampleJsonProfiles={SampleJsonProfiles} />
        </div>
    )
}
export default SearchResult;