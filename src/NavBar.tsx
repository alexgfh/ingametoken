import React from "react";
import "./NavBar.css";
import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import tokenClient from "./browserclient.js";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

function NavBar() {
  let [supply, setSupply] = useState<number | undefined>(undefined);
  let history = useHistory();
  let storage = localStorage.getItem("coin");
  let coin = storage
    ? storage != "undefined"
      ? JSON.parse(storage)
      : null
    : null;
  useEffect(() => {
    if (coin) {
      tokenClient.coinInfo(coin.Mint).then((info) => {
        setSupply(info.Supply / Math.pow(10, coin.Decimals));
      });
    }
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
