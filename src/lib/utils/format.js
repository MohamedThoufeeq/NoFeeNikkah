import { asArray } from './array';

export function titleCase(value) {
  if (value === null || value === undefined) return '';
  return String(value)
    .toLowerCase()
    .replace(/\b([a-z])/g, (match) => match.toUpperCase());
}

export function capitalize(value) {
  const text = String(value ?? '');
  return text ? text.charAt(0).toUpperCase() + text.slice(1) : '';
}

export function joinList(value, fallback = '—') {
  const items = asArray(value).filter(Boolean);
  return items.length ? items.join(', ') : fallback;
}

export function truncate(value, maxLength = 120) {
  const text = String(value ?? '');
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trimEnd()}…`;
}

export function maskPhone(value) {
  const text = String(value ?? '');
  if (!text) return '';
  if (text.length <= 4) return '*****';
  if (text.length <= 7) return `${text.slice(0, 3)}*****`;
  return `${text.slice(0, 7)}*****`;
}

export function formatCurrencyINR(value) {
  const amount = Number(value);
  if (!Number.isFinite(amount) || amount <= 0) return '';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function initials(name) {
  return String(name ?? '')
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');
}

export function socialLabel(url) {
  const value = String(url ?? '').toLowerCase();
  if (!value) return 'Social Media';
  if (value.includes('instagram')) return 'Instagram';
  if (value.includes('facebook')) return 'Facebook';
  if (value.includes('twitter') || value.includes('x.com')) return 'Twitter';
  if (value.includes('linkedin')) return 'LinkedIn';
  if (value.includes('youtube')) return 'YouTube';
  return 'Social Media';
}
