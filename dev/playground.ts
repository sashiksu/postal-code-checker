import getCountryByCode from "../src/index";

document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("countryCode") as HTMLInputElement;
  const button = document.getElementById("submit") as HTMLButtonElement;
  const result = document.getElementById("result") as HTMLDivElement;

  button.addEventListener("click", () => {
    const code: any = input.value.toUpperCase();
    const countryInfo: any = getCountryByCode(code);
    result.textContent = countryInfo ? `Country: ${countryInfo.country}` : "Country not found";
  });
});
