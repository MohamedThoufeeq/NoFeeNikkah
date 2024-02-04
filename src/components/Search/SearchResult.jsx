import ProfileCard from "./ProfileCard";

function SearchResult(props){
    const SampleJsonProfiles = props.getDataFromBackend;
    console.log('profile', SampleJsonProfiles.profiles[0]);
    return (
        <div id="result">
            <ProfileCard SampleJsonProfiles={SampleJsonProfiles} />
            <ProfileCard SampleJsonProfiles={SampleJsonProfiles} />
        </div>
    )
}
export default SearchResult;