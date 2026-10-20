import { calculateAge, getAgeInYears } from '../../lib/utils/date';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateProfileForm(values = {}) {
  const errors = {};

  if (!values.fullName?.trim()) errors.fullName = 'Please enter your full name.';
  if (!values.registeredFor) errors.registeredFor = 'Please choose who you are registering for.';
  if (!values.gender) errors.gender = 'Please select a gender.';
  if (!values.dateOfBirth) {
    errors.dateOfBirth = 'Please enter your date of birth.';
  } else {
    const age = calculateAge(values.dateOfBirth);
    if (!age) {
      errors.dateOfBirth = 'Please enter a valid date of birth.';
    } else if (getAgeInYears(values.dateOfBirth) < 18) {
      errors.dateOfBirth = 'You must be at least 18 years old to register.';
    }
  }

  if (!values.salahPattern) errors.salahPattern = 'Please select your Salah pattern.';
  if (!values.practicingLevel) errors.practicingLevel = 'Please select your practicing level.';
  if (!values.parentName?.trim()) errors.parentName = "Please enter your parent's name.";

  if (values.email && !EMAIL_PATTERN.test(values.email)) {
    errors.email = 'Please enter a valid email address.';
  }

  if (
    values.partnerFromAge &&
    values.partnerToAge &&
    Number(values.partnerFromAge) > Number(values.partnerToAge)
  ) {
    errors.partnerToAge = 'The maximum age must be greater than or equal to the minimum age.';
  }

  ['height', 'weight', 'income', 'workExperience', 'childrenCount', 'noOfBrothers', 'noOfSisters'].forEach(
    (field) => {
      if (values[field] !== '' && values[field] !== undefined && Number(values[field]) < 0) {
        errors[field] = 'This value cannot be negative.';
      }
    }
  );

  return errors;
}

export default validateProfileForm;
