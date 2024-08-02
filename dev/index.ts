import React from "react";
import ReactDOM from "react-dom/client";
import LivePlayground from "./LivePlayground";
/*
/*
 * Temporary solution for webpack not reloading on file changes
 * This code is using a TypeScript declaration merging technique to add the 'hot' property to the NodeModule interface.
 */
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
/* 
Do not remove strict mode, 
so we can check where component tree throws warnings when we updates core packages
*/
root.render(React.createElement(React.StrictMode, null, React.createElement(LivePlayground, null)));
