import { DEFAULT_POSTAL_LABEL, POSTAL_LABELS } from "../assets/postalLabels";
import { AnyCountryCode } from "../types/AnyCountryCode";

import { getCountryByCode } from "./getCountryByCode";

/**
 * Maps upstream's `zip_name_type` token to the label a form should show.
 * Upstream only names the exceptions, so this table is deliberately small.
 *
 * This is the one hand-maintained mapping in the subdivision release — the
 * one place editorial judgment enters an otherwise generated-data package. It
 * is accepted only because the upstream token set here is tiny and stable
 * (`zip`, `pin`, `eircode`). If `sync:data` ever logs an unseen token, add it
 * here deliberately; the `?? DEFAULT_POSTAL_LABEL` fallback below means an
 * unknown token degrades to "postal code" rather than throwing.
 */
const LABEL_TEXT: Record<string, string> = {
  zip: "ZIP code",
  pin: "PIN code",
  eircode: "Eircode",
  postal: "postal code",
};

/**
 * The name a country actually uses for its postal code — for labelling a form
 * field correctly per country instead of showing "ZIP code" worldwide.
 *
 * Defaults to `"postal code"`, which is right for 237 of 249 countries;
 * upstream only records the exceptions.
 *
 * @example
 * getPostalLabel("US"); // "ZIP code"
 * getPostalLabel("IN"); // "PIN code"
 * getPostalLabel("IE"); // "Eircode"
 * getPostalLabel("DE"); // "postal code"
 */
export const getPostalLabel = (countryCode: AnyCountryCode): string => {
  const alpha2 = getCountryByCode(countryCode)?.countryCode;
  if (!alpha2) return DEFAULT_POSTAL_LABEL;
  const token = POSTAL_LABELS[alpha2];
  if (!token) return DEFAULT_POSTAL_LABEL;
  return LABEL_TEXT[token] ?? DEFAULT_POSTAL_LABEL;
};
