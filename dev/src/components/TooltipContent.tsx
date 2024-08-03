import React, { FC } from "react";

import { Country } from "../../../src";

interface TooltipContentProps {
  selectedCountry: Country | null;
}

const TooltipContent: FC<TooltipContentProps> = (props: TooltipContentProps) => {
  const { selectedCountry } = props;
  if (!selectedCountry) {
    return null;
  }
  return (
    <div>
      <p>
        Supported postal code for <b>{selectedCountry.countryName}</b>
      </p>
      <ul>
        {selectedCountry &&
          selectedCountry.examplePostalCodes.map((example: string, index: number) => <li key={index}>{example}</li>)}
      </ul>
    </div>
  );
};

export default TooltipContent;
