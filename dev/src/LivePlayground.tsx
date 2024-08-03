import { InfoCircleOutlined } from "@ant-design/icons";
import { Alert, Form, Input, Select } from "antd";
import React, { ChangeEvent, FC, useState } from "react";

import { Country, CountryCode, getAllCountries, getCountryByCode, usePostalCodeValidation } from "../../src";
import TooltipContent from "./components/TooltipContent";

import { CodeBlock, Container, FormWrapper } from "./styles";

const LivePlayground: FC = () => {
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [isPostalCodeValid, setIsPostalCodeValid] = useState<boolean | null>(null);
  const [postalCode, setPostalCode] = useState<string>("");

  const { validatePostalCode } = usePostalCodeValidation();

  const countriesOptions = getAllCountries().map((country) => ({
    value: country.countryCode,
    label: country.countryName,
  }));

  const handleCountryChange = (value: string): void => {
    const country: Country | null = getCountryByCode(value as CountryCode);
    setSelectedCountry(country);
    setIsPostalCodeValid(null);
    setPostalCode("");
  };

  const handlePostalCodeChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const postalCode = e.target.value;
    setPostalCode(postalCode);
    if (selectedCountry) {
      const isValid = validatePostalCode(selectedCountry.countryCode, postalCode);
      setIsPostalCodeValid(isValid);
    }
  };

  return (
    <div style={Container}>
      <div style={FormWrapper}>
        <Form layout="vertical">
          <Form.Item label="Country">
            <Select
              defaultValue={selectedCountry?.countryCode.toString() ?? "Select"}
              onChange={handleCountryChange}
              options={countriesOptions}
              showSearch={true}
              filterOption={(input, option) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase())}
              style={{ width: "100%" }}
              size="large"
            />
          </Form.Item>
          <Form.Item
            label="Postal Code"
            tooltip={
              isPostalCodeValid === false
                ? {
                    title: isPostalCodeValid === false ? <TooltipContent selectedCountry={selectedCountry} /> : null,
                    icon: <InfoCircleOutlined />,
                    placement: "right",
                    overlayInnerStyle: { width: "300px" },
                  }
                : null
            }
          >
            <Input
              value={postalCode}
              placeholder="Enter postal code here"
              size="large"
              status={isPostalCodeValid === false ? "error" : undefined}
              onChange={handlePostalCodeChange}
            />
          </Form.Item>
          {isPostalCodeValid === false ? (
            <Alert type="error" message={`Invalid postal code for ${selectedCountry?.countryName}`} banner />
          ) : null}
        </Form>
        <pre style={CodeBlock}>{JSON.stringify(selectedCountry, null, 2)}</pre>
      </div>
    </div>
  );
};

export default LivePlayground;
