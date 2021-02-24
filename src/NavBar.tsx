import React from "react";
import "./NavBar.css";
import { useHistory } from "react-router-dom";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

interface Coin {
  Owner: string;
  Mint: string;
}

function NavBar() {
  let history = useHistory();
  let storage = localStorage.getItem("coin");
  return (
    <div>
      {1 ? (
        <div className="Coin Info">
          CoinName:..., Owner: ..., MintAddress:..., Supply:...{" "}
        </div>
      ) : (
        <></>
      )}
      <ul className="NavBar">
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
