let serverip = "https://api.ingamecoin.xyz/";
function createCoin() {
  return fetch(serverip + "createtoken", {
    headers: { "content-type": "application/json" },
    mode: "cors",
    body: JSON.stringify({
      decimals: 6,
      supply: 100000,
    }),
    method: "POST",
  })
    .then((r) => {
      return r.json();
    })
    .then((cinfo) => {
      //Returns
      //{Decimals,Owner,OwnerTokenAccount,PrivateKey,Secret,Supply,Tx,Mint,Network}
      return cinfo;
    })
    .catch(console.warn);
}
function coinInfo(mintAddress) {
  return (
    fetch(serverip + "coininfo", {
      headers: { "content-type": "application/json" },
      mode: "cors",
      body: JSON.stringify({ mintAddress }),
      method: "POST",
    })
      //Returns
      //{Intialized,MintAuthority,Supply,Decimals,FreezeAuthority}
      .then((r) => {
        return r.json();
      })
      .catch(console.warn)
  );
}

function burnCoin(cinfo, amount = 1) {
  return (
    fetch(serverip + "burntoken", {
      headers: { "content-type": "application/json" },
      mode: "cors",
      body: JSON.stringify({
        hash: cinfo.Secret,
        amount: amount * Math.pow(10, cinfo.Decimals),
      }),
      method: "POST",
    })
      //Returns
      //{Tx,OldBalance,NewBalance,Burn}
      .then((r) => {
        return r.json();
      })
      .catch(console.warn)
  );
}

function mintCoin(
  cinfo,
  address = "CZbmLXFpJGzNabQQdsHQ3KWMkA44BFGrdVvvSxWA5RwQ"
) {
  return (
    fetch(serverip + "minttoken", {
      headers: { "content-type": "application/json" },
      mode: "cors",
      body: JSON.stringify({
        hash: cinfo.Secret,
        solAddress: address,
        mint: cinfo.Mint,
        amount: 1 * Math.pow(10, cinfo.Decimals),
      }),
      method: "POST",
    })
      //Returns
      //{Tx,OldBalance,NewBalance,TokenAddress}
      .then((r) => {
        return r.json();
      })
      .catch(console.warn)
  );
}
function userBalance(tokenAddress) {
  return (
    fetch(serverip + "userbalance", {
      headers: { "content-type": "application/json" },
      mode: "cors",
      body: JSON.stringify({ tokenAddress }),
      method: "POST",
    })
      //Returns
      //{Address,Balance}
      .then((r) => {
        return r.json();
      })
      .catch(console.warn)
  );
}

function checkTransfer(tx) {
  return (
    fetch(serverip + "checktransfer", {
      headers: { "content-type": "application/json" },
      mode: "cors",
      body: JSON.stringify({ tx }),
      method: "POST",
    })
      //Returns
      //{BlockTime,Program,ProgramID,Type,Amount,Destination,Slot,Source}
      .then((r) => {
        return r.json();
      })
      .catch(console.warn)
  );
}

function xcheckTransfer(tx) {
  fetch("https://testnet.solana.com/", {
    headers: {
      accept: "*/*",
      "accept-language": "en-US,en;q=0.9",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      method: "getConfirmedTransaction",
      jsonrpc: "2.0",
      params: [tx, "jsonParsed"],
      id: 1,
    }),
    method: "POST",
    mode: "cors",
  })
    .then((r) => {
      return r.json();
    })
    .then((json) => {
      console.log(json);
      if (json && json.result) {
        let transaction = json.result.transaction;
        let instruction = transaction.message.instructions[0];
        let relevantInfo = {
          BlockTime: json.result.blockTime,
          Program: instruction.program,
          ProgramID: instruction.programId,
          Type: instruction.parsed.type,
          Amount: instruction.parsed.info.amount,
          Destination: instruction.parsed.info.destination,
          Slot: json.result.slot,
          Source: instruction.parsed.info.source,
        };
        console.log(relevantInfo);
      }
    })
    .then(console.log)
    .catch(console.warn);
}

export default { createCoin, mintCoin, coinInfo, userBalance, burnCoin };
