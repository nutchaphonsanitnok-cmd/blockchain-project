const hre = require("hardhat");
const path = require("path");
const fs = require("fs");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  const contractAddress = "0x6C6F482502284B2Ab8fC97bb289109a6E305493D";

  console.log("Using deployer/admin:", deployer.address);
  console.log("Connecting to contract:", contractAddress);

  const contract = await hre.ethers.getContractAt("CopperPoint", contractAddress);

  const customerAddress = "0xaE5d5A37A1D976cE09793e036d12d2b6Caf1F23d";
  const staffAddress = "0x5faEf8786001692D7a8E5fF9328fD9FDD48f4DD1";

  const MINTER_ROLE = await contract.MINTER_ROLE();
  console.log("MINTER_ROLE hash:", MINTER_ROLE);

  // 1. Check if Staff has MINTER_ROLE, if not grant it
  const isStaffMinter = await contract.hasRole(MINTER_ROLE, staffAddress);
  console.log("Staff is minter?", isStaffMinter);
  if (!isStaffMinter) {
    console.log("Granting MINTER_ROLE to Staff:", staffAddress);
    const tx = await contract.grantRole(MINTER_ROLE, staffAddress);
    await tx.wait();
    console.log("Granted MINTER_ROLE to Staff!");
  }

  // 2. Seed initial CUP points to Customer & Admin
  const seedAmount = hre.ethers.parseUnits("185000", 18);
  const custBal = await contract.balanceOf(customerAddress);
  console.log("Customer CUP balance:", hre.ethers.formatUnits(custBal, 18));
  if (custBal === 0n) {
    console.log("Minting 185,000 CUP to Customer...");
    const txCust = await contract.mintWithScrapDetails(
      customerAddress,
      seedAmount,
      "ทองแดงปอกสวย (เกรด A)",
      500000,
      "REC-SEP-001 • แต้มเริ่มต้นลูกค้า VIP"
    );
    await txCust.wait();
    console.log("Minted 185,000 CUP to Customer!");
  }

  const adminBal = await contract.balanceOf(deployer.address);
  console.log("Admin CUP balance:", hre.ethers.formatUnits(adminBal, 18));
  if (adminBal === 0n) {
    console.log("Minting 185,000 CUP to Admin...");
    const txAdmin = await contract.mintWithScrapDetails(
      deployer.address,
      seedAmount,
      "ทองแดงปอกสวย (เกรด A)",
      500000,
      "REC-SEP-002 • แต้มสำรองแอดมิน"
    );
    await txAdmin.wait();
    console.log("Minted 185,000 CUP to Admin!");
  }

  // Update frontend deployment.json
  const deploymentFile = path.join(__dirname, "..", "frontend", "src", "lib", "deployment.json");
  const deploymentData = {
    address: contractAddress,
    chainId: 11155111,
    network: "sepolia",
    deployedBy: deployer.address,
    updatedAt: new Date().toISOString(),
  };

  fs.writeFileSync(deploymentFile, JSON.stringify(deploymentData, null, 2) + "\n");
  console.log("Updated deployment.json for Sepolia:", deploymentFile);
}

main().catch((err) => {
  console.error("Error in setupSepoliaAccounts:", err);
  process.exitCode = 1;
});
