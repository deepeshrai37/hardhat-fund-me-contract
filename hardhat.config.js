require("@nomicfoundation/hardhat-toolbox");
require("hardhat-deploy");
require("dotenv").config();
require("hardhat-gas-reporter");
require("solidity-coverage");

/** @type import('hardhat/config').HardhatUserConfig */
const SEPOLIA_RPC_URL=process.env.SEPOLIA_RPC_URL;
const PRIVATE_KEY=process.env.PRIVATE_KEY;
const ETHERSCAN_API_KEY=process.env.ETHERSCAN_API_KEY;
module.exports = {
  networks:{
    sepolia:{
      url: SEPOLIA_RPC_URL,
      accounts: [PRIVATE_KEY],
      chainId: 11155111,
      blockConfirmations:6
      
    },
  },
  solidity: "0.8.24",
  defaultNetwork: "hardhat",
  etherscan:{
    apiKey: ETHERSCAN_API_KEY,
  },
  gasReporter:{
    enabled:true,
  },
  namedAccounts: {
    deployer: {
        default: 0,
    },
},
};
