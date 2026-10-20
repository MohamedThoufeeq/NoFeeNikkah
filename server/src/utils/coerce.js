export function firstDefined(...values) {
  return values.find((value) => value !== null && value !== undefined);
}

export function toText(value, fallback = '') {
  if (value === null || value === undefined) return fallback;
  return String(value);
}

export function toOptionalText(value) {
  const text = toText(value).trim();
  return text === '' ? null : text;
}

export function toYesNo(value, fallback = '') {
  if (value === true) return 'yes';
  if (value === false) return 'no';
  const text = toText(value, fallback).trim().toLowerCase();
  if (['yes', 'true', '1'].includes(text)) return 'yes';
  if (['no', 'false', '0'].includes(text)) return 'no';
  return fallback;
}

export function toList(value) {
  if (value === null || value === undefined) return [];
  const list = Array.isArray(value) ? value : String(value).split(',');
  return list
    .flatMap((item) => (typeof item === 'string' ? item.split(',') : [item]))
    .map((item) => (item === null || item === undefined ? '' : String(item).trim()))
    .filter(Boolean);
}

export function toOptionalNumber(value) {
  if (value === null || value === undefined || value === '') return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

export function toOptionalInteger(value) {
  const number = toOptionalNumber(value);
  return number === null ? null : Math.trunc(number);
}

export function toOptionalBoolean(value, fallback = null) {
  if (value === null || value === undefined || value === '') return fallback;
  if (typeof value === 'boolean') return value;
  const text = String(value).trim().toLowerCase();
  if (['true', '1', 'yes', 'on'].includes(text)) return true;
  if (['false', '0', 'no', 'off'].includes(text)) return false;
  return fallback;
}

export function normalizeUsername(value) {
  const normalized = String(value ?? '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9_]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 30);

  return normalized || 'member';
}
