import { useState } from 'react';
import { FaRedo, FaSearch } from 'react-icons/fa';
import { Button } from '../components/ui/Button';
import { SelectField, TextField } from '../components/ui/FormControls';
import { LocationField } from '../components/ui/LocationField';
import {
  EATING_HABITS_OPTIONS,
  EDUCATION_OPTIONS,
  FINANCIAL_STATUS_OPTIONS,
  MARITAL_STATUS_OPTIONS,
  PRACTICING_LEVEL_OPTIONS,
  SECT_OPTIONS,
  SMOKING_DRINKING_OPTIONS,
} from '../features/profile/profileOptions';
import { SearchResults } from '../features/search/SearchResults';
import { searchProfiles } from '../lib/api/profiles';
import { useAsyncData } from '../lib/hooks/useAsyncData';

const DEFAULT_FILTERS = {
  gender: 'both',
  country: '',
  state: '',
  city: '',
  minAge: '',
  age: '',
  maritalStatus: '',
  sect: '',
  education: '',
  language: '',
  eatingHabits: '',
  practicingLevel: '',
  smokeAndDrink: '',
  occupation: '',
  income: '',
  financialStatus: '',
};

const ANY = 'Any';

export function SearchPage() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [submitted, setSubmitted] = useState({ gender: 'both' });

  const { data, status, error, reload } = useAsyncData(
    () => searchProfiles(submitted),
    [submitted]
  );

  const patch = (partial) => setFilters((current) => ({ ...current, ...partial }));

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted({
      ...filters,
      language: filters.language.trim(),
      occupation: filters.occupation.trim(),
    });
  };

  const handleReset = () => {
    setFilters({ ...DEFAULT_FILTERS });
    setSubmitted({ gender: 'both' });
  };

  return (
    <div className="search-page">
      <section className="search-panel" aria-labelledby="search-title">
        <div className="search-panel__header">
          <h1 className="search-panel__title" id="search-title">
            Search Profiles
          </h1>
        </div>

        <form className="search-form" onSubmit={handleSubmit}>
          <SelectField
            id="search-gender"
            label="Searching for"
            value={filters.gender}
            onChange={(gender) => patch({ gender })}
            options={[
              { value: 'both', label: 'Bride & Groom' },
              { value: 'female', label: 'Bride' },
              { value: 'male', label: 'Groom' },
            ]}
          />

          <TextField
            id="search-min-age"
            label="Minimum age"
            type="number"
            min={18}
            max={100}
            step={1}
            inputMode="numeric"
            value={filters.minAge}
            onChange={(minAge) => patch({ minAge })}
            placeholder="18"
          />

          <TextField
            id="search-age"
            label="Maximum age"
            type="number"
            min={18}
            max={100}
            step={1}
            inputMode="numeric"
            value={filters.age}
            onChange={(age) => patch({ age })}
            placeholder="60"
          />

          <SelectField
            id="search-marital-status"
            label="Marital status"
            value={filters.maritalStatus}
            onChange={(maritalStatus) => patch({ maritalStatus })}
            options={MARITAL_STATUS_OPTIONS}
            placeholder={ANY}
          />

          <LocationField
            id="search-location"
            label="Location"
            layout="separate"
            value={{ country: filters.country, state: filters.state, city: filters.city }}
            onChange={(next) => patch(next)}
          />

          <SelectField
            id="search-sect"
            label="Sect"
            value={filters.sect}
            onChange={(sect) => patch({ sect })}
            options={SECT_OPTIONS}
            placeholder={ANY}
          />

          <SelectField
            id="search-education"
            label="Education"
            value={filters.education}
            onChange={(education) => patch({ education })}
            options={EDUCATION_OPTIONS}
            placeholder={ANY}
          />

          <TextField
            id="search-language"
            label="Language"
            value={filters.language}
            onChange={(language) => patch({ language })}
            placeholder="e.g. Urdu"
          />

          <SelectField
            id="search-eating-habits"
            label="Eating habits"
            value={filters.eatingHabits}
            onChange={(eatingHabits) => patch({ eatingHabits })}
            options={EATING_HABITS_OPTIONS}
            placeholder={ANY}
          />

          <SelectField
            id="search-practicing-level"
            label="Practicing level"
            value={filters.practicingLevel}
            onChange={(practicingLevel) => patch({ practicingLevel })}
            options={PRACTICING_LEVEL_OPTIONS}
            placeholder={ANY}
          />

          <SelectField
            id="search-smoke-drink"
            label="Smoking / drinking"
            value={filters.smokeAndDrink}
            onChange={(smokeAndDrink) => patch({ smokeAndDrink })}
            options={SMOKING_DRINKING_OPTIONS}
            placeholder={ANY}
          />

          <TextField
            id="search-occupation"
            label="Occupation"
            value={filters.occupation}
            onChange={(occupation) => patch({ occupation })}
            placeholder="e.g. Doctor"
          />

          <TextField
            id="search-income"
            label="Max income (per month)"
            type="number"
            min={0}
            step={1000}
            inputMode="numeric"
            value={filters.income}
            onChange={(income) => patch({ income })}
            placeholder="₹ 50,000"
          />

          <SelectField
            id="search-financial-status"
            label="Financial status"
            value={filters.financialStatus}
            onChange={(financialStatus) => patch({ financialStatus })}
            options={FINANCIAL_STATUS_OPTIONS}
            placeholder={ANY}
          />

          <div className="search-form__actions">
            <Button type="submit" variant="dark" size="lg">
              <FaSearch aria-hidden="true" /> Search
            </Button>
            <Button type="button" variant="outline" size="lg" onClick={handleReset}>
              <FaRedo aria-hidden="true" /> Reset
            </Button>
          </div>
        </form>
      </section>

      <SearchResults profiles={data || []} status={status} error={error} onRetry={reload} />
    </div>
  );
}

export default SearchPage;
