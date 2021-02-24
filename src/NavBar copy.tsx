import React from "react";
import "./NavBar.css";
import { useHistory } from "react-router-dom";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

function NavBar() {
  let history = useHistory();
  return (
    <div className="NavBar>">
      <ul>
        <a className="NavBarElement" onClick={() => history.push("concept")}>
          Concept
        </a>
        <a className="NavBarElement" onClick={() => history.push("burn")}>
          Burn
        </a>
        <a className="NavBarElement" onClick={() => history.push("")}>
          Create new
        </a>
      </ul>
    </div>
  );
}

export default NavBar;
