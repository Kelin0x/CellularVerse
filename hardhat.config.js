require("@nomicfoundation/hardhat-verify");
require("@nomicfoundation/hardhat-toolbox"); // 添加这行
require("dotenv").config();

module.exports = {
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    mantleTest: {
      url: "https://rpc.sepolia.mantle.xyz",
      chainId: 5003,
      accounts: [process.env.PRIVATE_KEY]
    }
  },
  sourcify: {
    enabled: true
  }
}; 