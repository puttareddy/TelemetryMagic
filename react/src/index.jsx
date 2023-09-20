import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Home from "./Home";
import Content from "./Content";

import "bootstrap/dist/css/bootstrap.min.css";

import tracer from "./web-tracer.js";
tracer("react-client-side");

ReactDOM.render(
  <Router>
    <main>
      <Route exact path="/" component={Home} />
      <Route exact path="/test" component={Content} />
    </main>
  </Router>,
  document.getElementById("root")
);
