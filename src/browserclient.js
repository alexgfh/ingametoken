let serverip = "https://ingamecoin.xyz/";
function createCoin(secrethash) {
  return fetch(serverip + "createtoken", {
    headers: { "content-type": "application/json" },
    mode: "cors",
    body: JSON.stringify({
      hash: secrethash,
      decimals: 6,
    }),
    method: "POST",
  })
    .then((r) => {
      return r.json();
    })
    .then((cinfo) => {
      console.log(cinfo);
      return cinfo;
    })
    .catch(console.warn);
}
function coinInfo(mintAddress) {
  return fetch(serverip + "coininfo", {
    headers: { "content-type": "application/json" },
    mode: "cors",
    body: JSON.stringify({ mintAddress }),
    method: "POST",
  })
    .then((r) => {
      return r.json();
    })
    .catch(console.warn);
}

function mintCoin(cinfo, secrethash) {
  return fetch(serverip + "minttoken", {
    headers: { "content-type": "application/json" },
    mode: "cors",
    body: JSON.stringify({
      hash: secrethash,
      solAddress: cinfo.Owner,
      mint: cinfo.Mint,
      amount: 1 * Math.pow(10, cinfo.Decimals),
    }),
    method: "POST",
  })
    .then((r) => {
      return r.json();
    })
    .catch(console.warn);
}
function userBalance(tokenAddress) {
  return fetch(serverip + "userbalance", {
    headers: { "content-type": "application/json" },
    mode: "cors",
    body: JSON.stringify({ tokenAddress }),
    method: "POST",
  })
    .then((r) => {
      return r.json();
    })
    .catch(console.warn);
}

export default { createCoin, mintCoin, coinInfo, userBalance };
