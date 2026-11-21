const fs = require("fs");
const path = require("path");
const hre = require("hardhat");

async function main() {
  const signers = await hre.ethers.getSigners();
  const deployer = signers[0];

  console.log("Deploying CopperPoint with admin:", deployer.address);
  console.log("Network:", hre.network.name, "Chain ID:", hre.network.config.chainId);

  const CopperPoint = await hre.ethers.getContractFactory("contracts/CopperPoint.sol:CopperPoint");
  const contract = await CopperPoint.deploy();
  await contract.waitForDeployment();

  const contractAddress = await contract.getAddress();
  console.log("CopperPoint successfully deployed at:", contractAddress);

  const customerAddress = "0xaE5d5A37A1D976cE09793e036d12d2b6Caf1F23d";
  const staffAddress = "0x5faEf8786001692D7a8E5fF9328fD9FDD48f4DD1";

  const MINTER_ROLE = await contract.MINTER_ROLE();

  // Grant MINTER_ROLE to Staff
  try {
    console.log("Granting MINTER_ROLE to Staff:", staffAddress);
    const txRole = await contract.grantRole(MINTER_ROLE, staffAddress);
    await txRole.wait();
    console.log("Granted MINTER_ROLE to Staff!");
  } catch (err) {
    console.warn("Could not grant MINTER_ROLE to Staff:", err.message);
  }

  // Seed initial points to Customer & Admin
  const seedAmount = hre.ethers.parseUnits("185000", 18);
  try {
    console.log("Seeding 185,000 CUP to Customer:", customerAddress);
    const txSeedCust = await contract.mintWithScrapDetails(
      customerAddress,
      seedAmount,
      "ทองแดงปอกสวย (เกรด A)",
      500000,
      "REC-SEP-INIT-001 • ยอดแต้มสะสมเริ่มต้น"
    );
    await txSeedCust.wait();
    console.log("Seeded points to Customer!");

    console.log("Seeding 185,000 CUP to Admin:", deployer.address);
    const txSeedAdmin = await contract.mintWithScrapDetails(
      deployer.address,
      seedAmount,
      "ทองแดงปอกสวย (เกรด A)",
      500000,
      "REC-SEP-INIT-002 • ยอดแต้มสำรองแอดมิน"
    );
    await txSeedAdmin.wait();
    console.log("Seeded points to Admin!");
  } catch (err) {
    console.warn("Could not seed initial points:", err.message);
  }

  // Write deployment info so frontend picks up the live contract address automatically
  const deploymentFile = path.join(__dirname, "..", "frontend", "src", "lib", "deployment.json");
  const deploymentData = {
    address: contractAddress,
    chainId: hre.network.config.chainId || (hre.network.name === "sepolia" ? 11155111 : 31337),
    network: hre.network.name,
    deployedBy: deployer.address,
    updatedAt: new Date().toISOString(),
  };

  fs.writeFileSync(deploymentFile, JSON.stringify(deploymentData, null, 2) + "\n");
  console.log("Saved deployment config to:", deploymentFile);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
