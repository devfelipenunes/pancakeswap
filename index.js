require("dotenv").config();
const { default: axios } = require("axios");
const { ethers } = require("ethers");

const ABI_PANCAKESWAP = require("./abi.pancakeswap.json");
const ABI_ERC20 = require("./abi.erc20.json")

const ROUTER_ADDRESS = process.env.ROUTER_ADDRESS;
const WALLET = process.env.WALLET;
const TOKEN0 = process.env.TOKEN0_ADDRESS;
const TOKEN1 = process.env.TOKEN1_ADDRESS;
const PRICE_TO_BUY = parseFloat(process.env.PRICE_TO_BUY);
const AMOUNT_TO_BUY = ethers.parseUnits(process.env.AMOUNT_TO_BUY, "ether");
const PRICE_TO_SELL = PRICE_TO_BUY * parseFloat(process.env.PROFITABILITY);

const provider = new ethers.JsonRpcProvider(process.env.PROVIDER_URL);
const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const router = new ethers.Contract(ROUTER_ADDRESS, ABI_PANCAKESWAP, signer);
const token0 = new ethers.Contract(TOKEN0, ABI_ERC20, signer);
const token1 = new ethers.Contract(TOKEN1, ABI_ERC20, signer);

let isOpened = false,
  isApproved = false,
  amountOut = 0;

async function getPrice(contract) {
  const USDT_MAINNET = "0x55d398326f99059fF775485246999027B3197955";
  const { data } = await axios.get(
    `https://bsc.api.0x.org/swap/v1/price?sellToken=${contract}&buyToken=${USDT_MAINNET}&sellAmount=1000000000000000000`,
    {
      headers: { "0x-api-key": process.env.API_KEY },
    }
  );
  return parseFloat(data.price);
}

async function executeCycle() {
  const CAKE_MAINNET = "0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82";
  const usdPrice = await getPrice(CAKE_MAINNET);
  console.log("USD " + usdPrice);
}

async function start() {
  await executeCycle();

  setInterval(executeCycle, process.env.INTERVAL);
}

start();
