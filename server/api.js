////Solan Web3
const solanaWeb3 = require("@solana/web3.js");
const Account = solanaWeb3.Account;
const Connection = solanaWeb3.Connection;
const PublicKey = solanaWeb3.PublicKey;
const sendAndConfirmTransaction = solanaWeb3.sendAndConfirmTransaction;
const SystemProgram = solanaWeb3.SystemProgram;
const Transaction = solanaWeb3.Transaction;
const TransactionInstruction = solanaWeb3.TransactionInstruction;
const bs58 = require("bs58");
///////////////////TOKEN/////////////
const splToken = require("@solana/spl-token");
const Token = splToken.Token;
const tokenProgram = new PublicKey(
    "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
);
const SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID = new PublicKey(
    "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
);
const SYSVAR_RENT_PUBKEY = new PublicKey(
    "SysvarRent111111111111111111111111111111111"
);
const { Numberu64 } = require("@solana/spl-token-swap");
//middleware
const corsMiddleware = require("restify-cors-middleware");
const cors = corsMiddleware({
    preflightMaxAge: 5, //Optional
    origins: ["*"],
});

var Settings;
var fs = require("fs");
try {
    if (fs.existsSync("./settings.json")) {
        Settings = require("./settings.json");
    }
} catch (e) {
    console.log(e);
}
const server_port = 80;
var restify = require("restify");
var http = require("http");
var https = require("https");
var connection;

//http server
var server = restify.createServer();
server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());
server.pre(cors.preflight);
server.use(cors.actual);
//create https server
var https_options = {};
var https_server;
try {
    https_options = {
        key: fs.readFileSync(
            "/etc/letsencrypt/live/api.ingametoken.xyz/privkey.pem",
            "utf8"
        ),
        certificate: fs.readFileSync(
            "/etc/letsencrypt/live/api.ingametoken.xyz/cert.pem",
            "utf8"
        ),
    };
    https_server = restify.createServer(https_options);
    https_server.use(restify.plugins.acceptParser(server.acceptable));
    https_server.use(restify.plugins.queryParser());
    https_server.use(restify.plugins.bodyParser());
    https_server.pre(cors.preflight);
    https_server.use(cors.actual);
} catch (e) {
    console.log(e);
}

let apiFunctions = {
    "/burntoken": BurnToken,
    "/checktransfer": CheckTransfer,
    "/coininfo": CoinInfo,
    "/createtoken": CreateToken,
    "/minttoken": MintToken,
    "/userbalance": UserBalance,
};

//https endpoints
function serve() {
    if (https_server) {
        Object.keys(apiFunctions).map((key, i) => {
            https_server.post(key, apiFunctions[key]);
        });
        const port = 4403;
        https_server.listen(port, "0.0.0.0", () => {
            console.log(
                `server ${https_server.name} listening at ${https_server.url}`
            );
        });
    } else {
        Object.keys(apiFunctions).map((key, i) => {
            server.post(key, apiFunctions[key]);
        });
        let { execSync } = require("child_process");
        let ip = execSync("hostname -I").toString();
        let hostname = execSync("hostname -f").toString();
        ip = ip.split(" ")[0];
        let port = ip.search("192.168") > -1 ? 8080 : server_port;
        try {
            server.listen(port, () => {
                console.log(ip, " server %s listening at %s", hostname, server.url);
            });
        } catch (e) {
            console.log(e);
            return false;
        }
    }
    return true;
}

//Connection ///
let network = "https://solana-api.projectserum.com/";
async function establishConnection() {
    //let urlRoot = "https://api.mainnet-beta.solana.com/"
    let urlRoot = network;
    let connection = new Connection(urlRoot, "singleGossip");
    const version = await connection.getVersion();
    console.log("Connection to cluster established:", urlRoot, version);
    return connection;
}

function BurnToken(req, res, next) {
    try {
        if (Number(req.httpVersion) < 1.1 && https_server) {
            res.redirect("https://api.ingametoken.xyz/burntoken", next);
        }
    } catch (e) {
        console.log(e);
    }
    try {
        req.params = req.body;
    } catch (e) {
        console.log(e);
    }
    if (!req.params.amount || !req.params.hash) {
        res.send(400, "Bad parameters");
        return next();
    }
    return burnToken(req.params)
        .then(function (succ) {
            console.log("burntoken:", succ);
            res.send(200, succ);
            return next();
        })
        .catch(function (e) {
            console.log("burntoken failed:", e);
            res.send(500, e);
            return next();
        });
}

function CheckTransfer(req, res, next) {
    try {
        if (Number(req.httpVersion) < 1.1 && https_server) {
            res.redirect("https://api.ingametoken.xyz/checktransfer", next);
        }
    } catch (e) {
        console.log(e);
    }
    try {
        req.params = req.body;
    } catch (e) {
        console.log(e);
    }
    if (!req.params.tx) {
        res.send(400, "Bad parameters");
        return next();
    }
    return checkTransfer(req.params)
        .then(function (succ) {
            console.log("checktransfer:", succ);
            res.send(200, succ);
            return next();
        })
        .catch(function (e) {
            console.log("checktransfer failed:", e);
            res.send(500, e);
            return next();
        });
}

function CoinInfo(req, res, next) {
    try {
        if (Number(req.httpVersion) < 1.1 && https_server) {
            res.redirect("https://api.ingametoken.xyz/coininfo", next);
        }
    } catch (e) {
        console.log(e);
    }
    try {
        req.params = req.body;
    } catch (e) {
        console.log(e);
    }
    if (!req.params.mintAddress) {
        res.send(400, "Bad parameters");
        return next();
    }
    return coinInfo(req.params)
        .then(function (succ) {
            console.log("coininfo:", succ);
            res.send(200, succ);
            return next();
        })
        .catch(function (e) {
            console.log("coininfo failed:", e);
            res.send(500, e);
            return next();
        });
}

function CreateToken(req, res, next) {
    console.log(req.httpVersion);
    try {
        if (Number(req.httpVersion) < 1.1 && https_server) {
            res.redirect("https://api.ingametoken.xyz/createtoken", next);
        }
    } catch (e) {
        console.log(e);
    }
    try {
        req.params = req.body;
    } catch (e) {
        console.log(e);
    }
    if (!req.params.password || req.params.password != "Disallowed at the moment due to high SOL creation fee") {
        res.send(402,
            "Disabled for now due to high SOL creation fees, contact the project @ https://discord.gg/eCH82F2uX6");
        return next();
    }
    if (!req.params.decimals || !req.params.supply) {
        res.send(400, "Bad parameters");
        return next();
    }
    return createToken(req.params)
        .then(function (succ) {
            console.log("createtoken:", succ);
            res.send(200, succ);
            return next();
        })
        .catch(function (e) {
            console.log("createtoken failed:", e);
            res.send(500, e);
            return next();
        });
}

function MintToken(req, res, next) {
    try {
        if (Number(req.httpVersion) < 1.1 && https_server) {
            res.redirect("https://api.ingametoken.xyz/minttoken", next);
        }
    } catch (e) {
        console.log(e);
    }
    try {
        req.params = req.body;
    } catch (e) {
        console.log(e);
    }
    if (
        !req.params.mint ||
        (!req.params.to && !req.params.solAddress) ||
        !req.params.amount ||
        !req.params.hash
    ) {
        res.send(400, "Bad parameters");
        return next();
    }
    return mintToken(req.params)
        .then(function (succ) {
            console.log("minttoken:", succ);
            res.send(200, succ);
            return next();
        })
        .catch(function (e) {
            console.log("minttoken failed:", e);
            res.send(500, e);
            return next();
        });
}

function UserBalance(req, res, next) {
    try {
        if (Number(req.httpVersion) < 1.1 && https_server) {
            res.redirect("https://api.ingametoken.xyz/userbalance", next);
        }
    } catch (e) {
        console.log(e);
    }
    try {
        req.params = req.body;
    } catch (e) {
        console.log(e);
    }
    if (!req.params.tokenAddress) {
        res.send(400, "Bad parameters");
        return next();
    }
    return userBalance(req.params)
        .then(function (succ) {
            console.log("userbalance:", succ);
            res.send(200, succ);
            return next();
        })
        .catch(function (e) {
            console.log("userbalance failed:", e);
            res.send(500, e);
            return next();
        });
}
////////////
async function burnToken(params) {
    if (!connection) {
        connection = await establishConnection();
    }
    let Settings = JSON.parse(fs.readFileSync("settings.json"));
    let key = Settings.key;
    let feePayer = new Account(key);
    let authority = feePayer.publicKey;
    let amount64 = new Numberu64(params.amount).toBuffer();
    if (!Settings.Accounts || !Settings.Accounts[params.hash]) {
        return { err: "Invalid secret" };
    }
    let tokenInfo = Settings.Accounts[params.hash];
    tokenInfo.Key = JSON.parse(tokenInfo.Key);
    let mintProxy = new PublicKey(tokenInfo.TokenAddress);
    let mint = new PublicKey(tokenInfo.Mint);
    let mintProxyOwner = new Account(new Uint8Array(tokenInfo.Key));
    let accountInfo = await connection.getAccountInfo(mintProxy);
    let OldBalance = await getTokenBalance(connection, mintProxy);
    let burnIx = new TransactionInstruction({
        keys: [
            { pubkey: mintProxy, isSigner: false, isWritable: true },
            { pubkey: mint, isSigner: false, isWritable: true },
            { pubkey: mintProxyOwner.publicKey, isSigner: true, isWritable: false },
        ],
        programId: tokenProgram,
        data: Buffer.concat([Buffer.from([8]), amount64]),
    });
    let transaction = new Transaction();
    transaction.add(burnIx);
    try {
        let Tx = await sendAndConfirmTransaction(
            connection,
            transaction,
            [feePayer, mintProxyOwner],
            {
                commitment: "singleGossip",
                preflightCommitment: "singleGossip",
            }
        );
        let NewBalance = await getTokenBalance(connection, mintProxy);
        return {
            Burn: true,
            Tx,
            TokenAddress: mintProxy.toBase58(),
            OldBalance,
            NewBalance,
        };
    } catch (e) {
        console.log(e);
        return { err: e.message };
    }
}

async function checkTransfer(params) {
    if (!connection) {
        connection = await establishConnection();
    }
    let json = await getTransaction(params.tx);
    let resp = {};
    if (!json && json.result) {
        return { err: true };
    }
    try {
        console.log(json);
        let transaction = json.result.transaction;
        let instruction = transaction.message.instructions[0];
        resp = {
            BlockTime: json.result.blockTime,
            BlockTimeToDate: new Date(json.result.blockTime * 1000),
            Program: instruction.program,
            ProgramID: instruction.programId,
            Type: instruction.parsed.type,
            Amount: instruction.parsed.info.amount,
            Destination: instruction.parsed.info.destination,
            Slot: json.result.slot,
            Source: instruction.parsed.info.source,
        };
    } catch (e) {
        console.log(e);
    }
    return resp;
}

async function coinInfo(params) {
    if (!connection) {
        connection = await establishConnection();
    }
    let pk = new PublicKey(params.mintAddress);
    let data = {};
    let info = await connection.getAccountInfo(pk);
    if (info && info.data) {
        try {
            info = info.data;
            data.Intialized = info.slice(0, 4)[0]; //initialized
            data.MintAuthority = bs58.encode(info.slice(4, 36)); //mint authority
            data.Supply = get64Value(info.slice(36, 44).reverse()); //supply
            data.Decimals = info.slice(44, 45)[0]; //decimals
            data.FreezeAuthority = bs58.encode(info.slice(50, 82)); //freeze authority
            data.FixedSupply = true;
        } catch (e) {
            console.log(e);
        }
    } else {
        data.err = true;
    }
    return data;
}

function createIx(
    funderPubkey,
    associatedTokenAccountPublicKey,
    ownerPublicKey,
    tokenMintPublicKey
) {
    return new TransactionInstruction({
        programId: SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID,
        data: Buffer.from([]),
        keys: [
            { pubkey: funderPubkey, isSigner: true, isWritable: true },
            {
                pubkey: associatedTokenAccountPublicKey,
                isSigner: false,
                isWritable: true,
            },
            { pubkey: ownerPublicKey, isSigner: false, isWritable: false },
            { pubkey: tokenMintPublicKey, isSigner: false, isWritable: false },
            { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
            { pubkey: tokenProgram, isSigner: false, isWritable: false },
            { pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false },
        ],
    });
}

/// id: // hashSecret
/// {
/// Owner: SOL PublicKey
/// Key: SOL PrivateKey
/// TokenAddress: Owner's token account for `Mint` //can be derived from Owner + Mint, redundant data
/// Mint: Universal Mint address of the token (called `Token Address` on Sollet (yes, poor naming))
/// }

async function createToken(params) {
    if (!connection) {
        connection = await establishConnection();
    }
    let decimals = params.decimals;
    let Settings = JSON.parse(fs.readFileSync("settings.json"));
    let key = Settings.key;
    let feePayer = new Account(key);
    let mintAccount = new Account();
    let owner = new Account();
    let sk = "[" + new Array(owner._keypair.secretKey).toString() + "]";
    let to = await findAssociatedTokenAccountPublicKey(
        owner.publicKey,
        mintAccount.publicKey
    );
    let id = randomId();
    if (!Settings.Accounts) {
        Settings.Accounts = {};
    }
    Settings.Accounts[id] = {
        Owner: owner.publicKey.toBase58(),
        Key: sk,
        TokenAddress: to.toBase58(),
        Mint: mintAccount.publicKey.toBase58(),
    };
    saveSettings(Settings);
    let lamports = await connection.getMinimumBalanceForRentExemption(
        82,
        "singleGossip"
    );
    let createMint = SystemProgram.createAccount({
        fromPubkey: feePayer.publicKey,
        newAccountPubkey: mintAccount.publicKey,
        lamports,
        space: 82,
        programId: tokenProgram,
    });
    let initMintIx = Token.createInitMintInstruction(
        tokenProgram,
        mintAccount.publicKey,
        decimals,
        owner.publicKey,
        owner.publicKey
    );
    let fundtx = SystemProgram.transfer({
        fromPubkey: feePayer.publicKey,
        toPubkey: owner.publicKey,
        lamports: 9000000,
    });
    let fixSupply = Token.createSetAuthorityInstruction(
        tokenProgram,
        mintAccount.publicKey,
        null,
        "MintTokens",
        owner.publicKey,
        []
    );
    //Create fixed supply for the owner
    let amount64 = new Numberu64(
        params.supply * Math.pow(10, params.decimals)
    ).toBuffer();
    cIx = createIx(
        feePayer.publicKey,
        to,
        owner.publicKey,
        mintAccount.publicKey
    );
    let minttoix = new TransactionInstruction({
        keys: [
            { pubkey: mintAccount.publicKey, isSigner: false, isWritable: true },
            { pubkey: to, isSigner: false, isWritable: true },
            { pubkey: owner.publicKey, isSigner: true, isWritable: false },
        ],
        programId: tokenProgram,
        data: Buffer.concat([Buffer.from([7]), amount64]),
    });
    //
    let createMintTx = new Transaction()
        .add(createMint)
        .add(initMintIx)
        .add(cIx)
        .add(minttoix)
        .add(fundtx)
        .add(fixSupply);
    let accounts = [feePayer, mintAccount, owner];
    try {
        console.log("minting tokens");
        let Tx = await sendAndConfirmTransaction(
            connection,
            createMintTx,
            accounts,
            {
                commitment: "singleGossip",
                preflightCommitment: "singleGossip",
            }
        );
        return {
            Decimals: decimals,
            Owner: owner.publicKey.toBase58(),
            OwnerTokenAccount: to.toBase58(),
            PrivateKey: owner.secretKey,
            Secret: id,
            Supply: params.supply * params.decimals,
            Tx,
            Mint: mintAccount.publicKey.toBase58(),
            Network: network,
        };
    } catch (e) {
        console.log(e);
        return { err: e.message };
    }
}

const findAssociatedTokenAccountPublicKey = async (
    ownerPublicKey,
    tokenMintPublicKey
) =>
    (
        await PublicKey.findProgramAddress(
            [
                ownerPublicKey.toBuffer(),
                tokenProgram.toBuffer(),
                tokenMintPublicKey.toBuffer(),
            ],
            SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID
        )
    )[0];

async function getTokenBalance(connection, publicKey) {
    let info = await connection.getAccountInfo(publicKey);
    let balance = 0;
    if (info) {
        balance = get64Value(info.data.slice(64, 72).reverse());
    }
    return balance;
}

function get64Value(array) {
    let hex = "0x" + array.toString("hex");
    let big = BigInt(hex);
    big = big.toString();
    big = Number(big);
    return big;
}

function getJsonFileAsObj(filePath) {
    const obj = JSON.parse(fs.readFileSync(filePath));
    return obj;
}

function getExternalTokenIfExists(hash) {
    const externalTokensFileName = "external_tokens.json";
    const externalTokens = getJsonFileAsObj(externalTokensFileName);
    if (externalTokens.hasOwnProperty(hash)) {
        return externalTokens[hash];
    }
    return null;
}

async function mintToken(params) {
    if (!connection) {
        connection = await establishConnection();
    }
    let Settings = JSON.parse(fs.readFileSync("settings.json"));
    let key = Settings.key;
    let feePayer = new Account(key);
    let authority = feePayer.publicKey;
    let amount64 = new Numberu64(params.amount).toBuffer();
    let tokenInfo;

    const externalTokenInfo = getExternalTokenIfExists(params.hash);
    if (externalTokenInfo) {
        tokenInfo = externalTokenInfo;
    }
    else if (!Settings.Accounts || !Settings.Accounts[params.hash]) {
        return { err: "Invalid secret" };
    }
    else {
        tokenInfo = Settings.Accounts[params.hash];
    }
    if (
        params.to === tokenInfo.TokenAddress ||
        tokenInfo.TokenAddress === params.solAddress
    ) {
        return { err: "Invalid transfer" };
    }
    let mintProxy = new PublicKey(tokenInfo.TokenAddress);
    tokenInfo.Key = JSON.parse(tokenInfo.Key);
    let mintProxyOwner = new Account(new Uint8Array(tokenInfo.Key));
    let to;
    if (params.to) {
        to = new PublicKey(params.to);
    } else {
        to = await findAssociatedTokenAccountPublicKey(
            new PublicKey(params.solAddress),
            new PublicKey(tokenInfo.Mint)
        );
    }
    let OldBalance = 0;
    let accountInfo = await connection.getAccountInfo(to);
    let cIx = null;
    if (!accountInfo) {
        //create account
        cIx = createIx(
            feePayer.publicKey,
            to,
            new PublicKey(params.solAddress),
            tokenInfo.Mint
        );
    } else {
        OldBalance = await getTokenBalance(connection, to);
    }
    let minttoix = new TransactionInstruction({
        keys: [
            { pubkey: mintProxy, isSigner: false, isWritable: true },
            { pubkey: to, isSigner: false, isWritable: true },
            { pubkey: mintProxyOwner.publicKey, isSigner: true, isWritable: false },
        ],
        programId: tokenProgram,
        data: Buffer.concat([Buffer.from([3]), amount64]),
    });
    let transaction = new Transaction();
    if (cIx) {
        transaction.add(cIx);
    }
    transaction.add(minttoix);
    try {
        let Tx = await sendAndConfirmTransaction(
            connection,
            transaction,
            [feePayer, mintProxyOwner],
            {
                commitment: "singleGossip",
                preflightCommitment: "singleGossip",
            }
        );
        let NewBalance = await getTokenBalance(connection, to);
        return {
            Tx,
            TokenAddress: to.toBase58(),
            OldBalance,
            NewBalance,
        };
    } catch (e) {
        console.log(e);
        return { err: e.message };
    }
}

async function userBalance(params) {
    if (!connection) {
        connection = await establishConnection();
    }
    let pk = new PublicKey(params.tokenAddress);
    let accountInfo = await connection.getAccountInfo(pk);
    let Balance = 0;
    if (accountInfo) {
        Balance = await getTokenBalance(connection, pk);
    }
    return { TokenAddress: params.tokenAddress, Balance };
}

function randomId() {
    let s = "";
    let t = "";
    let alphL = "abcdefghijklmnopqrstuvwxyz";
    let alphU = alphL.toUpperCase();
    for (let i = 0; i < 6; i++) {
        s += Math.floor(Math.random(0) * 1000000).toString();
    }
    for (let i = 0; i < s.length; i++) {
        if (i % 3 === 0) {
            t += alphU[Number(s[i]) + 5];
        } else if (i % 5 === 0) {
            t += alphL[Number(s[i]) + 5];
        } else {
            t += s[i];
        }
    }
    return t;
}

function saveSettings(obj) {
    let s = JSON.stringify(obj);
    return fs.writeFileSync("settings.json", s);
}

function fetch(url, options) {
    return new Promise((resolve, reject) => {
        let hostname = url.split("/")[2];
        options.hostname = hostname;
        let https = require("https");
        options.headers["Content-Length"] = options.body.length.toString();
        const req = https
            .request(options, (response) => {
                var body = "";
                response.on("data", (d) => {
                    body += d;
                });
                response.on("end", () => {
                    return resolve(body);
                });
            })
            .on("error", (e) => {
                return reject(e);
            });
        req.write(options.body);
        req.end();
    });
}

function getTransaction(tx) {
    return fetch(network, {
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            jsonrpc: "2.0",
            id: 1,
            method: "getConfirmedTransaction",
            params: [tx, "jsonParsed"],
        }),
        method: "POST",
    })
        .then((r) => {
            return JSON.parse(r);
        })
        .catch((e) => {
            console.warn(e);
            return false;
        });
}

serve();
