const ethers = require("ethers");
require("dotenv").config();
const API_URL = process.env.API_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const optimaContractAddress = process.env.FIELD_CONTRACT_ADDRESS;

const provider = new ethers.providers.JsonRpcProvider(API_URL);
const signer = new ethers.Wallet(PRIVATE_KEY, provider);
const {
 abi: optimaAbi,
} = require("./artifacts/contracts/FieldContract.sol/OptimaContract.json");

const optimaFieldContractInstance  = new ethers.Contract(
 optimaContractAddress,
 optimaAbi,
 signer
);
module.exports = { optimaFieldContractInstance };
