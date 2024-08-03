import React from "react";
import ReactDOM from "react-dom/client";
import LivePlayground from "./src/LivePlayground";

declare global {
  interface NodeModule {
    hot?: {
      accept: () => void;
    };
  }
}

if (module.hot) {
  module.hot.accept();
}

const root = ReactDOM.createRoot(document.getElementById("root")!);

root.render(React.createElement(React.StrictMode, null, React.createElement(LivePlayground, null)));
