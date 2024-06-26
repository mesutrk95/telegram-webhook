import React from "react";
import ReactDOM from "react-dom/client";
import "./index.scss";
import reportWebVitals from "./reportWebVitals";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import Index from "./routes";
import SignIn from "./routes/signin";
import Setup from "./routes/setup";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
  <BrowserRouter basename={process.env.REACT_APP_BASE_URL}>
    <Routes>
      <Route path="/signin" element={<SignIn />} />
      <Route path="/setup" element={<Setup />} />
      <Route exact path="/" element={<Index />} />
    </Routes>
  </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
