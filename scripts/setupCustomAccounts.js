const hre = require("hardhat");
const path = require("path");
const fs = require("fs");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  
  const deployPath = path.join(__dirname, "../frontend/src/lib/deployment.json");
  const deployData = JSON.parse(fs.readFileSync(deployPath, "utf8"));
  const contractAddress = deployData.address;

  const contract = await hre.ethers.getContractAt("CopperPoint", contractAddress);

  const adminUser = "0xAa90501641d45e97D979C50C767bEF5B680691c8";
  const customerUser = "0xaE5d5A37A1D976cE09793e036d12d2b6Caf1F23d";
  const staffUser = "0x5faEf8786001692D7a8E5fF9328fD9FDD48f4DD1";

  console.log("Deployer:", deployer.address);
  console.log("Contract:", contractAddress);

  const minterRole = await contract.MINTER_ROLE();
  const merchantRole = await contract.MERCHANT_ROLE();
  const adminRole = await contract.DEFAULT_ADMIN_ROLE();

  // 1. Send Gas ETH to all 3 accounts
  const accounts = [adminUser, customerUser, staffUser];
  for (const acc of accounts) {
    const bal = await hre.ethers.provider.getBalance(acc);
    if (bal < hre.ethers.parseEther("5")) {
      const tx = await deployer.sendTransaction({
        to: acc,
        value: hre.ethers.parseEther("50"),
      });
      await tx.wait();
      console.log(`Sent 50 ETH for Gas to: ${acc}`);
    }
  }

  // 2. Grant roles to Admin (All roles)
  await (await contract.grantRole(adminRole, adminUser)).wait();
  await (await contract.grantRole(minterRole, adminUser)).wait();
  await (await contract.grantRole(merchantRole, adminUser)).wait();
  console.log(`Granted Admin + Minter + Merchant to: ${adminUser}`);

  // 3. Grant MINTER_ROLE to Staff
  await (await contract.grantRole(minterRole, staffUser)).wait();
  console.log(`Granted MINTER_ROLE to Staff: ${staffUser}`);

  // 4. Seed initial CUP tokens
  const seedAmount = hre.ethers.parseUnits("185000", 18);
  
  // Seed Customer with 185,000 CUP
  const custBal = await contract.balanceOf(customerUser);
  if (custBal === 0n) {
    await (await contract.mintWithScrapDetails(
      customerUser,
      seedAmount,
      "ทองแดงปอกสวย",
      1000000,
      "ยอดแต้มสะสมเริ่มต้นของลูกค้า VIP"
    )).wait();
    console.log(`Seeded 185,000 CUP to Customer: ${customerUser}`);
  }

  // Seed Admin with 185,000 CUP
  const adminBal = await contract.balanceOf(adminUser);
  if (adminBal < seedAmount) {
    const diff = seedAmount - adminBal;
    await (await contract.mintWithScrapDetails(
      adminUser,
      diff,
      "ทองแดงปอกสวย",
      1000000,
      "ยอดแต้มสำรองของแอดมิน"
    )).wait();
    console.log(`Topped up Admin balance to 185,000 CUP: ${adminUser}`);
  }

  console.log("All 3 accounts successfully configured on-chain!");
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
