import React from "react";

export const Container: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "100vh",
  width: "100%",
  backgroundColor: "#f0f2f5",
};

export const FormWrapper: React.CSSProperties = {
  textAlign: "center",
  margin: "20px",
  maxWidth: "400px",
  width: "100%",
  padding: "24px",
  backgroundColor: "white",
  borderRadius: "8px",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
};

export const CodeBlock: React.CSSProperties = {
  marginTop: "20px",
  textAlign: "left",
  backgroundColor: "#f6f8fa",
  padding: "12px",
  borderRadius: "4px",
  overflowX: "auto",
};
