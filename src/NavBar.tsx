import React from "react";
import "./NavBar.css";
import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import tokenClient from "./browserclient.js";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

function NavBar() {
  let [supply, setSupply] = useState(undefined);
  let [name, setName] = useState("");
  let history = useHistory();
  let storage = localStorage.getItem("coin");
  let coin = storage ? JSON.parse(storage) : null;
  useEffect(() => {
    tokenClient.coinInfo(coin.Mint).then((info) => {
      setSupply(info.Supply);
      setName("My Coin Name");
    });
  });

  return (
    <div>
      {coin ? (
        <div className="CoinInfo">
          <p>Current Supply: {supply ?? "Loading..."}</p>
        </div>
      ) : (
        <></>
      )}
      <ul className="NavBar">
        <a className="NavBarElement" onClick={() => history.push("concept")}>
          Tutorial
        </a>
        <a className="NavBarElement" onClick={() => history.push("burn")}>
          Burn
        </a>
        <a className="NavBarElement" onClick={() => history.push("")}>
          Create New
        </a>
      </ul>
    </div>
  );
}

export default NavBar;