import React, { useState } from "react";
import "./Concept.css";
import "./browserclient.js";
import NavBar from "./NavBar";

function Burn() {
  const storage = localStorage.getItem("coin");
  const coin = storage
    ? storage != "undefined"
      ? JSON.parse(storage)
      : null
    : null;
  const secret = coin?.Secret;
  const mintAddress = coin?.Mint;
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
          To feel the state of your economy, much like the head of a central
          bank would manage their country's money supply.
        </p>
        <p>
          More strict strategies can be employed such as limiting the spawning
          of creatures in-game, i.e.: if a creature yields 10 tokens. Only spawn
          it for every 10 tokens burned in-server.
        </p>
      </div>
      <div className="Instructions">
        <p>
          Implement transfers from your game by making a POST call to the
          following URL, at some point such as a trading menu or in a merchant
          NPC dialogue, after{" "}
          <b>
            deleting <code>{"<AMOUNT>"}</code>
          </b>{" "}
          from the player:
        </p>
        {!coin && (
          <p>
            Create a new token so the fields here are automatically generated
            for you
          </p>
        )}
        <div>
          <code>https://api.ingamecoin.xyz/minttoken</code>
        </div>
        <span>With the following parameters:</span>
        <div>
          <code>hash={secret ?? "<SECRET>"}</code>
        </div>
        <div>
          <code>mint={mintAddress ?? "<MINT ADDRESS>"}</code>
        </div>
        <div>
          <code>
            solAddress=<strong>{"<WITHDRAWAL ADDRESS>"}</strong>
          </code>
        </div>
        <div>
          <code>
            amount=<strong>{"<AMOUNT>"}</strong>
          </code>
        </div>
      </div>
    </div>
  );
}

export default Burn;
