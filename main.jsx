import React from "react";
import { createRoot } from "react-dom/client";
import RouteIQPrototype from "./RouteIQPrototype.jsx";
import "./styles.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouteIQPrototype />
  </React.StrictMode>
);