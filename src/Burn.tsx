import React, { useState } from "react";
import logo from "./logo.svg";
import "./NavBar.css";
import "./Burn.css";
import "./Create.css";
import "./browserclient.js";
import NavBar from "./NavBar";

function Create() {
  let [key, setKey] = useState("");
  let [amount, setAmount] = useState(0);

  function burnToken() {
    alert("burned " + amount + " from " + key);
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
