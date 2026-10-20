import PhoneInput from 'react-phone-number-input';
import { Field } from '../../components/ui/Field';
import {
  RadioGroup,
  SegmentedControl,
  SelectField,
  TextareaField,
  TextField,
} from '../../components/ui/FormControls';
import { MultiSelectField } from '../../components/ui/MultiSelectField';
import { LocationField } from '../../components/ui/LocationField';
import { cn } from '../../lib/utils/cn';
import { descriptionSection, editProfileSections } from './editProfileSchema';

const fieldId = (name) => `profile-${name}`;
const labelOf = (field, values) =>
  typeof field.label === 'function' ? field.label(values) : field.label;

function StaticField({ field, values }) {
  const id = fieldId(field.name);
  return (
    <Field
      id={id}
      label={labelOf(field, values)}
      className={field.wide ? 'field--wide' : undefined}
      labelAs="span"
    >
      <p className="field__static" id={id}>
        {field.compute(values)}
      </p>
    </Field>
  );
}

function MeasureField({ field, values, setValue }) {
  const id = fieldId(field.name);
  return (
    <Field
      id={id}
      label={labelOf(field, values)}
      className={field.wide ? 'field--wide' : undefined}
      labelAs="span"
    >
      <div className="measure">
        {field.items.map((item) => (
          <div className="measure__item" key={item.name}>
            <input
              id={`${id}-${item.name}`}
              className="control"
              type={item.type || 'text'}
              inputMode={item.type === 'number' ? 'numeric' : undefined}
              min={item.min}
              value={values[item.name] ?? ''}
              placeholder={item.placeholder}
              aria-label={item.placeholder || item.name}
              onChange={(event) => setValue(item.name, event.target.value)}
            />
            <span className="measure__suffix">{item.suffix}</span>
          </div>
        ))}
      </div>
    </Field>
  );
}

function PhoneField({ field, values, setValue, errors }) {
  const id = fieldId(field.name);
  return (
    <Field
      id={id}
      label={labelOf(field, values)}
      hint={field.hint}
      error={errors[field.name]}
      className={field.wide ? 'field--wide' : undefined}
    >
      <PhoneInput
        className="phone-field"
        international
        defaultCountry="IN"
        value={values[field.name] || undefined}
        onChange={(next) => setValue(field.name, next || '')}
        numberInputProps={{ id, 'aria-label': labelOf(field, values) }}
      />
    </Field>
  );
}

function renderField(field, { values, errors, setValue }) {
  if (field.show && !field.show(values)) return null;

  const id = fieldId(field.name);
  const label = labelOf(field, values);
  const common = {
    id,
    label,
    hint: field.hint,
    error: errors[field.name],
    required: field.required,
    className: field.wide ? 'field--wide' : undefined,
  };

  switch (field.type) {
    case 'static':
      return <StaticField field={field} values={values} key={field.name} />;
    case 'location': {
      const value = {
        country: values[field.names[0]] || '',
        state: values[field.names[1]] || '',
        city: values[field.names[2]] || '',
      };
      return (
        <LocationField
          key={field.name}
          id={id}
          label={label}
          hint={field.hint}
          error={errors[field.names[0]]}
          value={value}
          className={field.wide ? 'field--wide' : undefined}
          onChange={(next) => {
            setValue(field.names[0], next.country || '');
            setValue(field.names[1], next.state || '');
            setValue(field.names[2], next.city || '');
          }}
        />
      );
    }
    case 'measure':
      return (
        <MeasureField field={field} values={values} setValue={setValue} key={field.name} />
      );
    case 'phone':
      return (
        <PhoneField
          field={field}
          values={values}
          setValue={setValue}
          errors={errors}
          key={field.name}
        />
      );
    case 'select':
      return (
        <SelectField
          {...common}
          key={field.name}
          value={values[field.name] || ''}
          onChange={(next) => setValue(field.name, next)}
          options={field.options}
          placeholder={field.placeholder}
        />
      );
    case 'multiselect':
      return (
        <MultiSelectField
          {...common}
          key={field.name}
          value={values[field.name]}
          onChange={(next) => setValue(field.name, next)}
          options={field.options}
          creatable={field.creatable}
          placeholder={field.placeholder}
        />
      );
    case 'segmented':
      return (
        <SegmentedControl
          key={field.name}
          id={id}
          label={label}
          value={values[field.name] || ''}
          onChange={(next) => setValue(field.name, next)}
          options={field.options}
          hint={field.hint}
          className={cn(field.wide && 'field--wide')}
        />
      );
    case 'radio':
      return (
        <RadioGroup
          key={field.name}
          id={id}
          label={label}
          value={values[field.name] || ''}
          onChange={(next) => setValue(field.name, next)}
          options={field.options}
          hint={field.hint}
          className={cn(field.wide && 'field--wide')}
        />
      );
    case 'textarea':
      return (
        <TextareaField
          {...common}
          key={field.name}
          value={values[field.name]}
          onChange={(next) => setValue(field.name, next)}
          placeholder={field.placeholder}
        />
      );
    default:
      return (
        <TextField
          {...common}
          key={field.name}
          type={field.type || 'text'}
          value={values[field.name]}
          onChange={(next) => setValue(field.name, next)}
          placeholder={field.placeholder}
          suffix={field.suffix}
          min={field.min}
          max={field.max}
          inputMode={field.type === 'number' ? 'numeric' : undefined}
        />
      );
  }
}

export function ProfileForm({ values, errors, setValue }) {
  return (
    <div className="edit-form">
      <div className="edit-form__sections">
        {editProfileSections.map((section) => (
          <section className="form-section" key={section.id} aria-labelledby={`${section.id}-title`}>
            <h2 className="section-title form-section__title" id={`${section.id}-title`}>
              {section.title}
            </h2>
            <div className="form-section__fields">
              {section.fields.map((field) =>
                renderField(field, { values, errors, setValue })
              )}
            </div>
          </section>
        ))}
      </div>

      <div className="profile-descriptions">
        {descriptionSection.fields.map((field) => (
          <div className="description-card" key={field.name}>
            <TextareaField
              id={fieldId(field.name)}
              label={field.label}
              value={values[field.name]}
              onChange={(next) => setValue(field.name, next)}
              placeholder={field.placeholder}
              rows={7}
              className="w-full"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProfileForm;
