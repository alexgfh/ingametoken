import React, { useState } from "react";
import logo from "./logo.svg";
import "./NavBar.css";
import "./App.css";
import "./Create.css";
import tokenClient from "./browserclient.js";
import NavBar from "./NavBar";

/**
 * Function to produce UUID.
 * See: http://stackoverflow.com/a/8809472
 */
function generateUUID() {
  var d = new Date().getTime();

  if (window.performance && typeof window.performance.now === "function") {
    d += performance.now();
  }

  var uuid = "xxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
  });

  return uuid;
}

function Create() {
  let [key, setKey] = useState("");
  function generateToken() {
    let key = generateUUID();
    key = "mysecrethash";
    setKey(key);
    tokenClient
      .createCoin()
      .then((data) => localStorage.setItem("coin", JSON.stringify(data)));
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
            <p>
              Here's your secret key. Save it as this will never be displayed
              again. (it's been copied to your clipboard)
            </p>

            <div>{key}</div>
            <p>Use it to call the API from your game code.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Create;
