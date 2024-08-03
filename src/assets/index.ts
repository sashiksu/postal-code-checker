import { PostalCodeData } from "../types/PostalCodeData";

export const COUNTRIES: PostalCodeData = {
  AD: {
    regex: "/^(AD\\d{3})$/",
    example: ["AD100"],
    isGenericRegex: false,
    country: "Andorra",
  },
  AE: {
    regex: "/^(.{1,255})$/",
    example: [],
    isGenericRegex: true,
    country: "United Arab Emirates",
  },
  AF: {
    regex: "/^(\\d{4})$/",
    example: ["1057"],
    isGenericRegex: false,
    country: "Afghanistan",
  },
  AG: {
    regex: "/^(.{1,255})$/",
    example: ["33901"],
    isGenericRegex: true,
    country: "Antigua and Barbuda",
  },
  AI: {
    regex: "/^((AI-2640))$/",
    example: ["AI-2640"],
    isGenericRegex: false,
    country: "Anguilla",
  },
  AL: {
    regex: "/^(\\d{4})$/",
    example: ["5300"],
    isGenericRegex: false,
    country: "Albania",
  },
  AM: {
    regex: "/^((\\d{4})|(\\d{6}))$/",
    example: ["0010", " 001011"],
    isGenericRegex: false,
    country: "Armenia",
  },
  AO: {
    regex: "/^(.{1,255})$/",
    example: [],
    isGenericRegex: true,
    country: "Angola",
  },
  AQ: {
    regex: "/^((7151))$/",
    example: ["7151"],
    isGenericRegex: false,
    country: "Antarctica",
  },
  AR: {
    regex: "/^(([A-Z]\\d{4}[A-Z]{3})|([A-Z]\\d{4}))$/",
    example: ["C1425CLA", " U9000"],
    isGenericRegex: false,
    country: "Argentina",
  },
  AS: {
    regex: "/^(967\\d{2}(-\\d{4})?)$/",
    example: ["96799", " 96799-9999"],
    isGenericRegex: false,
    country: "American Samoa",
  },
  AT: {
    regex: "/^(\\d{4})$/",
    example: ["1010"],
    isGenericRegex: false,
    country: "Austria",
  },
  AU: {
    regex: "/^(\\d{4})$/",
    example: ["2599"],
    isGenericRegex: false,
    country: "Australia",
  },
  AW: {
    regex: "/^(.{1,255})$/",
    example: [],
    isGenericRegex: true,
    country: "Aruba",
  },
  AZ: {
    regex: "/^((AZ)(\\d{4})|(AZ )(\\d{4}))$/",
    example: ["AZ 1000", " AZ1000"],
    isGenericRegex: false,
    country: "Azerbaijan",
  },
  BA: {
    regex: "/^(\\d{5})$/",
    example: ["71000"],
    isGenericRegex: false,
    country: "Bosnia and Herzegovina",
  },
  BB: {
    regex: "/^(BB\\d{5})$/",
    example: ["BB15094"],
    isGenericRegex: false,
    country: "Barbados",
  },
  BD: {
    regex: "/^(\\d{4})$/",
    example: ["1219"],
    isGenericRegex: false,
    country: "Bangladesh",
  },
  BE: {
    regex: "/^(\\d{4})$/",
    example: ["1049"],
    isGenericRegex: false,
    country: "Belgium",
  },
  BF: {
    regex: "/^([1-9]\\d{4})$/",
    example: ["99999"],
    isGenericRegex: false,
    country: "Burkina Faso",
  },
  BG: {
    regex: "/^(\\d{4})$/",
    example: ["1000"],
    isGenericRegex: false,
    country: "Bulgaria",
  },
  BH: {
    regex: "/^(\\d{3}\\d?)$/",
    example: ["317", " 1216"],
    isGenericRegex: false,
    country: "Bahrain",
  },
  BI: {
    regex: "/^(.{1,255})$/",
    example: [],
    isGenericRegex: true,
    country: "Burundi",
  },
  BJ: {
    regex: "/^(.{1,255})$/",
    example: [],
    isGenericRegex: true,
    country: "Benin",
  },
  BM: {
    regex: "/^([A-Z]{2} \\d{2})$/",
    example: ["CR 03"],
    isGenericRegex: false,
    country: "Bermuda",
  },
  BN: {
    regex: "/^([A-Z]{2}\\d{4})$/",
    example: ["KB2333"],
    isGenericRegex: false,
    country: "Brunei Darussalam",
  },
  BO: {
    regex: "/^(.{1,255})$/",
    example: [],
    isGenericRegex: true,
    country: "Bolivia",
  },
  BQ: {
    regex: "/^(.{1,255})$/",
    example: [],
    isGenericRegex: true,
    country: "Bonaire, Sint Eustatius and Saba",
  },
  BR: {
    regex: "/^([0-9]{5}-[0-9]{3})$/",
    example: ["28999-999"],
    isGenericRegex: false,
    country: "Brazil",
  },
  BS: {
    regex: "/^(.{1,255})$/",
    example: [],
    isGenericRegex: true,
    country: "Bahamas",
  },
  BT: {
    regex: "/^(\\d{5})$/",
    example: ["31002"],
    isGenericRegex: false,
    country: "Bhutan",
  },
  BV: {
    regex: "/^(.{1,255})$/",
    example: [],
    isGenericRegex: true,
    country: "Bouvet Island",
  },
  BW: {
    regex: "/^(.{1,255})$/",
    example: [],
    isGenericRegex: true,
    country: "Botswana",
  },
  BY: {
    regex: "/^(\\d{6})$/",
    example: ["231300"],
    isGenericRegex: false,
    country: "Belarus",
  },
  BZ: {
    regex: "/^(.{1,255})$/",
    example: [],
    isGenericRegex: true,
    country: "Belize",
  },
  CA: {
    regex: "/^([A-Z][0-9][A-Z] [0-9][A-Z][0-9])$/",
    example: ["K1A 0T6"],
    isGenericRegex: false,
    country: "Canada",
  },
  CC: {
    regex: "/^((6799))$/",
    example: ["6799"],
    isGenericRegex: false,
    country: "Cocos (Keeling) Islands",
  },
  CD: {
    regex: "/^(.{1,255})$/",
    example: [],
    isGenericRegex: true,
    country: "Congo, the Democratic Republic of the",
  },
  CF: {
    regex: "/^(.{1,255})$/",
    example: [],
    isGenericRegex: true,
    country: "Central African Republic",
  },
  CG: {
    regex: "/^(.{1,255})$/",
    example: [],
    isGenericRegex: true,
    country: "Congo",
  },
  CH: {
    regex: "/^([1-9]\\d{3})$/",
    example: ["8050"],
    isGenericRegex: false,
    country: "Switzerland",
  },
  CI: {
    regex: "/^(.{1,255})$/",
    example: [],
    isGenericRegex: true,
    country: "Côte d'Ivoire",
  },
  CK: {
    regex: "/^(.{1,255})$/",
    example: [],
    isGenericRegex: true,
    country: "Cook Islands",
  },
  CL: {
    regex: "/^(\\d{7})$/",
    example: ["9340000"],
    isGenericRegex: false,
    country: "Chile",
  },
  CM: {
    regex: "/^(.{1,255})$/",
    example: [],
    isGenericRegex: true,
    country: "Cameroon",
  },
  CN: {
    regex: "/^(\\d{6})$/",
    example: ["710000"],
    isGenericRegex: false,
    country: "China",
  },
  CO: {
    regex: "/^(\\d{6})$/",
    example: ["111121"],
    isGenericRegex: false,
    country: "Colombia",
  },
  CR: {
    regex: "/^(\\d{5})$/",
    example: ["10101"],
    isGenericRegex: false,
    country: "Costa Rica",
  },
  CU: {
    regex: "/^((CP)?\\d{5})$/",
    example: ["CP10400"],
    isGenericRegex: false,
    country: "Cuba",
  },
  CV: {
    regex: "/^(\\d{4})$/",
    example: ["5110"],
    isGenericRegex: false,
    country: "Cabo Verde",
  },
  CW: {
    regex: "/^(.{1,255})$/",
    example: [],
    isGenericRegex: true,
    country: "Curaçao",
  },
  CX: {
    regex: "/^((6798))$/",
    example: ["6798"],
    isGenericRegex: false,
    country: "Christmas Island",
  },
  CY: {
    regex: "/^([1-9]\\d{3})$/",
    example: ["4999"],
    isGenericRegex: false,
    country: "Cyprus",
  },
  CZ: {
    regex: "/^([1-7][0-9]{2} [0-9]{2}|[1-7][0-9]{4})$/",
    example: ["160 00", " 16000"],
    isGenericRegex: false,
    country: "Czech Republic",
  },
  DE: {
    regex: "/^(\\d{5})$/",
    example: ["60320"],
    isGenericRegex: false,
    country: "Germany",
  },
  DJ: {
    regex: "/^(.{1,255})$/",
    example: [],
    isGenericRegex: true,
    country: "Djibouti",
  },
  DK: {
    regex: "/^(\\d{4})$/",
    example: ["2000"],
    isGenericRegex: false,
    country: "Denmark",
  },
  DM: {
    regex: "/^(.{1,255})$/",
    example: [],
    isGenericRegex: true,
    country: "Dominica",
  },
  DO: {
    regex: "/^(\\d{5})$/",
    example: ["10103"],
    isGenericRegex: false,
    country: "Dominican Republic",
  },
  DZ: {
    regex: "/^(\\d{5})$/",
    example: ["16000"],
    isGenericRegex: false,
    country: "Algeria",
  },
  EC: {
    regex: "/^(\\d{6})$/",
    example: ["170515"],
    isGenericRegex: false,
    country: "Ecuador",
  },
  EE: {
    regex: "/^(\\d{5})$/",
    example: ["10111"],
    isGenericRegex: false,
    country: "Estonia",
  },
  EG: {
    regex: "/^(\\d{5})$/",
    example: ["12411"],
    isGenericRegex: false,
    country: "Egypt",
  },
  ER: {
    regex: "/^(.{1,255})$/",
    example: [],
    isGenericRegex: true,
    country: "Eritrea",
  },
  ES: {
    regex: "/^(\\d{5})$/",
    example: ["28006"],
    isGenericRegex: false,
    country: "Spain",
  },
  ET: {
    regex: "/^(\\d{4})$/",
    example: ["3020"],
    isGenericRegex: false,
    country: "Ethiopia",
  },
  FI: {
    regex: "/^(\\d{5})$/",
    example: ["00180"],
    isGenericRegex: false,
    country: "Finland",
  },
  FJ: {
    regex: "/^(.{1,255})$/",
    example: [],
    isGenericRegex: true,
    country: "Fiji",
  },
  FK: {
    regex: "/^((FIQQ 1ZZ))$/",
    example: ["FIQQ 1ZZ"],
    isGenericRegex: false,
    country: "Falkland Islands (Malvinas)",
  },
  FM: {
    regex: "/^(9694\\d{1}(-\\d{4})?)$/",
    example: ["96942", " 96942-9999"],
    isGenericRegex: false,
    country: "Micronesia, Federated States of",
  },
  FO: {
    regex: "/^(\\d{3})$/",
    example: ["927"],
    isGenericRegex: false,
    country: "Faroe Islands",
  },
  FR: {
    regex: "/^(\\d{5})$/",
    example: ["75008"],
    isGenericRegex: false,
    country: "France",
  },
  GA: {
    regex: "/^(.{1,255})$/",
    example: [],
    isGenericRegex: true,
    country: "Gabon",
  },
  GB: {
    regex:
      "/^(([G][I][R] 0[A]{2})|((([A-Z][0-9]{1,2})|(([A-Z][A-HJ-Y][0-9]{1,2})|(([A-Z][0-9][A-Z])|([A-Z][A-HJ-Y][0-9]?[A-Z])))) [0-9][A-Z]{2}))$/",
    example: ["DT3 6GB", " L2 2DP"],
    isGenericRegex: false,
    country: "United Kingdom of Great Britain and Northern Ireland (the)",
  },
  GD: {
    regex: "/^(.{1,255})$/",
    example: [],
    isGenericRegex: true,
    country: "Grenada",
  },
  GE: {
    regex: "/^(\\d{4})$/",
    example: ["0100"],
    isGenericRegex: false,
    country: "Georgia",
  },
  GG: {
    regex: "/^((GY)([0-9][0-9A-HJKPS-UW]?|[A-HK-Y][0-9][0-9ABEHMNPRV-Y]?) [0-9][ABD-HJLNP-UW-Z]{2})$/",
    example: ["GY1 3HR"],
    isGenericRegex: false,
    country: "Guernsey",
  },
  GH: {
    regex: "/^(.{1,255})$/",
    example: [],
    isGenericRegex: true,
    country: "Ghana",
  },
  GI: {
    regex: "/^((GX11 1AA))$/",
    example: ["GX11 1AA"],
    isGenericRegex: false,
    country: "Gibraltar",
  },
  GL: {
    regex: "/^(39\\d{2})$/",
    example: ["3905"],
    isGenericRegex: false,
    country: "Greenland",
  },
  GM: {
    regex: "/^(.{1,255})$/",
    example: [],
    isGenericRegex: true,
    country: "Gambia",
  },
  GN: {
    regex: "/^(\\d{3})$/",
    example: ["001"],
    isGenericRegex: false,
    country: "Guinea",
  },
  GQ: {
    regex: "/^(.{1,255})$/",
    example: [],
    isGenericRegex: true,
    country: "Equatorial Guinea",
  },
  GR: {
    regex: "/^((\\d{3}) \\d{2}|\\d{5})$/",
    example: ["241 00", " 24100"],
    isGenericRegex: false,
    country: "Greece",
  },
  GS: {
    regex: "/^((SIQQ 1ZZ))$/",
    example: ["SIQQ 1ZZ"],
    isGenericRegex: false,
    country: "South Georgia and the South Sandwich Islands",
  },
  GT: {
    regex: "/^(\\d{5})$/",
    example: ["01002"],
    isGenericRegex: false,
    country: "Guatemala",
  },
  GU: {
    regex: "/^(((969)[1-3][0-2])(-\\d{4})?)$/",
    example: ["96911", " 96911-9999"],
    isGenericRegex: false,
    country: "Guam",
  },
  GW: {
    regex: "/^(\\d{4})$/",
    example: ["1000"],
    isGenericRegex: false,
    country: "Guinea-Bissau",
  },
  GY: {
    regex: "/^(.{1,255})$/",
    example: [],
    isGenericRegex: true,
    country: "Guyana",
  },
  HK: {
    regex: "/^((999077))$/",
    example: ["999077"],
    isGenericRegex: false,
    country: "Hong Kong",
  },
  HM: {
    regex: "/^((7151))$/",
    example: ["7151"],
    isGenericRegex: false,
    country: "Heard Island and McDonald Islands",
  },
  HN: {
    regex: "/^(\\d{5})$/",
    example: ["34101"],
    isGenericRegex: false,
    country: "Honduras",
  },
  HR: {
    regex: "/^([1-5]\\d{4})$/",
    example: ["21000"],
    isGenericRegex: false,
    country: "Croatia",
  },
  HT: {
    regex: "/^((HT)(\\d{4})|(HT) (\\d{4}))$/",
    example: ["HT1440", " HT 1440"],
    isGenericRegex: false,
    country: "Haiti",
  },
  HU: {
    regex: "/^([1-9]\\d{3})$/",
    example: ["2310"],
    isGenericRegex: false,
    country: "Hungary",
  },
  ID: {
    regex: "/^([1-9]\\d{4})$/",
    example: ["15360"],
    isGenericRegex: false,
    country: "Indonesia",
  },
  IE: {
    regex: "/^(.{1,255})$/",
    example: ["D02 AF30"],
    isGenericRegex: true,
    country: "Ireland",
  },
  IL: {
    regex: "/^(\\d{7})$/",
    example: ["1029200"],
    isGenericRegex: false,
    country: "Israel",
  },
  IM: {
    regex: "/^((IM)([0-9][0-9A-HJKPS-UW]?|[A-HK-Y][0-9][0-9ABEHMNPRV-Y]?) [0-9][ABD-HJLNP-UW-Z]{2})$/",
    example: ["IM5 1JS"],
    isGenericRegex: false,
    country: "Isle of Man",
  },
  IN: {
    regex: "/^([1-9]\\d{5})$/",
    example: ["500012"],
    isGenericRegex: false,
    country: "India",
  },
  IO: {
    regex: "/^((BB9D 1ZZ))$/",
    example: ["BB9D 1ZZ"],
    isGenericRegex: false,
    country: "British Indian Ocean Territory",
  },
  IQ: {
    regex: "/^(\\d{5})$/",
    example: ["58019"],
    isGenericRegex: false,
    country: "Iraq",
  },
  IR: {
    regex: "/^(\\d{5}[\\-]?\\d{5})$/",
    example: ["9187158198", " 15119-43943"],
    isGenericRegex: false,
    country: "Iran, Islamic Republic of",
  },
  IS: {
    regex: "/^([1-9]\\d{2})$/",
    example: ["101"],
    isGenericRegex: false,
    country: "Iceland",
  },
  IT: {
    regex: "/^(\\d{5})$/",
    example: ["36051"],
    isGenericRegex: false,
    country: "Italy",
  },
  JE: {
    regex: "/^(JE[0-9]{1}[\\s]([\\d][A-Z]{2}))$/",
    example: ["JE1 1AG"],
    isGenericRegex: false,
    country: "Jersey",
  },
  JM: {
    regex: "/^((JM)[A-Z]{3}\\d{2})$/",
    example: ["JMAAW19"],
    isGenericRegex: false,
    country: "Jamaica",
  },
  JO: {
    regex: "/^(\\d{5})$/",
    example: ["11118"],
    isGenericRegex: false,
    country: "Jordan",
  },
  JP: {
    regex: "/^((\\d{3}-\\d{4}))$/",
    example: ["408-0307"],
    isGenericRegex: false,
    country: "Japan",
  },
  KE: {
    regex: "/^(\\d{5})$/",
    example: ["40406"],
    isGenericRegex: false,
    country: "Kenya",
  },
  KG: {
    regex: "/^(\\d{6})$/",
    example: ["720020"],
    isGenericRegex: false,
    country: "Kyrgyzstan",
  },
  KH: {
    regex: "/^(\\d{5,6})$/",
    example: ["01501", " 010102", " 120209"],
    isGenericRegex: false,
    country: "Cambodia",
  },
  KI: {
    regex: "/^(KI\\d{4})$/",
    example: ["KI0107"],
    isGenericRegex: false,
    country: "Kiribati",
  },
  KM: {
    regex: "/^(.{1,255})$/",
    example: [],
    isGenericRegex: true,
    country: "Comoros",
  },
  KN: {
    regex: "/^(KN\\d{4}(\\-\\d{4})?)$/",
    example: ["KN0101", " KN0802", " KN0801-0802", " KN0901-0902"],
    isGenericRegex: false,
    country: "Saint Kitts and Nevis",
  },
  KP: {
    regex: "/^(.{1,255})$/",
    example: [],
    isGenericRegex: true,
    country: "Korea, Democratic People's Republic of",
  },
  KR: {
    regex: "/^(\\d{5})$/",
    example: ["11962"],
    isGenericRegex: false,
    country: "Korea, Republic of",
  },
  KW: {
    regex: "/^(\\d{5})$/",
    example: ["60000"],
    isGenericRegex: false,
    country: "Kuwait",
  },
  KY: {
    regex: "/^([K][Y][0-9]{1}[-]([0-9]){4})$/",
    example: ["KY1-1800"],
    isGenericRegex: false,
    country: "Cayman Islands",
  },
  KZ: {
    regex: "/^(([A-Z]\\d{2}[A-Z]\\d[A-Z]\\d)|(\\d{6}))$/",
    example: ["A10A5T4", " 010010"],
    isGenericRegex: false,
    country: "Kazakhstan",
  },
  LA: {
    regex: "/^(\\d{5})$/",
    example: ["13000"],
    isGenericRegex: false,
    country: "Lao People's Democratic Republic",
  },
  LB: {
    regex: "/^(\\d{4}( \\d{4})?)$/",
    example: ["2038 3054", " 1103"],
    isGenericRegex: false,
    country: "Lebanon",
  },
  LC: {
    regex: "/^(LC\\d{2}  \\d{3})$/",
    example: ["LC05 201"],
    isGenericRegex: false,
    country: "Saint Lucia",
  },
  LI: {
    regex: "/^(\\d{4})$/",
    example: ["9490"],
    isGenericRegex: false,
    country: "Liechtenstein",
  },
  LK: {
    regex: "/^(\\d{5})$/",
    example: ["80212"],
    isGenericRegex: false,
    country: "Sri Lanka",
  },
  LR: {
    regex: "/^(\\d{4})$/",
    example: ["1000"],
    isGenericRegex: false,
    country: "Liberia",
  },
  LS: {
    regex: "/^(\\d{3})$/",
    example: ["100"],
    isGenericRegex: false,
    country: "Lesotho",
  },
  LT: {
    regex: "/^(((LT)[\\-])?(\\d{5}))$/",
    example: ["LT-01100", " 01100"],
    isGenericRegex: false,
    country: "Lithuania",
  },
  LU: {
    regex: "/^(((L)[\\-])?(\\d{4}))$/",
    example: ["1019", " L-2530"],
    isGenericRegex: false,
    country: "Luxembourg",
  },
  LV: {
    regex: "/^(((LV)[\\-])?(\\d{4}))$/",
    example: ["LV-1010", " 1010"],
    isGenericRegex: false,
    country: "Latvia",
  },
  LY: {
    regex: "/^(.{1,255})$/",
    example: ["13.05.312"],
    isGenericRegex: true,
    country: "Libya",
  },
  MA: {
    regex: "/^([1-9]\\d{4})$/",
    example: ["20192"],
    isGenericRegex: false,
    country: "Morocco",
  },
  MD: {
    regex: "/^((MD[\\-]?)?(\\d{4}))$/",
    example: ["MD2001", " MD-2001", " 2001"],
    isGenericRegex: false,
    country: "Moldova, Republic of",
  },
  ME: {
    regex: "/^(\\d{5})$/",
    example: ["81250"],
    isGenericRegex: false,
    country: "Montenegro",
  },
  MG: {
    regex: "/^(\\d{3})$/",
    example: ["101"],
    isGenericRegex: false,
    country: "Madagascar",
  },
  MH: {
    regex: "/^(((969)[6-7][0-9])(-\\d{4})?)$/",
    example: ["96960", " 96960-9999"],
    isGenericRegex: false,
    country: "Marshall Islands",
  },
  MK: {
    regex: "/^(\\d{4})$/",
    example: ["1045"],
    isGenericRegex: false,
    country: "North Macedonia",
  },
  ML: {
    regex: "/^(.{1,255})$/",
    example: [],
    isGenericRegex: true,
    country: "Mali",
  },
  MM: {
    regex: "/^(\\d{5})$/",
    example: ["11121"],
    isGenericRegex: false,
    country: "Myanmar",
  },
  MN: {
    regex: "/^(\\d{5})$/",
    example: ["16080"],
    isGenericRegex: false,
    country: "Mongolia",
  },
  MO: {
    regex: "/^(.{1,255})$/",
    example: ["999078"],
    isGenericRegex: true,
    country: "Macao",
  },
  MP: {
    regex: "/^(9695\\d{1}(-\\d{4})?)$/",
    example: ["96950", " 96950-9999"],
    isGenericRegex: false,
    country: "Northern Mariana Islands",
  },
  MR: {
    regex: "/^(.{1,255})$/",
    example: [],
    isGenericRegex: true,
    country: "Mauritania",
  },
  MS: {
    regex: "/^(MSR\\d{4})$/",
    example: ["MSR1120"],
    isGenericRegex: false,
    country: "Montserrat",
  },
  MT: {
    regex:
      "/^([A-Z]{3} [0-9]{4}|[A-Z]{2}[0-9]{2}|[A-Z]{2} [0-9]{2}|[A-Z]{3}[0-9]{4}|[A-Z]{3}[0-9]{2}|[A-Z]{3} [0-9]{2})$/",
    example: ["VLT 1117", " TP01", " TP 01", " RBT1676", " QRM09", " BKR 01"],
    isGenericRegex: false,
    country: "Malta",
  },
  MU: {
    regex: "/^(([0-9A-R]\\d{4}))$/",
    example: ["A0000", " 20101"],
    isGenericRegex: false,
    country: "Mauritius",
  },
  MV: {
    regex: "/^(\\d{5})$/",
    example: ["20195"],
    isGenericRegex: false,
    country: "Maldives",
  },
  MW: {
    regex: "/^(\\d{6})$/",
    example: ["101100", " 307100"],
    isGenericRegex: false,
    country: "Malawi",
  },
  MX: {
    regex: "/^(\\d{5})$/",
    example: ["97229"],
    isGenericRegex: false,
    country: "Mexico",
  },
  MY: {
    regex: "/^(\\d{5})$/",
    example: ["50050"],
    isGenericRegex: false,
    country: "Malaysia",
  },
  MZ: {
    regex: "/^(\\d{4})$/",
    example: ["1104"],
    isGenericRegex: false,
    country: "Mozambique",
  },
  NA: {
    regex: "/^(\\d{5})$/",
    example: ["10003"],
    isGenericRegex: false,
    country: "Namibia",
  },
  NC: {
    regex: "/^(988\\d{2})$/",
    example: ["98814"],
    isGenericRegex: false,
    country: "New Caledonia",
  },
  NE: {
    regex: "/^(\\d{4})$/",
    example: ["8001"],
    isGenericRegex: false,
    country: "Niger",
  },
  NF: {
    regex: "/^((2899))$/",
    example: ["2899"],
    isGenericRegex: false,
    country: "Norfolk Island",
  },
  NG: {
    regex: "/^([1-9]\\d{5})$/",
    example: ["100001"],
    isGenericRegex: false,
    country: "Nigeria",
  },
  NI: {
    regex: "/^(\\d{5})$/",
    example: ["11001"],
    isGenericRegex: false,
    country: "Nicaragua",
  },
  NL: {
    regex: "/^([1-9]\\d{3} [A-Z]{2}|[1-9]\\d{3}[A-Z]{2})$/",
    example: ["1011 AC", " 1011AC"],
    isGenericRegex: false,
    country: "Netherlands",
  },
  NO: {
    regex: "/^(\\d{4})$/",
    example: ["5262"],
    isGenericRegex: false,
    country: "Norway",
  },
  NP: {
    regex: "/^(\\d{5})$/",
    example: ["44600"],
    isGenericRegex: false,
    country: "Nepal",
  },
  NR: {
    regex: "/^((NRU68))$/",
    example: ["NRU68"],
    isGenericRegex: false,
    country: "Nauru",
  },
  NU: {
    regex: "/^((9974))$/",
    example: ["9974"],
    isGenericRegex: false,
    country: "Niue",
  },
  NZ: {
    regex: "/^(\\d{4})$/",
    example: ["8041"],
    isGenericRegex: false,
    country: "New Zealand",
  },
  OM: {
    regex: "/^(\\d{3})$/",
    example: ["112"],
    isGenericRegex: false,
    country: "Oman",
  },
  PA: {
    regex: "/^(\\d{4})$/",
    example: ["0601", " 1001"],
    isGenericRegex: false,
    country: "Panama",
  },
  PE: {
    regex: "/^(\\d{5})$/",
    example: ["15001"],
    isGenericRegex: false,
    country: "Peru",
  },
  PF: {
    regex: "/^(((987)\\d{2}))$/",
    example: ["98755"],
    isGenericRegex: false,
    country: "French Polynesia",
  },
  PG: {
    regex: "/^(\\d{3})$/",
    example: ["244"],
    isGenericRegex: false,
    country: "Papua New Guinea",
  },
  PH: {
    regex: "/^(\\d{4})$/",
    example: ["4104"],
    isGenericRegex: false,
    country: "Philippines",
  },
  PK: {
    regex: "/^([1-9]\\d{4})$/",
    example: ["75600"],
    isGenericRegex: false,
    country: "Pakistan",
  },
  PL: {
    regex: "/^([0-9]{2}[-]([0-9]){3})$/",
    example: ["87-100"],
    isGenericRegex: false,
    country: "Poland",
  },
  PN: {
    regex: "/^((PCR9 1ZZ))$/",
    example: ["PCR9 1ZZ"],
    isGenericRegex: false,
    country: "Pitcairn",
  },
  PS: {
    regex: "/^((P[1-9]\\d{6})|(\\d{3}-\\d{3}))$/",
    example: ["600-699", " P3600700"],
    isGenericRegex: false,
    country: "Palestine, State of",
  },
  PT: {
    regex: "/^([1-9]\\d{3}((-)\\d{3}))$/",
    example: ["1000-260"],
    isGenericRegex: false,
    country: "Portugal",
  },
  PW: {
    regex: "/^((96939|96940))$/",
    example: [" 96939", " 96940"],
    isGenericRegex: false,
    country: "Palau",
  },
  PY: {
    regex: "/^(\\d{4})$/",
    example: ["3180"],
    isGenericRegex: false,
    country: "Paraguay",
  },
  QA: {
    regex: "/^(.{1,255})$/",
    example: [],
    isGenericRegex: true,
    country: "Qatar",
  },
  RO: {
    regex: "/^(\\d{6})$/",
    example: ["507085"],
    isGenericRegex: false,
    country: "Romania",
  },
  RS: {
    regex: "/^(\\d{5,6})$/",
    example: ["24430", " 456769"],
    isGenericRegex: false,
    country: "Serbia",
  },
  RU: {
    regex: "/^(\\d{6})$/",
    example: ["385100"],
    isGenericRegex: false,
    country: "Russian Federation",
  },
  RW: {
    regex: "/^(.{1,255})$/",
    example: [],
    isGenericRegex: true,
    country: "Rwanda",
  },
  SA: {
    regex: "/^([1-8]\\d{4}([\\-]\\d{4})?)$/",
    example: ["11564", " 75311-8538"],
    isGenericRegex: false,
    country: "Saudi Arabia",
  },
  SB: {
    regex: "/^(.{1,255})$/",
    example: [],
    isGenericRegex: true,
    country: "Solomon Islands",
  },
  SC: {
    regex: "/^(.{1,255})$/",
    example: [],
    isGenericRegex: true,
    country: "Seychelles",
  },
  SD: {
    regex: "/^(\\d{5})$/",
    example: ["13315"],
    isGenericRegex: false,
    country: "Sudan",
  },
  SE: {
    regex: "/^([1-9]\\d{2} \\d{2})$/",
    example: ["113 51"],
    isGenericRegex: false,
    country: "Sweden",
  },
  SG: {
    regex: "/^(\\d{6})$/",
    example: ["570150"],
    isGenericRegex: false,
    country: "Singapore",
  },
  SH: {
    regex: "/^((ASCN 1ZZ|TDCU 1ZZ|STHL 1ZZ))$/",
    example: ["ASCN 1ZZ", " TDCU 1ZZ", " STHL 1ZZ"],
    isGenericRegex: false,
    country: "Saint Helena, Ascension and Tristan da Cunha",
  },
  SI: {
    regex: "/^([1-9]\\d{3})$/",
    example: ["8341"],
    isGenericRegex: false,
    country: "Slovenia",
  },
  SK: {
    regex: "/^((\\d{3} \\d{2})|\\d{5})$/",
    example: ["811 01", " 81101"],
    isGenericRegex: false,
    country: "Slovakia",
  },
  SL: {
    regex: "/^(.{1,255})$/",
    example: [],
    isGenericRegex: true,
    country: "Sierra Leone",
  },
  SM: {
    regex: "/^((4789\\d))$/",
    example: ["47894"],
    isGenericRegex: false,
    country: "San Marino",
  },
  SN: {
    regex: "/^([1-8]\\d{4})$/",
    example: ["10200"],
    isGenericRegex: false,
    country: "Senegal",
  },
  SO: {
    regex: "/^(.{1,255})$/",
    example: ["JH 09010"],
    isGenericRegex: true,
    country: "Somalia",
  },
  SR: {
    regex: "/^(.{1,255})$/",
    example: [],
    isGenericRegex: true,
    country: "Suriname",
  },
  SS: {
    regex: "/^(\\d{5})$/",
    example: ["11111"],
    isGenericRegex: false,
    country: "South Sudan",
  },
  ST: {
    regex: "/^(.{1,255})$/",
    example: [],
    isGenericRegex: true,
    country: "São Tomé and Príncipe",
  },
  SV: {
    regex: "/^(\\d{4})$/",
    example: ["1201"],
    isGenericRegex: false,
    country: "El Salvador",
  },
  SX: {
    regex: "/^(.{1,255})$/",
    example: [],
    isGenericRegex: true,
    country: "Sint Maarten (Dutch part)",
  },
  SY: {
    regex: "/^(.{1,255})$/",
    example: [],
    isGenericRegex: true,
    country: "Syrian Arab Republic",
  },
  SZ: {
    regex: "/^(([A-Z]\\d{3}))$/",
    example: ["M201"],
    isGenericRegex: false,
    country: "Swaziland",
  },
  TC: {
    regex: "/^((TKCA 1ZZ))$/",
    example: ["TKCA 1ZZ"],
    isGenericRegex: false,
    country: "Turks and Caicos Islands",
  },
  TD: {
    regex: "/^(.{1,255})$/",
    example: [],
    isGenericRegex: true,
    country: "Chad",
  },
  TF: {
    regex: "/^(.{1,255})$/",
    example: ["98413"],
    isGenericRegex: true,
    country: "French Southern Territories",
  },
  TG: {
    regex: "/^(.{1,255})$/",
    example: [],
    isGenericRegex: true,
    country: "Togo",
  },
  TH: {
    regex: "/^(\\d{5})$/",
    example: ["10240"],
    isGenericRegex: false,
    country: "Thailand",
  },
  TJ: {
    regex: "/^(7\\d{5})$/",
    example: ["799999"],
    isGenericRegex: false,
    country: "Tajikistan",
  },
  TK: {
    regex: "/^(.{1,255})$/",
    example: [],
    isGenericRegex: true,
    country: "Tokelau",
  },
  TL: {
    regex: "/^(.{1,255})$/",
    example: [],
    isGenericRegex: true,
    country: "Timor-Leste",
  },
  TM: {
    regex: "/^(7\\d{5})$/",
    example: ["745180"],
    isGenericRegex: false,
    country: "Turkmenistan",
  },
  TN: {
    regex: "/^(\\d{4})$/",
    example: ["3200"],
    isGenericRegex: false,
    country: "Tunisia",
  },
  TO: {
    regex: "/^(.{1,255})$/",
    example: [],
    isGenericRegex: true,
    country: "Tonga",
  },
  TR: {
    regex: "/^(\\d{5})$/",
    example: ["34000"],
    isGenericRegex: false,
    country: "Turkey",
  },
  TT: {
    regex: "/^(\\d{6})$/",
    example: ["120110"],
    isGenericRegex: false,
    country: "Trinidad and Tobago",
  },
  TV: {
    regex: "/^(.{1,255})$/",
    example: [],
    isGenericRegex: true,
    country: "Tuvalu",
  },
  TW: {
    regex: "/^((\\d{3}\\-\\d{3})|(\\d{3}[-]\\d{2})|(\\d{6})|(\\d{3}))$/",
    example: ["237-01", " 407", " 999999", " 999(-)999"],
    isGenericRegex: false,
    country: "Taiwan (Province of China)",
  },
  TZ: {
    regex: "/^(\\d{5})$/",
    example: ["31324"],
    isGenericRegex: false,
    country: "Tanzania, United Republic of",
  },
  UA: {
    regex: "/^(\\d{5})$/",
    example: ["65000"],
    isGenericRegex: false,
    country: "Ukraine",
  },
  UG: {
    regex: "/^(.{1,255})$/",
    example: [],
    isGenericRegex: true,
    country: "Uganda",
  },
  UM: {
    regex: "/^(.{1,255})$/",
    example: [],
    isGenericRegex: true,
    country: "United States Minor Outlying Islands",
  },
  US: {
    regex: "/^(\\d{5}(-\\d{4})?)$/",
    example: ["11550", " 11550-9999"],
    isGenericRegex: false,
    country: "United States of America",
  },
  UY: {
    regex: "/^([1-9]\\d{4})$/",
    example: ["11700"],
    isGenericRegex: false,
    country: "Uruguay",
  },
  UZ: {
    regex: "/^(\\d{6})$/",
    example: ["702100"],
    isGenericRegex: false,
    country: "Uzbekistan",
  },
  VA: {
    regex: "/^((00120))$/",
    example: ["00120"],
    isGenericRegex: false,
    country: "Holy See",
  },
  VC: {
    regex: "/^((VC)(\\d{4}))$/",
    example: ["VC0100"],
    isGenericRegex: false,
    country: "Saint Vincent and the Grenadines",
  },
  VE: {
    regex: "/^([1-8]\\d{3})$/",
    example: ["1061"],
    isGenericRegex: false,
    country: "Venezuela (Bolivarian Republic of)",
  },
  VG: {
    regex: "/^((VG11)[0-6][0])$/",
    example: ["VG1120"],
    isGenericRegex: false,
    country: "Virgin Islands (British)",
  },
  VI: {
    regex: "/^(008\\d{2}(-\\d{4})?)$/",
    example: ["00850", " 00850-9999"],
    isGenericRegex: false,
    country: "Virgin Islands (U.S.)",
  },
  VN: {
    regex: "/^(\\d{6})$/",
    example: ["112132"],
    isGenericRegex: false,
    country: "Viet Nam",
  },
  VU: {
    regex: "/^(.{1,255})$/",
    example: [],
    isGenericRegex: true,
    country: "Vanuatu",
  },
  WF: {
    regex: "/^((986)\\d{2})$/",
    example: ["98600"],
    isGenericRegex: false,
    country: "Wallis and Futuna",
  },
  WS: {
    regex: "/^(WS[1-2]\\d{3})$/",
    example: ["WS1382"],
    isGenericRegex: false,
    country: "Samoa",
  },
  YE: {
    regex: "/^(.{1,255})$/",
    example: [],
    isGenericRegex: true,
    country: "Yemen",
  },
  ZA: {
    regex: "/^(\\d{4})$/",
    example: ["6001"],
    isGenericRegex: false,
    country: "South Africa",
  },
  ZM: {
    regex: "/^(\\d{5})$/",
    example: ["50100"],
    isGenericRegex: false,
    country: "Zambia",
  },
  ZW: {
    regex: "/^(.{1,255})$/",
    example: [],
    isGenericRegex: true,
    country: "Zimbabwe",
  },
};