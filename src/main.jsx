import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFalback from "./ui/ErrorFallback.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>
  //   <App />
  // </React.StrictMode>
  <ErrorBoundary
    FallbackComponent={ErrorFalback}
    onReset={() => window.location.replace("/")}
  >
    <App />
  </ErrorBoundary>
);
