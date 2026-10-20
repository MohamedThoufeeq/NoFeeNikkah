import { useMemo, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { Alert, EmptyState, LoadingState } from '../../components/ui/States';
import { Button } from '../../components/ui/Button';
import { ProfileCard } from '../../components/profile/ProfileCard';
import { getProfileAge } from '../../lib/utils/profile';

const SORT_OPTIONS = [
  { value: '', label: 'Default order' },
  { value: 'income-asc', label: 'Monthly income: low to high' },
  { value: 'income-desc', label: 'Monthly income: high to low' },
  { value: 'age-asc', label: 'Age: young to old' },
  { value: 'age-desc', label: 'Age: old to young' },
];

function sortProfiles(profiles, sort) {
  if (!sort) return profiles;
  const [key, direction] = sort.split('-');
  const multiplier = direction === 'asc' ? 1 : -1;

  return [...profiles].sort((a, b) => {
    const valueA = key === 'income' ? Number(a.income) || 0 : getProfileAge(a) ?? 0;
    const valueB = key === 'income' ? Number(b.income) || 0 : getProfileAge(b) ?? 0;
    return (valueA - valueB) * multiplier;
  });
}

export function SearchResults({ profiles = [], status = 'idle', error, onRetry }) {
  const [sort, setSort] = useState('');
  const sortedProfiles = useMemo(() => sortProfiles(profiles, sort), [profiles, sort]);

  return (
    <section className="search-results" aria-labelledby="results-title">
      <div className="search-results__header">
        <h2 className="search-results__title" id="results-title">
          Search Results
        </h2>
        <div className="results-toolbar">
          <label className="results-toolbar__label" htmlFor="results-sort">
            Sort results
          </label>
          <select
            id="results-sort"
            className="results-toolbar__select"
            value={sort}
            onChange={(event) => setSort(event.target.value)}
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        {status === 'success' ? (
          <p className="search-summary">
            {sortedProfiles.length} {sortedProfiles.length === 1 ? 'profile' : 'profiles'} found
          </p>
        ) : null}
      </div>

      {status === 'loading' ? <LoadingState label="Finding profiles…" /> : null}

      {status === 'error' ? (
        <div className="stack">
          <Alert variant="error" title="Could not load results">
            {error?.message || 'Something went wrong. Please try again.'}
          </Alert>
          {onRetry ? (
            <div className="text-center">
              <Button variant="primary" onClick={onRetry}>
                Try again
              </Button>
            </div>
          ) : null}
        </div>
      ) : null}

      {status === 'success' && sortedProfiles.length === 0 ? (
        <EmptyState
          icon={<FaSearch />}
          title="No profiles match these filters"
          body="Try widening the age or income range, or removing the location filter."
        />
      ) : null}

      {sortedProfiles.length ? (
        <div className="profile-cards">
          {sortedProfiles.map((profile) => (
            <ProfileCard profile={profile} key={profile.id || profile.username} />
          ))}
        </div>
      ) : null}
    </section>
  );
}

export default SearchResults;
