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
  let [key, setKey] = useState(secret ?? "");
  let [amount, setAmount] = useState(0);

  function burnToken() {
    let cinfo = { Secret: key };
    tokenClient
      .burnCoin(cinfo, amount)
      .then((data) => alert("burned " + amount));
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
      <button className="Button" onClick={burnToken}>
        Burn
      </button>
    </div>
  );
}

export default Create;
