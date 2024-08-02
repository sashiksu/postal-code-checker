import { InfoCircleOutlined } from "@ant-design/icons";
import { Alert, Form, Input, Select } from "antd";
import React, { ChangeEvent, useState } from "react";
import { Country, CountryCode, usePostalCodeValidation } from "../src/index";

const LivePlayground = () => {
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [isPostalCodeValid, setIsPostalCodeValid] = useState<boolean | null>(null);
  const [postalCode, setPostalCode] = useState<string>("");

  const { validatePostalCode, getCountryByCode, getAllCountries } = usePostalCodeValidation();

  const countriesOptions = getAllCountries().map((country) => ({
    value: country.code,
    label: country.country,
  }));

  const handleCountryChange = (value: string) => {
    const country: Country | null = getCountryByCode(value as CountryCode);
    setSelectedCountry(country);
    setIsPostalCodeValid(null);
    setPostalCode("");
  };

  const handlePostalCodeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const postalCode = e.target.value;
    setPostalCode(postalCode);
    if (selectedCountry) {
      const isValid = validatePostalCode(selectedCountry.code, postalCode);
      setIsPostalCodeValid(isValid);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        width: "100%",
        backgroundColor: "#f0f2f5",
      }}
    >
      <div
        style={{
          textAlign: "center",
          margin: "20px",
          maxWidth: "400px",
          width: "100%",
          padding: "24px",
          backgroundColor: "white",
          borderRadius: "8px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Form layout="vertical">
          <Form.Item label="Country">
            <Select
              defaultValue={selectedCountry?.code ?? "Select"}
              onChange={handleCountryChange}
              options={countriesOptions}
              filterOption={true}
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
            <Alert type="error" message={`Invalid postal code for ${selectedCountry?.country}`} banner />
          ) : null}
        </Form>
        <pre
          style={{
            marginTop: "20px",
            textAlign: "left",
            backgroundColor: "#f6f8fa",
            padding: "12px",
            borderRadius: "4px",
            overflowX: "auto",
          }}
        >
          {JSON.stringify(selectedCountry, null, 2)}
        </pre>
      </div>
    </div>
  );
};

const TooltipContent = (props: any) => {
  const { selectedCountry } = props;
  if (!selectedCountry) {
    return null;
  }
  return (
    <div>
      <p>
        Supported postal code for <b>{selectedCountry.country}</b>
      </p>
      <ul>
        {selectedCountry &&
          selectedCountry.example.map((example: string, index: number) => <li key={index}>{example}</li>)}
      </ul>
    </div>
  );
};

export default LivePlayground;
