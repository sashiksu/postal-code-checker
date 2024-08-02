import { Select } from "antd";
import React, { useState } from "react";
import getCountryByCode from "../src/index";
import { CountryCode, CountryWithCode, getAllCountries } from "../src/utils";

const LivePlayground = () => {
  const [selectedCountry, setSelectedCountry] = useState<CountryWithCode | null>(null);

  const countriesOptions = getAllCountries().map((country) => ({
    value: country.code,
    label: country.country,
  }));

  const handleChange = (value: string) => {
    const country: CountryWithCode | null = getCountryByCode(value as CountryCode);
    setSelectedCountry(country);
  };

  return (
    <div style={{ textAlign: "center", margin: "20px", width: "100%" }}>
      <Select defaultValue={selectedCountry?.code ?? "Select"} onChange={handleChange} options={countriesOptions} />
      <pre>{JSON.stringify(selectedCountry, null, 2)}</pre>
    </div>
  );
};

export default LivePlayground;
