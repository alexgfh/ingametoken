import React, { useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import "./browserclient.js";
import NavBar from "./NavBar";

function App(props: { children: React.ReactNode }) {
  return (
    <div className="App">
      <header className="App-header">
        <NavBar />
      </header>
    </div>
  );
}

export default App;
