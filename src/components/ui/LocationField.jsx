import { useMemo, useState } from 'react';
import { Field } from '../../components/ui/Field';
import { Autocomplete } from '../../components/ui/Autocomplete';
import { useLocationData } from '../../features/profile/locationData';

export function LocationField({
  id,
  label,
  value = {},
  onChange,
  hint,
  error,
  disabled,
  className,
  layout = 'stacked',
}) {
  const [requested, setRequested] = useState(false);
  const { status, data } = useLocationData(requested);
  const loading = status === 'loading';
  const unavailable = status === 'error';
  const requestData = () => setRequested(true);

  const stateOptions = useMemo(
    () => (data && value.country ? data.getStates(value.country) : []),
    [data, value.country]
  );
  const cityOptions = useMemo(
    () => (data && value.country && value.state ? data.getCities(value.country, value.state) : []),
    [data, value.country, value.state]
  );

  const update = (patch) => onChange({ ...value, ...patch });

  if (layout === 'separate') {
    return (
      <>
        <Field id={`${id}-country`} label="Country" error={error}>
          <Autocomplete
            id={`${id}-country`}
            ariaLabel="Country"
            placeholder="Any country"
            options={data?.countries || []}
            value={value.country || ''}
            disabled={disabled}
            onFocus={requestData}
            onChange={(country) => update({ country, state: '', city: '' })}
            onSelect={(country) => update({ country, state: '', city: '' })}
          />
        </Field>
        <Field id={`${id}-state`} label="State">
          <Autocomplete
            id={`${id}-state`}
            ariaLabel="State"
            placeholder={value.country ? 'Any state' : 'Select country first'}
            options={stateOptions}
            value={value.state || ''}
            disabled={disabled || !value.country}
            onFocus={requestData}
            onChange={(state) => update({ state, city: '' })}
            onSelect={(state) => update({ state, city: '' })}
          />
        </Field>
        <Field id={`${id}-city`} label="City">
          <Autocomplete
            id={`${id}-city`}
            ariaLabel="City (optional)"
            placeholder={value.state ? 'Any city' : 'Select state first'}
            options={cityOptions}
            value={value.city || ''}
            disabled={disabled || !value.state}
            onFocus={requestData}
            onChange={(city) => update({ city })}
            onSelect={(city) => update({ city })}
          />
        </Field>
        {loading ? <p className="field__hint search-form__location-status">Loading locations…</p> : null}
        {unavailable ? (
          <p className="field__error search-form__location-status">Locations could not be loaded.</p>
        ) : null}
      </>
    );
  }

  return (
    <Field id={id} label={label} hint={hint} error={error} className={className} labelAs="span">
      <div className={layout === 'inline' ? 'location-fields location-fields--inline' : 'location-fields'}>
        <Autocomplete
          id={`${id}-country`}
          ariaLabel="Country"
          placeholder="Country"
          options={data?.countries || []}
          value={value.country || ''}
          disabled={disabled}
          onFocus={requestData}
          onChange={(country) => update({ country, state: '', city: '' })}
          onSelect={(country) => update({ country, state: '', city: '' })}
        />
        <Autocomplete
          id={`${id}-state`}
          ariaLabel="State"
          placeholder="State"
          options={stateOptions}
          value={value.state || ''}
          disabled={disabled || !value.country}
          onFocus={requestData}
          onChange={(state) => update({ state, city: '' })}
          onSelect={(state) => update({ state, city: '' })}
        />
        <Autocomplete
          id={`${id}-city`}
          ariaLabel="City (optional)"
          placeholder="City (optional)"
          options={cityOptions}
          value={value.city || ''}
          disabled={disabled || !value.state}
          onFocus={requestData}
          onChange={(city) => update({ city })}
          onSelect={(city) => update({ city })}
        />
      </div>
      {loading ? <p className="field__hint">Loading locations…</p> : null}
      {unavailable ? <p className="field__error">Locations could not be loaded.</p> : null}
    </Field>
  );
}

export default LocationField;
