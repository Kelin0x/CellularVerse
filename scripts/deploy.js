// scripts/deploy.js
const { ethers } = require("hardhat");

async function main() {
  try {
    // 获取合约工厂
    const GameOfLife = await ethers.getContractFactory("GameOfLife");

    // 部署合约
    console.log("开始部署 GameOfLife 合约...");
    const gameOfLife = await GameOfLife.deploy();
    await gameOfLife.waitForDeployment();

    // 获取合约地址
    const contractAddress = await gameOfLife.getAddress();
    console.log("GameOfLife 合约已部署到:", contractAddress);

    // 等待几个区块确认
    console.log("等待区块确认...");
    await gameOfLife.deploymentTransaction().wait(5);

    console.log("部署完成！");
    console.log("----------------------------------------");
    console.log("合约地址:", contractAddress);
    console.log("在 Mantle 浏览器上查看:");
    console.log(`https://sepolia.mantlescan.xyz/address/${contractAddress}`);

  } catch (error) {
    console.error("部署失败:", error);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });