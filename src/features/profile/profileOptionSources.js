import languages from '../../data/reference/languages.json';
import jobs from '../../data/reference/jobs.json';
import hobbies from '../../data/reference/hobbies.json';
import scholars from '../../data/reference/scholars.json';
import people from '../../data/reference/people.json';
import ethnicities from '../../data/reference/ethnicities.json';
import { titleCase } from '../../lib/utils/format';

const byLabel = (a, b) => a.label.localeCompare(b.label);
const uniqueByValue = (options) => {
  const seen = new Map();
  options.forEach((option) => {
    if (!seen.has(option.value)) seen.set(option.value, option);
  });
  return [...seen.values()];
};

export const languageOptions = uniqueByValue(
  (languages.lang || []).map((item) => ({
    value: item.name,
    label: item.nativeName && item.nativeName !== item.name
      ? `${item.name} (${item.nativeName})`
      : item.name,
  }))
).sort(byLabel);

export const jobOptions = uniqueByValue(
  (jobs.occupations || []).map((item) => ({ value: item, label: titleCase(item) }))
).sort(byLabel);

export const hobbyOptions = uniqueByValue(
  (hobbies.hobbies || []).map((item) => ({ value: item.title, label: item.title }))
).sort(byLabel);

export const scholarOptions = uniqueByValue(
  (scholars.scholars || []).map((item) => ({ value: item.value, label: item.label }))
).sort(byLabel);

export const inspirationOptions = uniqueByValue(
  (people.peoples || []).map((item) => ({ value: item, label: item }))
).sort(byLabel);

export const ethnicityOptions = uniqueByValue(
  (ethnicities.data || []).map((item) => {
    const { synonym, ethnicity } = item.fields || {};
    if (!ethnicity) return null;
    return {
      value: ethnicity,
      label: synonym && synonym !== ethnicity ? `${synonym} (${ethnicity})` : ethnicity,
    };
  }).filter(Boolean)
).sort(byLabel);
