/**
 * Pure date helpers. Keeping age calculation outside React means it can be
 * reused, unit tested and called during render without side effects.
 */
function parseDateOnly(value) {
  if (!value) return null;
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value;

  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(value));
  if (match) {
    const [, year, month, day] = match;
    return new Date(Number(year), Number(month) - 1, Number(day));
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function calculateAge(dateOfBirth, now = new Date()) {
  const birthDate = parseDateOnly(dateOfBirth);
  if (!birthDate) return null;

  let years = now.getFullYear() - birthDate.getFullYear();
  let months = now.getMonth() - birthDate.getMonth();
  let days = now.getDate() - birthDate.getDate();

  if (days < 0) {
    months -= 1;
    const previousMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    days += previousMonth.getDate();
  }

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  if (years < 0) return null;

  return { years, months, days };
}

export function getAgeInYears(dateOfBirth, now = new Date()) {
  const age = calculateAge(dateOfBirth, now);
  return age ? age.years : null;
}

export function formatAge(dateOfBirth, now = new Date()) {
  const age = calculateAge(dateOfBirth, now);
  if (!age) return '';
  return `${age.years} years, ${age.months} months, ${age.days} days`;
}

export function formatAgeShort(dateOfBirth, now = new Date()) {
  const age = calculateAge(dateOfBirth, now);
  return age ? `${age.years}` : '';
}

export function formatDate(value) {
  const date = parseDateOnly(value);
  if (!date) return '';
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

export default calculateAge;
