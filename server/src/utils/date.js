export function parseDateOnly(value) {
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

export function getAgeInYears(dateOfBirth, now = new Date()) {
  const birthDate = parseDateOnly(dateOfBirth);
  if (!birthDate) return null;

  let age = now.getFullYear() - birthDate.getFullYear();
  const monthDelta = now.getMonth() - birthDate.getMonth();
  if (monthDelta < 0 || (monthDelta === 0 && now.getDate() < birthDate.getDate())) {
    age -= 1;
  }

  return age >= 0 ? age : null;
}

function formatDateOnly(date) {
  return date.toISOString().slice(0, 10);
}

/**
 * Highest date of birth that can still satisfy `age <= maxAge`.
 * Adding one day accounts for birthdays that have not happened yet this year.
 */
export function latestBirthDateForAge(maxAge, now = new Date()) {
  const date = new Date(
    Date.UTC(now.getUTCFullYear() - Number(maxAge) - 1, now.getUTCMonth(), now.getUTCDate())
  );
  date.setUTCDate(date.getUTCDate() + 1);
  return formatDateOnly(date);
}
