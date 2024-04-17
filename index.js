require("dotenv").config();
const { default: axios } = require("axios");
const { ethers } = require("ethers");

const ROUTER_ADDRESS = process.env.ROUTER_ADDRESS;
const WALLET = process.env.WALLET;
const TOKEN0 = process.env.TOKEN0_ADDRESS;
const TOKEN1 = process.env.TOKEN1_ADDRESS;
const PRICE_TO_BUY = parseFloat(process.env.PRICE_TO_BUY);
const AMOUNT_TO_BUY = ethers.parseUnits(process.env.AMOUNT_TO_BUY, "ether");
const PRICE_TO_SELL = PRICE_TO_BUY * parseFloat(process.env.PROFITABILITY);

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
