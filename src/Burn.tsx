import React, { useEffect, useState } from "react";
import "./NavBar.css";
import "./Burn.css";
import "./Create.css";
import burningIcon from "./fire.png";
import tokenClient from "./browserclient.js";
import NavBar from "./NavBar";

function Create() {
  const storage = localStorage.getItem("coin");
  const coin = storage ? JSON.parse(storage) : null;
  const secret = coin ? coin.Secret : "";
  const decimals = coin ? coin.Decimals : 6;
  let [key, setKey] = useState(secret ?? "");
  let [amount, setAmount] = useState(0);
  let [loading, setLoading] = useState(false);
  let [displaying, setDisplaying] = useState(false);

  function burnToken() {
    setLoading(true);
    let cinfo = { Secret: key, Decimals: decimals };
    tokenClient
      .burnCoin(cinfo, amount)
      .then((data) => {
        setDisplaying(true);
        setTimeout(() => {
          setLoading(false);
          setDisplaying(false);
        }, 1000);
      })
      .catch(() => alert("failed to burn"));
  }

  return (
    <div className="Header">
      <NavBar />
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
        <>
          <img src={burningIcon} className="Animated-logo" alt="logo" />
          {displaying && (
            <b style={{ color: "red", marginLeft: "0.5em" }}>Burned {amount}</b>
          )}
        </>
      ) : (
        <button className="Button" onClick={burnToken}>
          Burn
        </button>
      )}
    </div>
  );
}

export default Create;
