import React from "react";
import App from "./App";
import Create from "./Create";
import Concept from "./Concept";
import Burn from "./Burn";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

function Routing() {
  return (
    <Router>
      <Route exact path="/" component={Create} />
      <Route exact path="/burn" component={Burn} />
      <Route exact path="/concept" component={Concept} />
    </Router>
  );
}

export default Routing;
