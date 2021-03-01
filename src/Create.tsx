import React, { useState } from "react";
import logo from "./logo.svg";
import "./NavBar.css";
import "./App.css";
import "./Create.css";
import tokenClient from "./browserclient.js";
import NavBar from "./NavBar";

function Create() {
  let [key, setKey] = useState("");
  let [mint, setMint] = useState("");
  function generateToken() {
    tokenClient.createCoin().then((data) => {
      localStorage.setItem("coin", JSON.stringify(data));
      setKey(data.Secret);
      setMint(data.Mint);
    });
  }

  return (
    <div className="Header">
      <NavBar />
      {/*<img src={logo} className="App-logo" alt="logo" />*/}
      <div className="Create">
        {key === "" ? (
          <button className="Button" onClick={generateToken}>
            Create token
          </button>
        ) : (
          <div className="CreatedText">
            <p>Here's your secret key:</p>

            <div className="Parameter">{key}</div>
            <p>And this is your Mint address (public):</p>

            <div className="Parameter">{mint}</div>
            <p>
              Use these to call the API from your game code, as explained in the{" "}
              <a href="/concept">Tutorial</a>.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Create;
