import React, { useState } from "react";
import logo from "./logo.svg";
import "./NavBar.css";
import "./Burn.css";
import "./Create.css";
import tokenClient from "./browserclient.js";
import NavBar from "./NavBar";

function Create() {
  const storage = localStorage.getItem("coin");
  const coin = storage ? JSON.parse(storage) : null;
  const secret = coin ? coin.Secret : "";
  const decimals = coin ? coin.Decimals : 6;
  let [key, setKey] = useState(secret ?? "");
  let [trigger, setTrigger] = useState(false); // crazy hack to redraw NavBar supply
  let [amount, setAmount] = useState(0);
  let [loading, setLoading] = useState(false);

  function burnToken() {
    setLoading(true);
    let cinfo = { Secret: key, Decimals: decimals };
    tokenClient
      .burnCoin(cinfo, amount)
      .then((data) => {
        setLoading(false);
        setTrigger(!trigger);
        alert("burned " + amount);
      })
      .catch(() => alert("failed to burn"));
  }

  return (
    <div className="Header">
      <NavBar />
      {/*<img src={logo} className="App-logo" alt="logo" />*/}
      <div className="Input">
        <input
          type="text"
          placeholder="secret API key"
          value={key}
          onChange={(event) => setKey(event.target.value)}
        />
        <input
          type="number"
          placeholder="amount"
          value={amount}
          onChange={(event) => setAmount(parseFloat(event.target.value))}
        />
      </div>
      {loading ? (
        <i>Burning...</i>
      ) : (
        <button className="Button" onClick={burnToken}>
          Burn
        </button>
      )}
    </div>
  );
}

export default Create;
