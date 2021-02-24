import React, { useState } from "react";
import "./Concept.css";
import "./browserclient.js";
import NavBar from "./NavBar";

function Burn() {
  return (
    <div className="Header">
      <NavBar />
      {/*<img src={logo} className="App-logo" alt="logo" />*/}
      <div className="Concept">
        <p>
          Players can emit tokens from outside your game, into the Solana
          blockchain.
        </p>
        <p>
          You burn 1 token internally for every 1 token emitted, so as to keep
          the economy sound.
        </p>
        <p>
          Burn tokens as you spawn creatures or any other form of loot
          generation in your game.
        </p>
        <p>
          A good strategy is to periodically query your total supply and the
          game server total supply on the database.
        </p>
        <p>
          To feel the state of your economics, much like the head of a central
          bank would manage their country's money supply.
        </p>
        <p>
          More strict strategies can be employed such as limiting the spawning
          of creatures in-game, i.e.: if a creature yields 10 tokens. Only spawn
          it for every 10 tokens burned in-server.
        </p>
      </div>
    </div>
  );
}

export default Burn;
