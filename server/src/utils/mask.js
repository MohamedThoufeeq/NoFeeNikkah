/**
 * Contact numbers must never leave the API unmasked for other members.
 * The owner receives the full value through the authenticated `me` endpoint.
 */
export function maskPhone(value) {
  const text = String(value ?? '');
  if (!text) return '';
  if (text.length <= 4) return '*****';
  if (text.length <= 7) return `${text.slice(0, 3)}*****`;
  return `${text.slice(0, 7)}*****`;
}
