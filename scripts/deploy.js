const hre = require("hardhat");

async function main() {
  try {
    // 部署合约
    const GameOfLife = await hre.ethers.getContractFactory("GameOfLife");
    const gameOfLife = await GameOfLife.deploy();

    await gameOfLife.waitForDeployment();
    
    const address = await gameOfLife.getAddress();
    console.log("GameOfLife deployed to:", address);

    // 等待几个区块确认
    console.log("Waiting for confirmations...");
    await gameOfLife.deploymentTransaction().wait(5);

    // 验证合约
    console.log("Verifying contract...");
    await hre.run("verify:verify", {
      address: address,
      constructorArguments: [],
    });

    console.log("Contract verified successfully");
  } catch (error) {
    console.error("Deployment failed:", error);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}); 