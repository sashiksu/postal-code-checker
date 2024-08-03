import { COUNTRIES } from "../assets/index";

export type CountryCode = Extract<keyof typeof COUNTRIES, string>;
