require("@nomicfoundation/hardhat-toolbox");
const fs = require("fs");
const path = require("path");

// Load .env if exists
const envPath = path.join(__dirname, ".env");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf8");
  envContent.split("\n").forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#") && trimmed.includes("=")) {
      const [k, ...v] = trimmed.split("=");
      const val = v.join("=").trim().replace(/^["']|["']$/g, "");
      process.env[k.trim()] = val;
    }
  });
}

const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL || "https://ethereum-sepolia-rpc.publicnode.com";
const PRIVATE_KEY = process.env.PRIVATE_KEY || "";

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {
      chainId: 31337,
    },
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337,
    },
    ...(PRIVATE_KEY
      ? {
          sepolia: {
            url: SEPOLIA_RPC_URL,
            chainId: 11155111,
            accounts: [PRIVATE_KEY.startsWith("0x") ? PRIVATE_KEY : `0x${PRIVATE_KEY}`],
          },
        }
      : {}),
  },
};
