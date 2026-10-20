import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { cn } from '../../lib/utils/cn';

const MAX_SUGGESTIONS = 100;

/**
 * Accessible, dependency-free combobox.
 *
 * The component is fully controlled: the selected value lives in the parent
 * form state, so it never manipulates the DOM or holds hidden values.
 */
export function Autocomplete({
  id,
  label,
  ariaLabel,
  value = '',
  onChange,
  onSelect,
  onFocus,
  options = [],
  placeholder = 'Type to search…',
  disabled = false,
  emptyLabel = 'No matches found',
}) {
  const generatedId = useId();
  const inputId = id || `autocomplete-${generatedId}`;
  const listId = `${inputId}-listbox`;
  const [inputValue, setInputValue] = useState(value);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const blurTimer = useRef(null);

  useEffect(() => {
    setInputValue(value ?? '');
  }, [value]);

  useEffect(() => () => window.clearTimeout(blurTimer.current), []);

  const filtered = useMemo(() => {
    const query = String(inputValue ?? '').trim().toLowerCase();
    const source = query ? options.filter((option) => option.toLowerCase().includes(query)) : options;
    return source.slice(0, MAX_SUGGESTIONS);
  }, [inputValue, options]);

  const closeList = () => {
    setOpen(false);
    setActiveIndex(-1);
  };

  const selectOption = (option) => {
    setInputValue(option);
    onChange?.(option);
    onSelect?.(option);
    closeList();
  };

  const handleChange = (event) => {
    const next = event.target.value;
    setInputValue(next);
    onChange?.(next);
    setOpen(true);
    setActiveIndex(-1);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setOpen(true);
      setActiveIndex((index) => Math.min(index + 1, filtered.length - 1));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((index) => Math.max(index - 1, 0));
    } else if (event.key === 'Enter') {
      if (open && activeIndex >= 0 && filtered[activeIndex]) {
        event.preventDefault();
        selectOption(filtered[activeIndex]);
      }
    } else if (event.key === 'Escape') {
      closeList();
    }
  };

  return (
    <div className="autocomplete">
      {label ? (
        <label className="field__label" htmlFor={inputId}>
          {label}
        </label>
      ) : null}
      <input
        id={inputId}
        className="control autocomplete__control"
        type="text"
        role="combobox"
        aria-expanded={open}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-label={ariaLabel}
        aria-activedescendant={activeIndex >= 0 ? `${inputId}-option-${activeIndex}` : undefined}
        autoComplete="off"
        disabled={disabled}
        placeholder={placeholder}
        value={inputValue}
        onChange={handleChange}
        onFocus={() => {
          setOpen(true);
          onFocus?.();
        }}
        onBlur={() => {
          blurTimer.current = window.setTimeout(closeList, 120);
        }}
        onKeyDown={handleKeyDown}
      />
      {open ? (
        <ul className="autocomplete__list" id={listId} role="listbox">
          {filtered.length ? (
            filtered.map((option, index) => (
              <li
                key={option}
                id={`${inputId}-option-${index}`}
                role="option"
                aria-selected={index === activeIndex}
                className={cn('autocomplete__option', index === activeIndex && 'autocomplete__option--active')}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => selectOption(option)}
              >
                {option}
              </li>
            ))
          ) : (
            <li className="autocomplete__empty">{emptyLabel}</li>
          )}
        </ul>
      ) : null}
    </div>
  );
}

export default Autocomplete;
