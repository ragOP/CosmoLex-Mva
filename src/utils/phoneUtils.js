import { parsePhoneNumberFromString } from 'libphonenumber-js';

const CA_ALIASES = new Set(['canada', 'ca', '+1', '2']);
const US_ALIASES = new Set(['usa', 'us', 'united states', '1']);

// Normalize country-like values to canonical identifiers
export const normalizeCountry = (val) => {
  if (!val) return undefined;
  const v = String(val).trim().toLowerCase();

  if (CA_ALIASES.has(v)) return 'CA';
  if (US_ALIASES.has(v)) return 'US';
  if (/^[a-z]{2}$/.test(v)) return v.toUpperCase();
  return undefined;
};

// Quick hint from row-level fields (no API call)
const firstNormalized = (...values) => {
  for (const value of values) {
    const normalized = normalizeCountry(value);
    if (normalized) return normalized;
  }
  return undefined;
};

export const getRowCountryHint = (row) => {
  if (!row) return undefined;
  return firstNormalized(
    row.country,
    row.primary_country,
    row.country_code,
    row.countryCode,
    row.dial_code,
    row.dialCode
  );
};

// Extract country from an addresses array
export const getCountryFromAddresses = (addresses) => {
  if (!Array.isArray(addresses) || addresses.length === 0) return undefined;
  const primary = addresses.find((a) => a?.is_primary) || addresses[0];
  if (!primary) return undefined;
  return firstNormalized(primary.country, primary.alpha2, primary.country_code);
};

// Country for a row using row hint or cached/embedded addresses
export const getCountryForRow = (row, addressesById) =>
  getRowCountryHint(row) ||
  getCountryFromAddresses(
    Array.isArray(row?.addresses) ? row.addresses : addressesById?.[row?.id]
  );

// Determine if the row is Canadian
export const isCanadaRow = (row, addressesById) =>
  getCountryForRow(row, addressesById) === 'CA';

// Format Canadian numbers; withCountry adds "+1 " prefix for phone; fax should pass false
export const formatCanadian = (raw, withCountry) => {
  if (!raw) return '';
  try {
    const parsed = parsePhoneNumberFromString(String(raw), 'CA');
    if (parsed && parsed.isValid()) {
      const national = parsed.formatNational();
      return withCountry ? `+1 ${national}` : national;
    }
  } catch (_) {}
  const digits = String(raw).replace(/\D+/g, '');
  if (digits.length >= 10) {
    const a = digits.slice(-10);
    const area = a.slice(0, 3);
    const prefix = a.slice(3, 6);
    const line = a.slice(6, 10);
    const national = `(${area}) ${prefix}-${line}`;
    return withCountry ? `+1 ${national}` : national;
  }
  return String(raw);
};

// Simple getters to select phone/fax fields
export const getRowPhone = (row, fallback) =>
  row?.primary_phone ||
  row?.work_phone ||
  row?.home_phone ||
  row?.phone ||
  fallback;
export const getRowFax = (row, fallback) => row?.fax || fallback;
