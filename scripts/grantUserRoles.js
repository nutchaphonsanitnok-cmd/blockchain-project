const hre = require("hardhat");
const path = require("path");
const fs = require("fs");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  const targetUser = "0xaa90501641d45e97d979c50c767bef5b680691c8";
  
  const deployPath = path.join(__dirname, "../frontend/src/lib/deployment.json");
  const deployData = JSON.parse(fs.readFileSync(deployPath, "utf8"));
  const contractAddress = deployData.address;

  const contract = await hre.ethers.getContractAt("CopperPoint", contractAddress);

  console.log("Admin deployer:", deployer.address);
  console.log("Contract at:", contractAddress);
  console.log("Granting roles to target user:", targetUser);

  const minterRole = await contract.MINTER_ROLE();
  const merchantRole = await contract.MERCHANT_ROLE();
  const adminRole = await contract.DEFAULT_ADMIN_ROLE();

  // Send 50 ETH to user for Gas fees on Localhost
  const balanceBefore = await hre.ethers.provider.getBalance(targetUser);
  console.log("User ETH balance before:", hre.ethers.formatEther(balanceBefore), "ETH");

  if (balanceBefore < hre.ethers.parseEther("5")) {
    const txEth = await deployer.sendTransaction({
      to: targetUser,
      value: hre.ethers.parseEther("50"),
    });
    await txEth.wait();
    console.log("Sent 50 ETH for Gas to:", targetUser);
  }

  // Grant MINTER, MERCHANT, and ADMIN roles
  await (await contract.grantRole(minterRole, targetUser)).wait();
  await (await contract.grantRole(merchantRole, targetUser)).wait();
  await (await contract.grantRole(adminRole, targetUser)).wait();

  // Also mint 50,000 CUP to targetUser for testing
  await (await contract.mintWithScrapDetails(
    targetUser,
    hre.ethers.parseUnits("50000", 18),
    "ทองแดงปอกสวย",
    500000,
    "Initial Seed Test Points"
  )).wait();

  console.log("Granted all roles and seeded 50,000 CUP to:", targetUser);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
