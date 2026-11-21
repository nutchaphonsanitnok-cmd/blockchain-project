const hre = require("hardhat");

async function main() {
  const [admin] = await hre.ethers.getSigners();
  const customer = "0xaE5d5A37A1D976cE09793e036d12d2b6Caf1F23d";
  const staff = "0x5faEf8786001692D7a8E5fF9328fD9FDD48f4DD1";

  console.log("Admin address:", admin.address);
  const bal = await hre.ethers.provider.getBalance(admin.address);
  console.log("Admin balance:", hre.ethers.formatEther(bal));

  console.log("Sending 0.008 SepoliaETH to Customer:", customer);
  const tx1 = await admin.sendTransaction({
    to: customer,
    value: hre.ethers.parseEther("0.008")
  });
  console.log("Waiting tx1...", tx1.hash);
  await tx1.wait();
  console.log("Transferred to Customer on Sepolia!");

  console.log("Sending 0.008 SepoliaETH to Staff:", staff);
  const tx2 = await admin.sendTransaction({
    to: staff,
    value: hre.ethers.parseEther("0.008")
  });
  console.log("Waiting tx2...", tx2.hash);
  await tx2.wait();
  console.log("Transferred to Staff on Sepolia!");
}

main().catch(console.error);
