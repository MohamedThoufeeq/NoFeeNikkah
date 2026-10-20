import { FaFileUpload } from 'react-icons/fa';

export function AvatarUpload({
  id = 'profile-image',
  image,
  fallback,
  onFile,
  label = 'Upload profile photo',
}) {
  return (
    <label className="avatar-upload" htmlFor={id} title={label}>
      <img className="avatar-upload__image" src={image || fallback} alt="Profile preview" />
      <FaFileUpload className="avatar-upload__icon" aria-hidden="true" />
      <span className="sr-only">{label}</span>
      <input
        className="avatar-upload__input"
        id={id}
        type="file"
        accept="image/*"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) onFile(file);
          event.target.value = '';
        }}
      />
    </label>
  );
}

export default AvatarUpload;
