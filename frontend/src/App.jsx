import React, { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import {
  CONTRACT_ADDRESS,
  CONTRACT_ABI,
  TARGET_CHAIN_ID,
  TARGET_NETWORK_NAME,
  HARDHAT_TEST_ACCOUNTS,
  SCRAP_METALS,
  CATEGORIES,
  REWARD_ITEMS,
  THB_PER_POINT
} from './lib/contract';
import {
  NongCopper,
  CartoonScrapIcon,
  CartoonRewardIcon
} from './components/CartoonIcons';
import {
  Wallet,
  Sparkles,
  ShieldCheck,
  Scale,
  Gift,
  Coins,
  History,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Flame,
  KeyRound,
  Check,
  Camera,
  Search,
  TrendingUp,
  LogOut,
  PlusCircle,
  RefreshCw,
  UserPlus
} from 'lucide-react';

// Preset Accounts mapped to user's real MetaMask accounts
const DEMO_ACCOUNTS = [
  {
    role: 'customer',
    name: 'ลูกค้า (ผู้ขายเศษโลหะ & E-Waste)',
    label: 'ลูกค้า (0xaE5d...F23d)',
    address: HARDHAT_TEST_ACCOUNTS.customer,
    balance: 185000,
    allowance: 50000
  },
  {
    role: 'minter',
    name: 'พนักงานชั่งหน้าร้าน (Minter)',
    label: 'พนักงานชั่ง (0x5faE...4DD1)',
    address: HARDHAT_TEST_ACCOUNTS.staff,
    quotaLimit: 0,
    quotaUsed: 0
  },
  {
    role: 'admin',
    name: 'แอดมินระบบ (ครบทุกบทบาท)',
    label: 'Admin (0xAa90...91c8)',
    address: HARDHAT_TEST_ACCOUNTS.admin
  }
];

function parseWeb3Error(err) {
  if (!err) return 'เกิดข้อผิดพลาดในการส่งธุรกรรม';
  if (err.code === 'ACTION_REJECTED' || err.code === 4001) {
    return 'คุณกดยกเลิกธุรกรรมใน MetaMask';
  }
  const deepMsg =
    err.info?.error?.message ||
    err.error?.message ||
    err.data?.message ||
    err.reason ||
    err.shortMessage ||
    err.message ||
    String(err);

  const lower = deepMsg.toLowerCase();
  if (
    lower.includes('could not coalesce error') ||
    lower.includes('nonce') ||
    lower.includes('internal json-rpc error') ||
    lower.includes('-32603') ||
    lower.includes('-32000')
  ) {
    return 'MetaMask ติด Cache บล็อกเดิมจากการรีสตาร์ท Localhost: กรุณาไปที่ MetaMask > Settings > Advanced > Clear activity tab data หรือคลิกปุ่มสีดำ "⚡ บันทึกตรงผ่าน Local Node" ด้านล่างได้ทันทีครับ';
  }
  if (
    lower.includes('not been authorized') ||
    lower.includes('unauthorized') ||
    err.code === 4100 ||
    err.info?.error?.code === 4100
  ) {
    return 'MetaMask แจ้งว่าบัญชีปัจจุบันยังไม่ได้รับอนุญาตเชื่อมต่อ: กรุณากดปุ่ม "สลับบัญชี" ด้านบนเพื่อเลือกติ๊กเชื่อมต่อบัญชีนี้ หรือคลิกปุ่มสีดำ "⚡ บันทึกตรงผ่าน Local Node"';
  }
  if (
    deepMsg.includes('AccessControlUnauthorizedAccount') ||
    deepMsg.includes('0xe2517d3f') ||
    lower.includes('unauthorized') ||
    lower.includes('missing role')
  ) {
    return 'กระเป๋าปัจจุบันไม่มีสิทธิ์ในฟังก์ชันนี้ของ Smart Contract (เฉพาะกระเป๋า Admin 0xAa90...691c8 เท่านั้นที่มีสิทธิ์)';
  }
  if (lower.includes('execution reverted')) {
    return 'ธุรกรรมถูกปฏิเสธ (Execution Reverted): กระเป๋าปัจจุบันไม่มีสิทธิ์ Admin หรือยอด Gas ETH ไม่เพียงพอ';
  }
  if (lower.includes('insufficient funds')) {
    return 'ยอด ETH ในกระเป๋าไม่พอจ่ายค่า Gas บน Localhost กรุณารับ Gas ETH ทดสอบก่อน';
  }
  if (deepMsg.includes('ERC20InsufficientAllowance')) {
    return 'วงเงินที่ลูกค้า Approve ไว้ไม่เพียงพอ กรุณาให้ลูกค้ากด Approve เพิ่มก่อน';
  }
  if (deepMsg.includes('ERC20InsufficientBalance')) {
    return 'ยอดแต้ม CUP ในกระเป๋าไม่เพียงพอ';
  }
  if (deepMsg.includes('EnforcedPause')) {
    return 'ขณะนี้ระบบถูก Admin สั่งหยุดฉุกเฉิน (Paused) อยู่';
  }
  return deepMsg;
}

export default function App() {
  // Navigation & Role states
  const [activeAccount, setActiveAccount] = useState(DEMO_ACCOUNTS[0]);
  const [activeTab, setActiveTab] = useState('customer'); // 'customer' | 'minter' | 'merchant' | 'admin'
  const [isWeb3Connected, setIsWeb3Connected] = useState(false);

  // Live MetaMask / Ethers v6 states
  const [walletAddress, setWalletAddress] = useState('');
  const [chainId, setChainId] = useState(null);
  const [tokenDecimals, setTokenDecimals] = useState(18);
  const [contractInstance, setContractInstance] = useState(null);
  const [onChainRoles, setOnChainRoles] = useState({ admin: false, minter: false, merchant: false });
  const [merchantTargetAllowance, setMerchantTargetAllowance] = useState(0);
  const [grantTargetAddress, setGrantTargetAddress] = useState('');
  const [grantRoleType, setGrantRoleType] = useState('MINTER_ROLE');

  // Balances
  const [balance, setBalance] = useState(185000);
  const [customerAllowance, setCustomerAllowance] = useState(50000);
  const [isPaused, setIsPaused] = useState(false);

  // Status message
  const [statusMsg, setStatusMsg] = useState({ text: '', type: 'info' });
  const [isProcessing, setIsProcessing] = useState(false);
  const [isWaitingMetaMask, setIsWaitingMetaMask] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  // Catalog Filters & Search
  const [metalFilter, setMetalFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Customer Form (1-Click Burn Self without Approve)
  const [customerRedeemType, setCustomerRedeemType] = useState('cash'); // 'cash' | 'reward'
  const [customerSelectedReward, setCustomerSelectedReward] = useState(REWARD_ITEMS[1].id);
  const [burnAmount, setBurnAmount] = useState('15000');
  const [burnReason, setBurnReason] = useState('แลกเงินสดแคชแบ็กรอบบิล 15,000 บาท');
  const [approveShopAddress, setApproveShopAddress] = useState(DEMO_ACCOUNTS[2].address);
  const [approveAmount, setApproveAmount] = useState('50000');

  // Staff (Minter) Form
  const [buyerCustomerAddress, setBuyerCustomerAddress] = useState(DEMO_ACCOUNTS[0].address);
  const [buyerCustomerBalance, setBuyerCustomerBalance] = useState(0);
  const [selectedMetal, setSelectedMetal] = useState(SCRAP_METALS[0].id);
  const [staffFilter, setStaffFilter] = useState('all');
  const [staffSearch, setStaffSearch] = useState('');
  const [scrapQuantityInput, setScrapQuantityInput] = useState('500');
  const [weightUnit, setWeightUnit] = useState('kg'); // 'g' | 'kg' | 'ton' | 'pcs'
  const [scrapReceipt, setScrapReceipt] = useState('REC-2026-0112');

  // Merchant Form
  const [redeemCustomerAddress, setRedeemCustomerAddress] = useState(DEMO_ACCOUNTS[0].address);
  const [selectedReward, setSelectedReward] = useState(REWARD_ITEMS[0].id);
  const [customCashPoints, setCustomCashPoints] = useState(25000);

  // Admin Profit Stats (สะสมจากบิลจริง)
  const [adminLedgerStats, setAdminLedgerStats] = useState({
    totalBuyThb: 554331,
    totalSellThb: 650020,
    totalWeightKg: 1457.8
  });

  // On-Chain Transaction Ledger
  const [txHistory, setTxHistory] = useState([
    {
      id: 'tx-1',
      hash: '0x7a56f7e7cbd29f8a12096821',
      type: 'REDEEM',
      title: 'โบนัสเงินสดแคชแบ็ก 50,000 บาท (หักแต้ม)',
      subtitle: `ฝ่ายการเงิน: 0x82A7...09Ad3 • โอนพร้อมเพย์เรียบร้อย • Gasless`,
      amount: -50000,
      timestamp: '5 นาทีที่แล้ว',
      method: 'merchantRedeem',
      iconType: 'cash_50k',
      isReward: true
    },
    {
      id: 'tx-2',
      hash: '0xf056ba827fe812096793',
      type: 'MINT',
      title: 'รับซื้อทองแดงปอกสวย 1,200 กก. (1.2 ตัน)',
      subtitle: `มูลค่าซื้อ ฿504,000 • IPFS: bafybeic... (ใบเสร็จ REC-0111)`,
      amount: +25200,
      timestamp: '20 นาทีที่แล้ว',
      method: 'mintWithScrapDetails',
      iconType: 'cu_big',
      isReward: false
    },
    {
      id: 'tx-3',
      hash: '0x3c96ea12b40912096819',
      type: 'MINT',
      title: 'รับซื้อเม็ดเงินบริสุทธิ์ 250 กรัม (0.25 กก.)',
      subtitle: `มูลค่าซื้อ ฿8,750 • ใบเสร็จ REC-0109`,
      amount: +438,
      timestamp: '45 นาทีที่แล้ว',
      method: 'mintWithScrapDetails',
      iconType: 'silver',
      isReward: false
    },
    {
      id: 'tx-4',
      hash: '0x88b1ea04f2912096802',
      type: 'MINT',
      title: 'รับซื้อแรมบาง (RAM ขาทอง) 2,400 กรัม (2.4 กก.)',
      subtitle: `มูลค่าซื้อ ฿6,600 • ใบเสร็จ REC-0105`,
      amount: +330,
      timestamp: '1 ชม. ที่แล้ว',
      method: 'mintWithScrapDetails',
      iconType: 'ram',
      isReward: false
    },
    {
      id: 'tx-5',
      hash: '0x9a88cd71902212096810',
      type: 'APPROVE',
      title: 'อนุมัติวงเงินให้ฝ่ายการเงิน 50,000 CUP',
      subtitle: `Spender: 0x82A7...09Ad3`,
      amount: 50000,
      timestamp: '2 ชม. ที่แล้ว',
      method: 'approve',
      iconType: null,
      isReward: false
    }
  ]);

  const notify = (text, type = 'info', duration = 3500) => {
    setStatusMsg({ text, type });
    if (duration > 0) {
      setTimeout(() => setStatusMsg({ text: '', type: 'info' }), duration);
    }
  };

  const triggerCelebration = () => {
    setShowCelebration(true);
    setTimeout(() => setShowCelebration(false), 3000);
  };

  // Fetch balances, allowances, RBAC roles, and on-chain events
  const refreshOnChainState = useCallback(
    async (contractInst, userAddr, shopAddrOverride, customerAddrOverride) => {
      if (!contractInst || !userAddr) return;
      try {
        const dec = Number(await contractInst.decimals());
        setTokenDecimals(dec);

        const [rawBal, pausedFlag, minterRoleHash, merchantRoleHash, adminRoleHash] = await Promise.all([
          contractInst.balanceOf(userAddr),
          contractInst.paused(),
          contractInst.MINTER_ROLE(),
          contractInst.MERCHANT_ROLE(),
          contractInst.DEFAULT_ADMIN_ROLE()
        ]);

        const formattedBal = Math.floor(Number(ethers.formatUnits(rawBal, dec)));
        setBalance(formattedBal);
        setIsPaused(Boolean(pausedFlag));

        const [isAdmin, isMinter, isMerchant] = await Promise.all([
          contractInst.hasRole(adminRoleHash, userAddr),
          contractInst.hasRole(minterRoleHash, userAddr),
          contractInst.hasRole(merchantRoleHash, userAddr)
        ]);
        setOnChainRoles({ admin: isAdmin, minter: isMinter, merchant: isMerchant });

        const shopTarget = shopAddrOverride || approveShopAddress;
        if (ethers.isAddress(shopTarget)) {
          const rawAllow = await contractInst.allowance(userAddr, shopTarget);
          setCustomerAllowance(Math.floor(Number(ethers.formatUnits(rawAllow, dec))));
        }

        const custTarget = customerAddrOverride || redeemCustomerAddress;
        if (ethers.isAddress(custTarget)) {
          const rawMerchAllow = await contractInst.allowance(custTarget, userAddr);
          setMerchantTargetAllowance(Math.floor(Number(ethers.formatUnits(rawMerchAllow, dec))));
        }

        // Load real on-chain events
        try {
          const provider = contractInst.runner?.provider;
          const latestBlock = provider ? await provider.getBlockNumber() : 0;
          const fromBlock = Math.max(0, latestBlock - 5000);

          const [mintLogs, redeemLogs] = await Promise.all([
            contractInst.queryFilter('ScrapTraded', fromBlock, 'latest'),
            contractInst.queryFilter('RewardRedeemed', fromBlock, 'latest')
          ]);

          const parsedMints = mintLogs.map((ev) => {
            const pts = Math.round(Number(ethers.formatUnits(ev.args.pointsMinted, dec)));
            const wGrams = Number(ev.args.weightGrams);
            const metalName = ev.args.metalType;
            const matchedMetal = SCRAP_METALS.find((m) => m.name === metalName);
            const qtyText = matchedMetal?.unitType === 'piece' ? `${wGrams} ชิ้น/เครื่อง` : `${(wGrams / 1000).toLocaleString()} กก.`;
            return {
              id: `chain-${ev.transactionHash}-${ev.index}`,
              blockNumber: ev.blockNumber,
              logIndex: ev.index,
              hash: ev.transactionHash,
              type: 'MINT',
              title: `รับซื้อ ${metalName} ${qtyText}`,
              subtitle: `ลูกค้า: ${ev.args.customer.substring(0, 6)}...${ev.args.customer.substring(38)} • ${ev.args.note}`,
              amount: +pts,
              timestamp: `Block #${ev.blockNumber}`,
              method: 'mintWithScrapDetails',
              iconType: matchedMetal?.iconType || 'cu_big',
              isReward: false
            };
          });

          const parsedRedeems = redeemLogs.map((ev) => {
            const pts = Math.round(Number(ethers.formatUnits(ev.args.pointsBurned, dec)));
            const isSelfBurn = ev.args.customer.toLowerCase() === ev.args.merchant.toLowerCase();
            return {
              id: `chain-${ev.transactionHash}-${ev.index}`,
              blockNumber: ev.blockNumber,
              logIndex: ev.index,
              hash: ev.transactionHash,
              type: isSelfBurn ? 'BURN' : 'REDEEM',
              title: ev.args.rewardItem,
              subtitle: `ผู้ขาย: ${ev.args.customer.substring(0, 6)}...${ev.args.customer.substring(38)} • ยืนยันบนเชน`,
              amount: -pts,
              timestamp: `Block #${ev.blockNumber}`,
              method: isSelfBurn ? 'burnSelf' : 'merchantRedeem',
              iconType: isSelfBurn ? null : 'cash_50k',
              isReward: !isSelfBurn
            };
          });

          const combined = [...parsedMints, ...parsedRedeems].sort((a, b) =>
            b.blockNumber !== a.blockNumber ? b.blockNumber - a.blockNumber : b.logIndex - a.logIndex
          );
          if (combined.length > 0) {
            setTxHistory(combined);
          }
        } catch (eventErr) {
          console.warn('Event fetch warning:', eventErr);
        }
      } catch (err) {
        console.error('Failed to sync on-chain state:', err);
      }
    },
    [approveShopAddress, redeemCustomerAddress]
  );

  // Switch or add target EVM chain in MetaMask
  const ensureTargetNetwork = async () => {
    const targetHex = '0x' + TARGET_CHAIN_ID.toString(16);
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: targetHex }]
      });
      return true;
    } catch (switchErr) {
      if (switchErr.code === 4902) {
        if (TARGET_CHAIN_ID === 11155111) {
          try {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainId: '0xaa36a7',
                  chainName: 'Sepolia Testnet',
                  rpcUrls: ['https://ethereum-sepolia-rpc.publicnode.com'],
                  nativeCurrency: { name: 'SepoliaETH', symbol: 'ETH', decimals: 18 },
                  blockExplorerUrls: ['https://sepolia.etherscan.io']
                }
              ]
            });
            return true;
          } catch (addErr) {
            notify('กรุณาเปิด/สลับไปยังเครือข่าย Sepolia ใน MetaMask: ' + parseWeb3Error(addErr), 'error', 5000);
            return false;
          }
        } else if (TARGET_CHAIN_ID === 31337) {
          try {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainId: '0x7a69',
                  chainName: 'Hardhat Localhost (CopperPoint)',
                  rpcUrls: ['http://127.0.0.1:8545'],
                  nativeCurrency: { name: 'Hardhat ETH', symbol: 'ETH', decimals: 18 }
                }
              ]
            });
            return true;
          } catch (addErr) {
            notify('ไม่สามารถเพิ่มเครือข่าย Hardhat Localhost เข้า MetaMask ได้: ' + parseWeb3Error(addErr), 'error', 5000);
            return false;
          }
        }
      }
      notify(`กรุณาสลับเครือข่ายใน MetaMask เป็น Chain ID ${TARGET_CHAIN_ID} (${TARGET_NETWORK_NAME})`, 'warning', 5000);
      return false;
    }
  };

  // Connect MetaMask
  const connectMetaMask = async () => {
    if (typeof window === 'undefined' || !window.ethereum) {
      notify('ไม่พบ MetaMask บนเบราว์เซอร์ — กรุณาติดตั้ง Extension MetaMask ก่อน หรือใช้ "โหมดจำลอง" ต่อได้เลยครับ', 'warning', 6000);
      return;
    }

    try {
      setIsProcessing(true);
      notify('กำลังขอสิทธิ์เชื่อมต่อกระเป๋า MetaMask...', 'info', 0);

      let provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send('eth_requestAccounts', []);
      if (!accounts || accounts.length === 0) {
        return notify('ไม่พบบัญชีใน MetaMask', 'warning');
      }

      const net = await provider.getNetwork();
      if (Number(net.chainId) !== TARGET_CHAIN_ID) {
        notify(`กำลังสลับเครือข่ายใน MetaMask ไปยัง ${TARGET_NETWORK_NAME} (Chain ${TARGET_CHAIN_ID})...`, 'info', 0);
        const switched = await ensureTargetNetwork();
        if (!switched) return;
        provider = new ethers.BrowserProvider(window.ethereum);
      }

      const signerObj = await provider.getSigner();
      const addr = await signerObj.getAddress();
      const updatedNet = await provider.getNetwork();

      const code = await provider.getCode(CONTRACT_ADDRESS);
      if (code === '0x') {
        notify(
          `ไม่พบ Smart Contract ที่ ${CONTRACT_ADDRESS} บนเครือข่ายนี้ — กรุณารัน npm run node และ npm run deploy:local ก่อน`,
          'error',
          7000
        );
        return;
      }

      const contractObj = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signerObj);
      setWalletAddress(addr);
      setChainId(Number(updatedNet.chainId));
      setContractInstance(contractObj);
      setIsWeb3Connected(true);
      setGrantTargetAddress(addr);
      setBuyerCustomerAddress(addr); // Default customer wallet to user's connected wallet

      await refreshOnChainState(contractObj, addr);
      notify(`เชื่อมต่อ MetaMask สำเร็จ! (${addr.substring(0, 6)}...${addr.substring(38)})`, 'success', 4000);
    } catch (err) {
      notify('ไม่สามารถเชื่อมต่อ MetaMask: ' + parseWeb3Error(err), 'error', 5000);
    } finally {
      setIsProcessing(false);
    }
  };

  // Disconnect back to Demo Mode
  const disconnectMetaMask = () => {
    setIsWeb3Connected(false);
    setWalletAddress('');
    setChainId(null);
    setContractInstance(null);
    setOnChainRoles({ admin: false, minter: false, merchant: false });
    setBalance(activeAccount.balance ?? 185000);
    setCustomerAllowance(activeAccount.allowance ?? 50000);
    notify('สลับกลับมาใช้งานโหมดจำลอง (Demo Mode) เรียบร้อย', 'info', 3000);
  };

  // Add CUP ERC-20 token to MetaMask UI
  const addCupTokenToMetaMask = async () => {
    if (!window.ethereum) return;
    try {
      await window.ethereum.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20',
          options: {
            address: CONTRACT_ADDRESS,
            symbol: 'CUP',
            decimals: tokenDecimals
          }
        }
      });
      notify('ส่งคำขอเพิ่มเหรียญ CUP เข้ากระเป๋า MetaMask แล้ว!', 'success');
    } catch (err) {
      notify('ไม่สามารถเพิ่ม Token: ' + parseWeb3Error(err), 'error');
    }
  };

  // Explicitly prompt MetaMask account selector modal (fixes Error 4100 unauthorized account)
  const switchMetaMaskAccount = async () => {
    if (typeof window === 'undefined' || !window.ethereum) {
      return notify('ไม่พบ MetaMask บนเบราว์เซอร์', 'warning');
    }
    try {
      setIsProcessing(true);
      notify('กำลังเปิดหน้าต่าง MetaMask ให้เลือกบัญชีกระเป๋า...', 'info', 0);
      await window.ethereum.request({
        method: 'wallet_requestPermissions',
        params: [{ eth_accounts: {} }]
      });
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send('eth_requestAccounts', []);
      if (accounts && accounts.length > 0) {
        const signerObj = await provider.getSigner(accounts[0]);
        const addr = await signerObj.getAddress();
        const contractObj = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signerObj);
        setWalletAddress(addr);
        setContractInstance(contractObj);
        setGrantTargetAddress(addr);
        setBuyerCustomerAddress(addr);
        setIsWeb3Connected(true);
        await refreshOnChainState(contractObj, addr);
        notify(`สลับใช้งานกระเป๋า MetaMask: ${addr.substring(0, 6)}...${addr.substring(38)} สำเร็จ!`, 'success', 4000);
      }
    } catch (err) {
      if (err.code === 4001 || err.code === 'ACTION_REJECTED') {
        notify('คุณยกเลิกการเลือกบัญชีใน MetaMask', 'info', 3000);
      } else {
        notify('ไม่สามารถสลับบัญชี: ' + parseWeb3Error(err), 'error', 5000);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  // Dynamic live signer & contract resolver to prevent stale signer desync
  const getLiveSignerAndContract = async () => {
    if (typeof window === 'undefined' || !window.ethereum) {
      throw new Error('ไม่พบกระเป๋า MetaMask บนเบราว์เซอร์');
    }
    const provider = new ethers.BrowserProvider(window.ethereum);
    let accounts = await provider.send('eth_accounts', []);
    if (!accounts || accounts.length === 0) {
      accounts = await provider.send('eth_requestAccounts', []);
    }
    if (!accounts || accounts.length === 0) {
      throw new Error('กรุณาเลือกบัญชีและเชื่อมต่อ MetaMask ก่อน');
    }

    const net = await provider.getNetwork();
    if (Number(net.chainId) !== TARGET_CHAIN_ID) {
      const switched = await ensureTargetNetwork();
      if (!switched) throw new Error(`กรุณาสลับเป็น Chain ID ${TARGET_CHAIN_ID}`);
    }

    const currentSigner = await provider.getSigner(accounts[0]);
    const liveAddress = await currentSigner.getAddress();
    const liveContract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, currentSigner);

    if (liveAddress.toLowerCase() !== walletAddress.toLowerCase()) {
      setWalletAddress(liveAddress);
      setGrantTargetAddress(liveAddress);
    }
    setContractInstance(liveContract);
    setIsWeb3Connected(true);

    return { provider, signer: currentSigner, liveContract, liveAddress };
  };

  // Listen for MetaMask account or network changes
  useEffect(() => {
    if (typeof window === 'undefined' || !window.ethereum || !isWeb3Connected) return;

    const handleAccountsChanged = async (accounts) => {
      if (!accounts || accounts.length === 0) {
        disconnectMetaMask();
        return;
      }
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signerObj = await provider.getSigner();
        const addr = await signerObj.getAddress();
        const contractObj = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signerObj);
        setWalletAddress(addr);
        setContractInstance(contractObj);
        setBuyerCustomerAddress(addr);
        await refreshOnChainState(contractObj, addr);
        notify(`สลับบัญชี MetaMask เป็น ${addr.substring(0, 6)}...${addr.substring(38)}`, 'info', 3000);
      } catch (err) {
        console.error(err);
      }
    };

    const handleChainChanged = () => {
      window.location.reload();
    };

    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);
    return () => {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum.removeListener('chainChanged', handleChainChanged);
    };
  }, [isWeb3Connected, refreshOnChainState]);

  // Refresh allowances dynamically when target addresses change in Web3 mode
  useEffect(() => {
    if (isWeb3Connected && contractInstance && walletAddress) {
      refreshOnChainState(contractInstance, walletAddress, approveShopAddress, redeemCustomerAddress);
    }
  }, [approveShopAddress, redeemCustomerAddress, isWeb3Connected, contractInstance, walletAddress, refreshOnChainState]);

  // Keep live balance of buyerCustomerAddress in sync
  useEffect(() => {
    let isSubscribed = true;
    const fetchBuyerBalance = async () => {
      if (!ethers.isAddress(buyerCustomerAddress)) {
        setBuyerCustomerBalance(0);
        return;
      }
      try {
        const rpcProvider = new ethers.JsonRpcProvider('http://127.0.0.1:8545');
        const readContract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, rpcProvider);
        const dec = await readContract.decimals();
        const raw = await readContract.balanceOf(buyerCustomerAddress);
        if (isSubscribed) {
          setBuyerCustomerBalance(Math.floor(Number(ethers.formatUnits(raw, dec))));
        }
      } catch (e) {
        // ignore
      }
    };
    fetchBuyerBalance();
    return () => {
      isSubscribed = false;
    };
  }, [buyerCustomerAddress, isWeb3Connected, txHistory, balance]);

  // Switch demo role / view tab
  const handleSwitchAccount = (acc) => {
    setActiveAccount(acc);
    setActiveTab(acc.role);
    if (!isWeb3Connected) {
      if (acc.balance !== undefined) setBalance(acc.balance);
      if (acc.allowance !== undefined) setCustomerAllowance(acc.allowance);
      notify(`สลับใช้งานโหมดจำลอง: ${acc.name}`, 'info', 2000);
    } else {
      notify(`เปิดมุมมองแท็บ: ${acc.label} (ใช้กระเป๋าจริง ${walletAddress.substring(0, 6)}...${walletAddress.substring(38)})`, 'info', 2500);
    }
  };

  // Handle selecting an item in Staff view (auto-switch optimal unit)
  const handleSelectMetal = (metal) => {
    setSelectedMetal(metal.id);
    if (metal.unitType === 'piece') {
      setWeightUnit('pcs');
      setScrapQuantityInput('10');
    } else if (metal.defaultUnit === 'g') {
      setWeightUnit('g');
      setScrapQuantityInput('250');
    } else {
      setWeightUnit('kg');
      setScrapQuantityInput('500');
    }
  };

  // Current item calculations
  const currentMetalObj = SCRAP_METALS.find((m) => m.id === selectedMetal) || SCRAP_METALS[0];
  const rawInputNum = Math.max(0, parseFloat(scrapQuantityInput) || 0);

  let baseQty = 0; // In kg (for weight) or pieces (for piece)
  if (currentMetalObj.unitType === 'piece') {
    baseQty = rawInputNum;
  } else {
    if (weightUnit === 'g') baseQty = rawInputNum / 1000;
    else if (weightUnit === 'ton') baseQty = rawInputNum * 1000;
    else baseQty = rawInputNum; // kg
  }

  const estimatedBuyThb = Math.round(baseQty * currentMetalObj.buyPrice);
  const estimatedSellThb = Math.round(baseQty * currentMetalObj.sellPrice);
  const estimatedProfitThb = Math.max(0, estimatedSellThb - estimatedBuyThb);
  const calculatedPoints = estimatedBuyThb > 0 ? Math.max(1, Math.round(estimatedBuyThb / THB_PER_POINT)) : 0;

  // Customer Tier
  const getTierInfo = (pts) => {
    if (pts >= 100000) return { name: 'พันธมิตรโรงหลอม VIP 👑', color: 'bg-amber-100 text-amber-900 border-amber-300' };
    if (pts >= 20000) return { name: 'ลานรับซื้อระดับ Gold 🌟', color: 'bg-yellow-100 text-yellow-800 border-yellow-300' };
    if (pts >= 5000) return { name: 'ช่างไฟมือโปร ⚡', color: 'bg-orange-100 text-orange-800 border-orange-300' };
    return { name: 'ช่างทองแดงมือใหม่ 🥉', color: 'bg-slate-100 text-slate-700 border-slate-300' };
  };

  // Filter Helpers
  const filterItems = (categoryState, searchState) => {
    return SCRAP_METALS.filter((item) => {
      const matchesCat = categoryState === 'all' || item.category === categoryState;
      const matchesSearch =
        !searchState.trim() ||
        item.name.toLowerCase().includes(searchState.toLowerCase()) ||
        item.desc.toLowerCase().includes(searchState.toLowerCase());
      return matchesCat && matchesSearch;
    });
  };

  const displayedMerchantAllowance = isWeb3Connected ? merchantTargetAllowance : customerAllowance;

  // Action: Customer Burn Self
  const handleBurnSelf = async (e) => {
    e.preventDefault();
    const pts = parseInt(burnAmount);
    if (!pts || pts <= 0) return notify('กรุณากรอกจำนวนแต้มที่ถูกต้อง', 'warning');
    if (pts > balance) return notify('แต้มคงเหลือไม่เพียงพอ', 'error');

    setIsProcessing(true);

    if (isWeb3Connected) {
      try {
        notify('กรุณากดยืนยันการเผาแต้ม (burnSelf) ในหน้าต่าง MetaMask...', 'info', 0);
        const { liveContract, liveAddress } = await getLiveSignerAndContract();
        const amountWei = ethers.parseUnits(pts.toString(), tokenDecimals);
        const tx = await liveContract.burnSelf(amountWei, burnReason || 'Self Redeem');
        notify('กำลังรอ Confirm Block บนบล็อกเชน...', 'info', 0);
        await tx.wait();
        await refreshOnChainState(liveContract, liveAddress);
        setBurnAmount('');
        triggerCelebration();
        notify(`เผาแต้ม On-Chain สำเร็จ! ใช้ไป ${pts.toLocaleString()} CUP (Tx: ${tx.hash.substring(0, 10)}...)`, 'success', 5000);
      } catch (err) {
        notify(parseWeb3Error(err), 'error', 5000);
      } finally {
        setIsProcessing(false);
      }
      return;
    }

    notify('กำลังส่งธุรกรรมลงเชน (Demo burnSelf)...', 'info', 0);
    setTimeout(() => {
      setBalance((prev) => prev - pts);
      const newTx = {
        id: 'tx-' + Date.now(),
        hash: '0x' + Math.random().toString(16).substring(2, 26),
        type: 'BURN',
        title: `${burnReason} (เผาแต้ม)`,
        subtitle: `ทำรายการเองโดย: ${activeAccount.name} • มูลค่า ฿${pts.toLocaleString()}`,
        amount: -pts,
        timestamp: 'เมื่อสักครู่',
        method: 'burnSelf',
        iconType: null,
        isReward: false
      };
      setTxHistory((prev) => [newTx, ...prev]);
      setBurnAmount('');
      setIsProcessing(false);
      triggerCelebration();
      notify(`เผาแต้มสำเร็จ! ใช้ไป ${pts.toLocaleString()} CUP เรียบร้อยแล้ว`, 'success');
    }, 900);
  };

  // 1-Click Direct Burn Self on Localhost Node (Bypasses MetaMask popup)
  const handleDirectLocalBurnSelf = async () => {
    const pts = parseInt(burnAmount);
    if (!pts || pts <= 0) return notify('กรุณากรอกจำนวนแต้มที่ถูกต้อง', 'warning');
    if (pts > balance) return notify('แต้มคงเหลือไม่เพียงพอ', 'error');

    setIsProcessing(true);
    notify(`กำลังเผาแต้ม -${pts.toLocaleString()} CUP ผ่าน Local Node ทันที...`, 'info', 0);

    try {
      const localProvider = new ethers.JsonRpcProvider('http://127.0.0.1:8545');
      const key =
        walletAddress.toLowerCase() === HARDHAT_TEST_ACCOUNTS.customer.toLowerCase()
          ? '0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d'
          : '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';
      const userWallet = new ethers.Wallet(key, localProvider);
      const userContract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, userWallet);

      const amountWei = ethers.parseUnits(pts.toString(), tokenDecimals);
      const tx = await userContract.burnSelf(amountWei, burnReason || 'Self Redeem');
      await tx.wait();

      await refreshOnChainState(contractInstance || userContract, walletAddress);
      triggerCelebration();
      notify(`แลกรางวัลสำเร็จ! เผาแต้ม -${pts.toLocaleString()} CUP เรียบร้อยแล้ว 🎉`, 'success', 5000);
    } catch (err) {
      notify('ไม่สามารถแลกผ่าน Node: ' + parseWeb3Error(err), 'error', 6000);
    } finally {
      setIsProcessing(false);
    }
  };

  // Action: Customer Approve
  const handleApprove = async (e) => {
    e.preventDefault();
    const pts = parseInt(approveAmount);
    if (!pts || pts <= 0) return notify('กรุณากรอกจำนวนแต้มที่ถูกต้อง', 'warning');
    if (!ethers.isAddress(approveShopAddress)) return notify('Address ร้านค้าไม่ถูกต้อง', 'error');

    setIsProcessing(true);

    if (isWeb3Connected) {
      try {
        notify('กรุณายืนยันการอนุมัติวงเงิน (approve) ใน MetaMask...', 'info', 0);
        const { liveContract, liveAddress } = await getLiveSignerAndContract();
        const amountWei = ethers.parseUnits(pts.toString(), tokenDecimals);
        const tx = await liveContract.approve(approveShopAddress, amountWei);
        notify('กำลังรอยืนยันบนบล็อกเชน...', 'info', 0);
        await tx.wait();
        await refreshOnChainState(liveContract, liveAddress);
        const newTx = {
          id: 'tx-' + Date.now(),
          hash: tx.hash,
          type: 'APPROVE',
          title: `อนุมัติวงเงินให้ร้านค้า ${pts.toLocaleString()} CUP (On-Chain)`,
          subtitle: `Spender: ${approveShopAddress.substring(0, 8)}...`,
          amount: pts,
          timestamp: 'ยืนยันล่าสุด',
          method: 'approve',
          iconType: null,
          isReward: false
        };
        setTxHistory((prev) => [newTx, ...prev]);
        setApproveAmount('');
        notify(`อนุมัติ On-Chain สำเร็จ! วงเงิน ${pts.toLocaleString()} CUP`, 'success', 5000);
      } catch (err) {
        notify(parseWeb3Error(err), 'error', 5000);
      } finally {
        setIsProcessing(false);
      }
      return;
    }

    notify('กรุณายืนยันการอนุมัติสิทธิ์ (Demo approve) ในกระเป๋า...', 'info', 0);
    setTimeout(() => {
      setCustomerAllowance(pts);
      const newTx = {
        id: 'tx-' + Date.now(),
        hash: '0x' + Math.random().toString(16).substring(2, 26),
        type: 'APPROVE',
        title: `อนุมัติวงเงินให้ร้านค้า ${pts.toLocaleString()} CUP`,
        subtitle: `Spender: ${approveShopAddress.substring(0, 8)}...`,
        amount: pts,
        timestamp: 'เมื่อสักครู่',
        method: 'approve',
        iconType: null,
        isReward: false
      };
      setTxHistory((prev) => [newTx, ...prev]);
      setApproveAmount('');
      setIsProcessing(false);
      notify(`อนุมัติสำเร็จ! ร้านค้าสามารถหักแต้มได้สูงสุด ${pts.toLocaleString()} CUP`, 'success');
    }, 900);
  };

  // Action: Staff Mint
  const handleMint = async (e) => {
    e.preventDefault();
    if (calculatedPoints <= 0 || baseQty <= 0) return notify('กรุณาระบุจำนวนหรือน้ำหนักที่มากกว่า 0', 'warning');
    if (!ethers.isAddress(buyerCustomerAddress)) return notify('Address กระเป๋าผู้ขายไม่ถูกต้อง', 'error');

    setIsProcessing(true);
    const qtyLabel =
      currentMetalObj.unitType === 'piece'
        ? `${baseQty.toLocaleString()} เครื่อง`
        : weightUnit === 'g'
        ? `${rawInputNum.toLocaleString()} กรัม (${baseQty.toFixed(3)} กก.)`
        : `${baseQty.toLocaleString()} กก.`;

    if (isWeb3Connected) {
      try {
        setIsWaitingMetaMask(true);
        notify(`กรุณายืนยัน Mint +${calculatedPoints.toLocaleString()} CUP ในหน้าต่าง MetaMask...`, 'info', 0);
        const { liveContract, liveAddress } = await getLiveSignerAndContract();
        const amountWei = ethers.parseUnits(calculatedPoints.toString(), tokenDecimals);
        const weightInt =
          currentMetalObj.unitType === 'piece'
            ? Math.max(1, Math.round(baseQty))
            : Math.max(1, Math.round(baseQty * 1000));
        const noteText = `ยอดซื้อ ฿${estimatedBuyThb.toLocaleString()} • ใบเสร็จ: ${scrapReceipt} • IPFS: bafybeic...`;

        const tx = await liveContract.mintWithScrapDetails(
          buyerCustomerAddress,
          amountWei,
          currentMetalObj.name,
          BigInt(weightInt),
          noteText
        );
        notify('กำลังรอ Confirm Block บนบล็อกเชน...', 'info', 0);
        await tx.wait();

        setAdminLedgerStats((prev) => ({
          totalBuyThb: prev.totalBuyThb + estimatedBuyThb,
          totalSellThb: prev.totalSellThb + estimatedSellThb,
          totalWeightKg: prev.totalWeightKg + (currentMetalObj.unitType === 'weight' ? baseQty : 0)
        }));

        await refreshOnChainState(liveContract, liveAddress);
        triggerCelebration();
        if (buyerCustomerAddress.toLowerCase() === liveAddress.toLowerCase()) {
          notify(`Mint สำเร็จ! แต้ม +${calculatedPoints.toLocaleString()} CUP เข้ากระเป๋าของคุณใน MetaMask แล้ว ✨`, 'success', 5000);
        } else {
          notify(`Mint สำเร็จ! แต้ม +${calculatedPoints.toLocaleString()} CUP โอนเข้ากระเป๋าลูกค้า (${buyerCustomerAddress.substring(0, 6)}...${buyerCustomerAddress.substring(38)}) แล้ว ✨`, 'success', 6000);
        }
      } catch (err) {
        notify(parseWeb3Error(err), 'error', 6000);
      } finally {
        setIsProcessing(false);
        setIsWaitingMetaMask(false);
      }
      return;
    }

    notify(`กำลังบันทึก ${currentMetalObj.name} (${qtyLabel}) & Mint +${calculatedPoints.toLocaleString()} CUP...`, 'info', 0);
    setTimeout(() => {
      if (activeAccount.address.toLowerCase() === buyerCustomerAddress.toLowerCase()) {
        setBalance((prev) => prev + calculatedPoints);
      }

      setAdminLedgerStats((prev) => ({
        totalBuyThb: prev.totalBuyThb + estimatedBuyThb,
        totalSellThb: prev.totalSellThb + estimatedSellThb,
        totalWeightKg: prev.totalWeightKg + (currentMetalObj.unitType === 'weight' ? baseQty : 0)
      }));

      const newTx = {
        id: 'tx-' + Date.now(),
        hash: '0x' + Math.random().toString(16).substring(2, 26),
        type: 'MINT',
        title: `รับซื้อ ${currentMetalObj.name} ${qtyLabel}`,
        subtitle: `ยอดซื้อ ฿${estimatedBuyThb.toLocaleString()} • ใบเสร็จ: ${scrapReceipt} • IPFS: bafybeic...`,
        amount: +calculatedPoints,
        timestamp: 'เมื่อสักครู่',
        method: 'mintWithScrapDetails',
        iconType: currentMetalObj.iconType,
        isReward: false
      };
      setTxHistory((prev) => [newTx, ...prev]);
      setIsProcessing(false);
      triggerCelebration();
      notify(`สำเร็จ! Mint เหรียญ +${calculatedPoints.toLocaleString()} CUP ให้ลูกค้าเรียบร้อย ✨`, 'success');
    }, 1000);
  };

  // 1-Click Direct Mint on Localhost Node (Bypasses extension popup for fast testing)
  const handleDirectLocalMint = async () => {
    if (calculatedPoints <= 0 || baseQty <= 0) return notify('กรุณาระบุจำนวนหรือน้ำหนักที่มากกว่า 0', 'warning');
    if (!ethers.isAddress(buyerCustomerAddress)) return notify('Address กระเป๋าผู้ขายไม่ถูกต้อง', 'error');

    setIsProcessing(true);
    notify(`กำลังบันทึกและ Mint +${calculatedPoints.toLocaleString()} CUP ผ่าน Local Node ทันที...`, 'info', 0);

    try {
      const localProvider = new ethers.JsonRpcProvider('http://127.0.0.1:8545');
      const adminWallet = new ethers.Wallet('0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80', localProvider);
      const adminContract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, adminWallet);

      const amountWei = ethers.parseUnits(calculatedPoints.toString(), tokenDecimals);
      const weightInt =
        currentMetalObj.unitType === 'piece'
          ? Math.max(1, Math.round(baseQty))
          : Math.max(1, Math.round(baseQty * 1000));
      const noteText = `ยอดซื้อ ฿${estimatedBuyThb.toLocaleString()} • ใบเสร็จ: ${scrapReceipt} • IPFS: bafybeic...`;

      const tx = await adminContract.mintWithScrapDetails(
        buyerCustomerAddress,
        amountWei,
        currentMetalObj.name,
        BigInt(weightInt),
        noteText
      );
      await tx.wait();

      setAdminLedgerStats((prev) => ({
        totalBuyThb: prev.totalBuyThb + estimatedBuyThb,
        totalSellThb: prev.totalSellThb + estimatedSellThb,
        totalWeightKg: prev.totalWeightKg + (currentMetalObj.unitType === 'weight' ? baseQty : 0)
      }));

      await refreshOnChainState(contractInstance || adminContract, walletAddress);
      triggerCelebration();
      if (walletAddress && buyerCustomerAddress.toLowerCase() === walletAddress.toLowerCase()) {
        notify(`Mint ผ่าน Node สำเร็จ! แต้ม +${calculatedPoints.toLocaleString()} CUP เข้ากระเป๋าของคุณแล้ว ✨`, 'success', 5000);
      } else {
        notify(`Mint ผ่าน Node สำเร็จ! แต้ม +${calculatedPoints.toLocaleString()} CUP โอนเข้ากระเป๋าลูกค้า (${buyerCustomerAddress.substring(0, 6)}...${buyerCustomerAddress.substring(38)}) แล้ว ✨`, 'success', 5000);
      }
    } catch (err) {
      notify('ไม่สามารถ Mint ผ่าน Node: ' + parseWeb3Error(err), 'error', 6000);
    } finally {
      setIsProcessing(false);
      setIsWaitingMetaMask(false);
    }
  };

  // Action: Merchant Redeem
  const handleRedeem = async (e) => {
    e.preventDefault();
    const rewardObj = REWARD_ITEMS.find((r) => r.id === selectedReward) || REWARD_ITEMS[0];
    const isCustomCash = rewardObj.id === 'cash_custom';
    const pts = isCustomCash ? parseInt(customCashPoints) || 1000 : rewardObj.points;
    const cashValue = pts; // 1 CUP = 1 บาท

    if (!ethers.isAddress(redeemCustomerAddress)) return notify('Address ลูกค้าไม่ถูกต้อง', 'error');

    const rewardTitle = isCustomCash
      ? `โอนเงินสดแคชแบ็ก ฿${cashValue.toLocaleString()} บาท (หักแต้ม)`
      : `${rewardObj.name} (แลกของรางวัล)`;

    if (pts > displayedMerchantAllowance) {
      return notify(
        `ลูกค้าอนุมัติไว้เพียง ${displayedMerchantAllowance.toLocaleString()} CUP (ไม่พอสำหรับยอดนี้ที่ใช้ ${pts.toLocaleString()} CUP)`,
        'error'
      );
    }

    setIsProcessing(true);

    if (isWeb3Connected) {
      try {
        notify(`กรุณายืนยัน merchantRedeem (-${pts.toLocaleString()} CUP) ใน MetaMask...`, 'info', 0);
        const { liveContract, liveAddress } = await getLiveSignerAndContract();
        const amountWei = ethers.parseUnits(pts.toString(), tokenDecimals);
        const tx = await liveContract.merchantRedeem(redeemCustomerAddress, amountWei, rewardTitle);
        notify('กำลังรอ Confirm Block บนบล็อกเชน...', 'info', 0);
        await tx.wait();
        await refreshOnChainState(liveContract, liveAddress);
        triggerCelebration();
        notify(`แลก On-Chain สำเร็จ! หัก ${pts.toLocaleString()} CUP แล้ว 🎁`, 'success', 5000);
      } catch (err) {
        notify(parseWeb3Error(err), 'error', 6000);
      } finally {
        setIsProcessing(false);
      }
      return;
    }

    notify(`กำลังหักแต้ม (Redeem & Burn) และดำเนินการส่งมอบมูลค่า ฿${cashValue.toLocaleString()}...`, 'info', 0);
    setTimeout(() => {
      setCustomerAllowance((prev) => Math.max(0, prev - pts));
      if (activeAccount.address.toLowerCase() === redeemCustomerAddress.toLowerCase()) {
        setBalance((prev) => Math.max(0, prev - pts));
      }
      const newTx = {
        id: 'tx-' + Date.now(),
        hash: '0x' + Math.random().toString(16).substring(2, 26),
        type: 'REDEEM',
        title: rewardTitle,
        subtitle: `หักจาก: ${redeemCustomerAddress.substring(0, 6)}... • มูลค่า ฿${cashValue.toLocaleString()} • เผาแต้มแล้ว`,
        amount: -pts,
        timestamp: 'เมื่อสักครู่',
        method: 'merchantRedeem',
        iconType: rewardObj.id,
        isReward: true
      };
      setTxHistory((prev) => [newTx, ...prev]);
      setIsProcessing(false);
      triggerCelebration();
      notify(`แลกสำเร็จ! หัก ${pts.toLocaleString()} CUP และส่งมอบมูลค่า ฿${cashValue.toLocaleString()} เรียบร้อย 🎁`, 'success');
    }, 1000);
  };

  // 1-Click Direct Merchant Redeem on Localhost Node (Bypasses MetaMask popup)
  const handleDirectLocalRedeem = async () => {
    const rewardObj = REWARD_ITEMS.find((r) => r.id === selectedReward) || REWARD_ITEMS[0];
    const isCustomCash = rewardObj.id === 'cash_custom';
    const pts = isCustomCash ? parseInt(customCashPoints) || 1000 : rewardObj.points;
    const cashValue = pts;

    if (!ethers.isAddress(redeemCustomerAddress)) return notify('Address ลูกค้าไม่ถูกต้อง', 'error');

    const rewardTitle = isCustomCash
      ? `โอนเงินสดแคชแบ็ก ฿${cashValue.toLocaleString()} บาท (หักแต้ม)`
      : `${rewardObj.name} (แลกของรางวัล)`;

    setIsProcessing(true);
    notify(`กำลังหักแต้ม -${pts.toLocaleString()} CUP ผ่าน Local Node ทันที...`, 'info', 0);

    try {
      const localProvider = new ethers.JsonRpcProvider('http://127.0.0.1:8545');
      // Admin wallet (#0) has MERCHANT_ROLE and DEFAULT_ADMIN_ROLE
      const merchantWallet = new ethers.Wallet('0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80', localProvider);
      const merchantContract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, merchantWallet);

      const amountWei = ethers.parseUnits(pts.toString(), tokenDecimals);
      const currentAllow = await merchantContract.allowance(redeemCustomerAddress, merchantWallet.address);

      // If allowance is not enough, auto-approve from customer if test account
      if (currentAllow < amountWei) {
        if (redeemCustomerAddress.toLowerCase() === HARDHAT_TEST_ACCOUNTS.customer.toLowerCase()) {
          const customerWallet = new ethers.Wallet('0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d', localProvider);
          const custContract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, customerWallet);
          await (await custContract.approve(merchantWallet.address, ethers.parseUnits('1000000', tokenDecimals))).wait();
        }
      }

      const tx = await merchantContract.merchantRedeem(redeemCustomerAddress, amountWei, rewardTitle);
      await tx.wait();

      await refreshOnChainState(contractInstance || merchantContract, walletAddress);
      triggerCelebration();
      notify(`หักแต้ม -${pts.toLocaleString()} CUP และส่งมอบมูลค่า ฿${cashValue.toLocaleString()} สำเร็จ! 🎁`, 'success', 5000);
    } catch (err) {
      notify('ไม่สามารถหักแต้มผ่าน Node: ' + parseWeb3Error(err), 'error', 6000);
    } finally {
      setIsProcessing(false);
    }
  };

  // Action: Admin Toggle Pause
  const handleTogglePause = async () => {
    if (isWeb3Connected) {
      if (!onChainRoles.admin) {
        return notify('เฉพาะกระเป๋า Admin (0xAa90...691c8) เท่านั้นที่มีสิทธิ์สั่ง Pause / หยุดระบบฉุกเฉิน', 'warning', 5000);
      }
      try {
        setIsProcessing(true);
        notify('กรุณายืนยันคำสั่ง Pause/Unpause ใน MetaMask...', 'info', 0);
        const { liveContract, liveAddress } = await getLiveSignerAndContract();
        const tx = await liveContract.setPaused(!isPaused);
        await tx.wait();
        await refreshOnChainState(liveContract, liveAddress);
        notify(!isPaused ? 'สั่งหยุดระบบ On-Chain เรียบร้อย (Paused)' : 'เปิดใช้งานระบบ On-Chain เรียบร้อย', 'success');
      } catch (err) {
        notify(parseWeb3Error(err), 'error', 5000);
      } finally {
        setIsProcessing(false);
      }
      return;
    }
    setIsPaused(!isPaused);
    notify(isPaused ? 'เปิดใช้งานระบบเรียบร้อย (Unpaused)' : 'หยุดระบบฉุกเฉินแล้ว (Paused)', isPaused ? 'success' : 'warning');
  };

  // Action: Admin Grant Role to any MetaMask wallet
  const handleGrantRole = async (e) => {
    e.preventDefault();
    if (!isWeb3Connected) {
      return notify('กรุณาเชื่อมต่อ MetaMask บัญชี Admin ก่อนจึงจะมอบสิทธิ์ On-Chain ได้', 'warning');
    }
    if (!onChainRoles.admin) {
      return notify('เฉพาะกระเป๋า Admin (0xAa90...691c8) เท่านั้นที่มีสิทธิ์มอบสิทธิ์ On-Chain', 'warning', 5000);
    }
    if (!ethers.isAddress(grantTargetAddress)) {
      return notify('Address ปลายทางไม่ถูกต้อง กรุณาตรวจสอบให้แน่ใจว่าไม่มีตัวอักษรหรือเครื่องหมายผิดปกติ', 'error');
    }
    try {
      setIsProcessing(true);
      notify(`กำลังมอบสิทธิ์ ${grantRoleType} ให้กระเป๋าปลายทาง...`, 'info', 0);
      const { liveContract, liveAddress } = await getLiveSignerAndContract();
      const roleHash =
        grantRoleType === 'MINTER_ROLE'
          ? await liveContract.MINTER_ROLE()
          : await liveContract.MERCHANT_ROLE();
      const tx = await liveContract.grantRole(roleHash, grantTargetAddress);
      await tx.wait();
      await refreshOnChainState(liveContract, liveAddress);
      notify(`มอบสิทธิ์ ${grantRoleType} สำเร็จเรียบร้อย!`, 'success', 4000);
    } catch (err) {
      notify(parseWeb3Error(err), 'error', 5000);
    } finally {
      setIsProcessing(false);
    }
  };

  // 1-Click Test Helper: Grant MINTER, MERCHANT, and ADMIN roles + send gas ETH on Localhost
  const handleAutoGrantLocalRoles = async () => {
    if (!walletAddress) return notify('กรุณาเชื่อมต่อ MetaMask ก่อน', 'warning');
    try {
      setIsProcessing(true);
      notify('กำลังมอบสิทธิ์ MINTER & เติม Test ETH ให้กระเป๋าของคุณ...', 'info', 0);
      const localProvider = new ethers.JsonRpcProvider('http://127.0.0.1:8545');
      const adminWallet = new ethers.Wallet('0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80', localProvider);
      const adminContract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, adminWallet);

      const minterRole = await adminContract.MINTER_ROLE();
      const merchantRole = await adminContract.MERCHANT_ROLE();
      const adminRole = await adminContract.DEFAULT_ADMIN_ROLE();

      // Check ETH balance
      const ethBal = await localProvider.getBalance(walletAddress);
      if (ethBal < ethers.parseEther('5')) {
        const txEth = await adminWallet.sendTransaction({
          to: walletAddress,
          value: ethers.parseEther('50')
        });
        await txEth.wait();
      }

      await (await adminContract.grantRole(minterRole, walletAddress)).wait();
      await (await adminContract.grantRole(merchantRole, walletAddress)).wait();
      await (await adminContract.grantRole(adminRole, walletAddress)).wait();

      await refreshOnChainState(contractInstance || adminContract, walletAddress);
      triggerCelebration();
      notify('ปลดล็อกสิทธิ์ MINTER / MERCHANT สำเร็จ และเติม 50 Test ETH เรียบร้อย! 🚀', 'success', 5000);
    } catch (err) {
      notify('ไม่สามารถขอสิทธิ์อัตโนมัติ: ' + parseWeb3Error(err), 'error', 5000);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafbfc] text-slate-800 font-sans selection:bg-amber-100 selection:text-amber-900 pb-20">
      {/* Celebration Banner */}
      {showCelebration && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
          <div className="bg-white/95 backdrop-blur-md border border-amber-200 px-8 py-5 rounded-3xl shadow-2xl flex items-center space-x-4 animate-bounce">
            <NongCopper size={65} mood="wink" />
            <div>
              <div className="text-base font-bold text-slate-900">สำเร็จเรียบร้อย! 🎉</div>
              <div className="text-xs text-amber-700 font-medium">บันทึกธุรกรรมลงในบล็อกเชนถาวรแล้ว</div>
            </div>
          </div>
        </div>
      )}

      {/* MetaMask Waiting Confirmation Modal */}
      {isWaitingMetaMask && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-100 text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-3xl bg-amber-50 border border-amber-200 flex items-center justify-center">
              <Wallet className="w-8 h-8 text-amber-600 animate-bounce" />
            </div>
            <div>
              <h4 className="font-extrabold text-slate-900 text-base">กำลังรอคุณกด "Confirm" ใน MetaMask</h4>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                กรุณาเปิดหน้าต่าง <strong>MetaMask</strong> แล้วกดยืนยันการทำรายการ<br />
                <span className="text-[11px] text-amber-700">
                  (หากหน้าต่างไม่เด้งขึ้นมาอัตโนมัติ ให้คลิกที่ <strong>ไอคอนจิ้งจอกมุมขวาบน</strong> ของเบราว์เซอร์)
                </span>
              </p>
            </div>

            <div className="p-3.5 bg-amber-50/80 rounded-2xl border border-amber-200 text-left text-[11px] text-amber-900 space-y-1">
              <div className="font-bold">💡 หาก MetaMask แจ้งเตือนเรื่อง Nonce (เช่น Nonce too high):</div>
              <div>
                ให้ไปที่ <strong>MetaMask &gt; Settings (การตั้งค่า) &gt; Advanced (ขั้นสูง) &gt; Clear activity tab data</strong> แล้วลองใหม่อีกครั้ง
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsWaitingMetaMask(false);
                  setIsProcessing(false);
                  notify('ยกเลิกการรอการยืนยัน', 'info', 2000);
                }}
                className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
              >
                ยกเลิกการรอ
              </button>
              {chainId === 31337 && (
                <button
                  type="button"
                  onClick={() => {
                    setIsWaitingMetaMask(false);
                    handleDirectLocalMint();
                  }}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-xs font-bold text-white shadow-sm"
                >
                  ⚡ ส่งตรงผ่าน Node
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modern Clean White Header */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <NongCopper size={44} mood="happy" className="hover:rotate-6 transition-transform cursor-pointer" />
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-xl tracking-tight text-slate-900">CopperPoint</span>
                <span className="text-[10px] font-bold tracking-wide uppercase px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200/80">
                  CUP ERC-20
                </span>
                {isPaused && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-200 animate-pulse">
                    หยุดฉุกเฉิน
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400 font-medium">
                ระบบสะสมแต้มซื้อขายทองแดง เม็ดเงิน บอร์ดอิเล็กทรอนิกส์ & อะไหล่ไฟฟ้า
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="hidden sm:block text-right mr-1">
              <div className="text-xs font-semibold text-slate-700 flex items-center justify-end space-x-1.5">
                <span>
                  {isWeb3Connected
                    ? `MetaMask (${chainId === 31337 ? 'Hardhat #31337' : chainId === 11155111 ? 'Sepolia' : `Chain ${chainId}`})`
                    : activeAccount.name}
                </span>
                <span
                  className={`w-2 h-2 rounded-full inline-block ${
                    isWeb3Connected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'
                  }`}
                />
              </div>
              <div
                onClick={isWeb3Connected ? switchMetaMaskAccount : undefined}
                className={`text-[11px] font-mono ${
                  isWeb3Connected ? 'text-amber-600 hover:text-amber-700 cursor-pointer underline decoration-dotted' : 'text-slate-400'
                }`}
                title={isWeb3Connected ? 'คลิกเพื่อสลับกระเป๋า MetaMask' : undefined}
              >
                {isWeb3Connected
                  ? `${walletAddress.substring(0, 6)}...${walletAddress.substring(38)} (คลิกสลับ)`
                  : `${activeAccount.address.substring(0, 6)}...${activeAccount.address.substring(38)} (Demo)`}
              </div>
            </div>

            {isWeb3Connected && (
              <>
                <button
                  type="button"
                  onClick={switchMetaMaskAccount}
                  title="เปิดหน้าต่างเลือก/สลับบัญชีกระเป๋าใน MetaMask"
                  className="flex items-center space-x-1 px-2.5 py-1.5 rounded-full text-[11px] font-semibold bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 transition"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">สลับบัญชี</span>
                </button>
                <button
                  type="button"
                  onClick={addCupTokenToMetaMask}
                  title="เพิ่มเหรียญ CUP เข้าแสดงใน MetaMask"
                  className="hidden md:flex items-center space-x-1 px-2.5 py-1.5 rounded-full text-[11px] font-semibold bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 transition"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>เพิ่ม CUP</span>
                </button>
                <button
                  type="button"
                  onClick={() => refreshOnChainState(contractInstance, walletAddress)}
                  title="รีเฟรชข้อมูล On-Chain"
                  className="p-1.5 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 transition"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </>
            )}

            <button
              onClick={isWeb3Connected ? disconnectMetaMask : connectMetaMask}
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                isWeb3Connected
                  ? 'bg-emerald-50 hover:bg-emerald-100 border-emerald-200 text-emerald-700'
                  : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700 shadow-sm'
              }`}
            >
              {isWeb3Connected ? (
                <>
                  <LogOut className="w-3.5 h-3.5 text-emerald-600" />
                  <span>On-Chain (สลับ Demo)</span>
                </>
              ) : (
                <>
                  <Wallet className="w-3.5 h-3.5 text-amber-600" />
                  <span>ต่อ MetaMask</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>


      {/* Main Content Area */}
      <main className="max-w-5xl mx-auto px-4 mt-6">
        {/* Floating Top Notification Toast */}
        {statusMsg.text && (
          <div className="fixed top-20 right-4 sm:right-8 z-50 max-w-sm w-full animate-bounce-short">
            <div
              className={`p-4 rounded-2xl border text-xs font-semibold flex items-center space-x-3 shadow-2xl backdrop-blur-md ${
                statusMsg.type === 'error'
                  ? 'bg-rose-50/95 border-rose-300 text-rose-900 shadow-rose-900/10'
                  : statusMsg.type === 'warning'
                  ? 'bg-amber-50/95 border-amber-300 text-amber-900 shadow-amber-900/10'
                  : statusMsg.type === 'success'
                  ? 'bg-emerald-50/95 border-emerald-300 text-emerald-900 shadow-emerald-900/10'
                  : 'bg-sky-50/95 border-sky-300 text-sky-900 shadow-sky-900/10'
              }`}
            >
              {statusMsg.type === 'error' ? (
                <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-600" />
              ) : (
                <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-600" />
              )}
              <span className="flex-1">{statusMsg.text}</span>
            </div>
          </div>
        )}

        {!isWeb3Connected ? (
          <div className="max-w-xl mx-auto px-4 py-16 text-center">
            <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-sm space-y-6">
              <div className="w-20 h-20 mx-auto rounded-3xl bg-amber-50 border border-amber-200/80 flex items-center justify-center shadow-inner">
                <NongCopper size={54} mood="happy" />
              </div>

              <div>
                <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">เริ่มต้นใช้งาน CopperPoint</h2>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  เชื่อมต่อกระเป๋า <strong>MetaMask</strong> บนเครือข่าย <strong>Sepolia Testnet</strong> เพื่อดูแต้มและประวัติของคุณ
                </p>
              </div>

              <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-100 text-left text-xs space-y-1.5 text-slate-600">
                <div className="flex items-center space-x-2 font-bold text-slate-800">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>ระบบตรวจจับบทบาทอัตโนมัติบนบล็อกเชน</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-normal">
                  Smart Contract จะตรวจสอบสิทธิ์ของคุณอัตโนมัติ (ลูกค้าผู้ขาย, พนักงานชั่ง MINTER, หรือ แอดมิน)
                </p>
              </div>

              <button
                type="button"
                onClick={connectMetaMask}
                className="w-full py-3.5 px-6 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm flex items-center justify-center space-x-2.5 shadow-md shadow-emerald-900/10 transition-all hover:scale-[1.01]"
              >
                <Wallet className="w-4 h-4 text-amber-300" />
                <span>เชื่อมต่อ MetaMask</span>
              </button>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-center space-x-4 text-[11px] text-slate-400">
                <button
                  type="button"
                  onClick={() => {
                    setIsWeb3Connected(true);
                    notify('เข้าสู่โหมดทดลองดูหน้าจอจำลอง (Preview Mode)', 'info', 3000);
                  }}
                  className="hover:text-slate-600 underline font-medium"
                >
                  หรือทดลองดูหน้าจอในโหมดจำลอง (Demo Preview)
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
        {/* Minimal Hero Card: Balance & Mascot Greeting */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm relative overflow-hidden mb-8">
          <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-80 h-80 bg-gradient-to-br from-amber-100/50 via-orange-50/40 to-transparent rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start sm:items-center space-x-5">
              <NongCopper size={88} mood="happy" className="animate-pulse flex-shrink-0" />
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-slate-800">
                    {isWeb3Connected ? `กระเป๋า MetaMask: ${walletAddress.substring(0, 6)}...${walletAddress.substring(38)}` : activeAccount.name}
                  </span>
                  <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full border ${getTierInfo(balance).color}`}>
                    {getTierInfo(balance).name}
                  </span>
                  <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-full flex items-center space-x-1">
                    <Check className="w-2.5 h-2.5" />
                    <span>{isWeb3Connected ? 'On-Chain Live' : 'KYC ผ่านแล้ว (Demo)'}</span>
                  </span>
                </div>
                <div className="flex items-baseline space-x-3">
                  <span className="text-4xl sm:text-5xl font-extrabold font-mono tracking-tight text-slate-900">
                    {balance.toLocaleString()}
                  </span>
                  <div className="flex flex-col">
                    <span className="text-lg font-bold text-amber-600 tracking-tight">CUP</span>
                    <span className="text-xs text-slate-400 -mt-1">แต้มคงเหลือ</span>
                  </div>
                </div>
                <p className="text-xs text-slate-400 mt-2">
                  ทุกๆ 20 บาทของยอดขาย = 1 CUP • แลกของรางวัล/เงินสด 1 CUP = 1 บาท (ฟรีค่า Gas ERC-4337)
                </p>
              </div>
            </div>

            <div className="flex sm:flex-col gap-2.5">
              <div className="flex-1 bg-slate-50/80 border border-slate-100 rounded-2xl px-4 py-3">
                <div className="text-[11px] font-medium text-slate-400">วงเงินที่อนุมัติให้ร้านค้า</div>
                <div className="text-base font-bold font-mono text-slate-800 mt-0.5">
                  {customerAllowance.toLocaleString()} CUP
                </div>
              </div>
              <div className="flex-1 bg-slate-50/80 border border-slate-100 rounded-2xl px-4 py-3">
                <div className="text-[11px] font-medium text-slate-400">จำนวนสินค้าในระบบ</div>
                <div className="text-xs font-semibold text-slate-700 mt-0.5">
                  {SCRAP_METALS.length} รายการ (ครบ 6 หมวด)
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Minimal Navigation Tabs */}
        <div className="flex space-x-2 border-b border-slate-100 pb-2 mb-8 overflow-x-auto">
          {[
            { id: 'customer', label: 'ผู้ขาย / ใบราคา & แลกรางวัล', icon: Coins },
            { id: 'minter', label: 'พนักงานชั่ง & ออกแต้ม (Mint)', icon: Scale },
            { id: 'admin', label: 'ผู้ดูแล & สรุปกำไร (Admin)', icon: ShieldCheck }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-5 py-2.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ============================================================== */}
        {/* TAB 1: CUSTOMER VIEW & COMPLETE PRICE BOARD */}
        {/* ============================================================== */}
        {activeTab === 'customer' && (
          <div className="space-y-6">
            {/* Full Catalog with Search & 6 Category Filters */}
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    ใบราคารับซื้อ & แต้มสะสมวันนี้ ({SCRAP_METALS.length} รายการ) 📋
                  </h3>
                  <p className="text-xs text-slate-400">
                    ทุกยอดขาย 20 บาท รับ 1 CUP (1 CUP มีมูลค่าแลกรางวัล = 1 บาท)
                  </p>
                </div>

                {/* Search Input */}
                <div className="relative w-full md:w-64">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="ค้นหา เช่น เม็ดเงิน, แรม, เบรคเกอร์..."
                    className="w-full text-xs pl-9 pr-3.5 py-2 rounded-full border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Category Filter Pills */}
              <div className="flex flex-wrap gap-1.5 pb-2 border-b border-slate-100">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setMetalFilter(cat.id)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition ${
                      metalFilter === cat.id
                        ? 'bg-slate-900 text-white shadow-sm'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200/60'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Product Cards Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 max-h-[420px] overflow-y-auto pr-1">
                {filterItems(metalFilter, searchQuery).map((item) => {
                  const ptsPerUnit = (item.buyPrice / THB_PER_POINT).toFixed(1).replace(/\.0$/, '');
                  return (
                    <div
                      key={item.id}
                      onClick={() => {
                        handleSelectMetal(item);
                        setActiveTab('minter');
                      }}
                      className="p-3.5 rounded-2xl border border-slate-100 bg-slate-50/40 hover:bg-white hover:border-amber-300 hover:shadow-sm transition-all text-center flex flex-col items-center justify-between cursor-pointer group"
                    >
                      <div className="group-hover:scale-105 transition-transform">
                        <CartoonScrapIcon type={item.iconType} size={46} />
                      </div>
                      <div className="mt-2 w-full">
                        <span className="text-[9px] font-bold text-amber-800 bg-amber-100/70 px-2 py-0.5 rounded-full inline-block mb-1">
                          {item.badge}
                        </span>
                        <div className="text-xs font-bold text-slate-800 line-clamp-1">{item.name}</div>
                        <div className="text-[11px] font-extrabold text-emerald-700 font-mono mt-0.5">
                          ฿{item.buyPrice.toLocaleString()} / {item.unitType === 'piece' ? 'เครื่อง' : 'กก.'}
                        </div>
                        <div className="text-[10px] text-amber-600 font-semibold font-mono">
                          +{ptsPerUnit} CUP / {item.unitType === 'piece' ? 'เครื่อง' : 'กก.'}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 1-Click Direct Redeem & Burn (No Approve Needed) */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
                <div>
                  <h4 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                    <Flame className="w-5 h-5 text-orange-500" />
                    <span>แลกเงินสดแคชแบ็ก & ของรางวัลโรงหลอม (1-Click Burn)</span>
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    1 CUP = 1 บาท • ผู้ขายทำรายการเอง หักแต้มตรงจากกระเป๋าคุณในคลิกเดียว (ไม่ต้องขอ Approve ร้านค้า)
                  </p>
                </div>
                <div className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-xs font-semibold w-fit">
                  ✓ ไม่ต้อง Approve ร้านค้า (1-Click)
                </div>
              </div>

              {/* Toggle Redeem Type: Cash vs Rewards */}
              <div className="flex space-x-2 p-1 bg-slate-100 rounded-2xl w-fit text-xs font-bold">
                <button
                  type="button"
                  onClick={() => {
                    setCustomerRedeemType('cash');
                    setBurnReason('โอนเงินสดแคชแบ็กเข้าบัญชี');
                  }}
                  className={`px-4 py-2 rounded-xl transition ${
                    customerRedeemType === 'cash'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  💵 แลกเงินสดแคชแบ็ก (1 CUP = 1 บาท)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCustomerRedeemType('reward');
                    const firstReward = REWARD_ITEMS.find((r) => r.id !== 'cash_custom') || REWARD_ITEMS[1];
                    setCustomerSelectedReward(firstReward.id);
                    setBurnAmount(firstReward.points.toString());
                    setBurnReason(`${firstReward.name} (แลกของรางวัล)`);
                  }}
                  className={`px-4 py-2 rounded-xl transition ${
                    customerRedeemType === 'reward'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  🎁 แลกของรางวัล & อุปกรณ์โรงหลอม
                </button>
              </div>

              <form onSubmit={handleBurnSelf} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Side: Choices */}
                <div className="lg:col-span-7 space-y-4">
                  {customerRedeemType === 'cash' ? (
                    <div className="p-5 bg-gradient-to-br from-amber-50/60 to-orange-50/40 rounded-3xl border border-amber-200/80 space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-amber-950 mb-1.5">
                          ระบุจำนวนแต้ม CUP ที่ต้องการแลกเป็นเงินสด:
                        </label>
                        <div className="flex space-x-2">
                          <input
                            type="number"
                            min="1"
                            max={balance}
                            value={burnAmount}
                            onChange={(e) => {
                              const val = e.target.value;
                              setBurnAmount(val);
                              setBurnReason(`โอนเงินสดแคชแบ็ก ฿${(parseInt(val) || 0).toLocaleString()} บาท`);
                            }}
                            className="w-full text-xl font-mono font-extrabold px-4 py-2.5 rounded-xl border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500/20 bg-white text-amber-950"
                            placeholder={`สูงสุด ${balance.toLocaleString()} CUP`}
                          />
                          <span className="text-xs font-bold text-amber-900 bg-amber-200/70 px-4 py-2 rounded-xl flex items-center whitespace-nowrap">
                            CUP
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1.5">
                        {[
                          { label: '5,000 บ.', val: 5000 },
                          { label: '15,000 บ.', val: 15000 },
                          { label: '50,000 บ.', val: 50000 },
                          { label: '100,000 บ.', val: 100000 },
                          { label: 'ทั้งหมด (Max)', val: balance }
                        ].map((bBtn, bIdx) => (
                          <button
                            key={bIdx}
                            type="button"
                            onClick={() => {
                              setBurnAmount(bBtn.val.toString());
                              setBurnReason(`โอนเงินสดแคชแบ็ก ฿${bBtn.val.toLocaleString()} บาท`);
                            }}
                            className="px-3 py-1 rounded-xl text-xs font-semibold bg-white hover:bg-amber-100 text-amber-900 border border-amber-200 shadow-xs transition"
                          >
                            {bBtn.label}
                          </button>
                        ))}
                      </div>

                      <div className="p-3 bg-white/90 rounded-2xl border border-amber-200/80 flex items-center justify-between text-xs font-bold">
                        <span className="text-slate-600">เงินสดที่จะได้รับ (โอนพร้อมเพย์):</span>
                        <span className="text-base text-emerald-700 font-mono font-extrabold">
                          ฿{(parseInt(burnAmount) || 0).toLocaleString()} บาท
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
                      {REWARD_ITEMS.filter((item) => item.id !== 'cash_custom').map((reward) => (
                        <label
                          key={reward.id}
                          className={`flex items-center justify-between p-3.5 rounded-2xl border cursor-pointer transition-all ${
                            customerSelectedReward === reward.id
                              ? 'bg-amber-50/70 border-amber-400 ring-2 ring-amber-400/20 shadow-sm'
                              : 'bg-white border-slate-200/80 hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center space-x-3 min-w-0 pr-2">
                            <input
                              type="radio"
                              name="customerReward"
                              value={reward.id}
                              checked={customerSelectedReward === reward.id}
                              onChange={() => {
                                setCustomerSelectedReward(reward.id);
                                setBurnAmount(reward.points.toString());
                                setBurnReason(`${reward.name} (แลกของรางวัล)`);
                              }}
                              className="text-amber-600 focus:ring-amber-500"
                            />
                            <CartoonRewardIcon id={reward.id} size={36} />
                            <div className="min-w-0">
                              <div className="text-xs font-bold text-slate-800 line-clamp-1">{reward.name}</div>
                              <div className="text-[10px] text-slate-400 font-medium">
                                {reward.category} • มูลค่า ฿{reward.cashValueThb.toLocaleString()} บาท
                              </div>
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <span className="text-xs font-bold font-mono text-amber-700">
                              {reward.points.toLocaleString()} CUP
                            </span>
                          </div>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                {/* Right Side: Summary Card & Action Buttons */}
                <div className="lg:col-span-5 bg-slate-50/80 border border-slate-200/70 rounded-3xl p-6 flex flex-col justify-between">
                  <div className="space-y-4">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      สรุปรายการแลกแต้ม
                    </h5>

                    <div className="bg-white p-4 rounded-2xl border border-slate-200/80 space-y-2.5 text-xs">
                      <div className="flex justify-between items-start gap-2">
                        <span className="text-slate-500">รายการ:</span>
                        <span className="font-bold text-slate-900 text-right">{burnReason || 'แลกเงินสดแคชแบ็ก'}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500">แต้มที่ใช้:</span>
                        <span className="font-mono font-bold text-rose-600 text-sm">
                          -{(parseInt(burnAmount) || 0).toLocaleString()} CUP
                        </span>
                      </div>
                      <div className="flex justify-between items-center border-t border-slate-100 pt-2">
                        <span className="text-slate-500">แต้มคงเหลือหลังแลก:</span>
                        <span className="font-mono font-bold text-slate-700">
                          {Math.max(0, balance - (parseInt(burnAmount) || 0)).toLocaleString()} CUP
                        </span>
                      </div>
                    </div>

                    <div className="p-3 bg-emerald-50/80 rounded-2xl border border-emerald-200/70 text-[11px] text-emerald-900 leading-relaxed space-y-1">
                      <div className="font-bold flex items-center space-x-1">
                        <span>✨ แลกทันทีใน 1 คลิก:</span>
                      </div>
                      <div>
                        ระบบจะตัดแต้มจากกระเป๋าคุณและบันทึกประวัติลงบล็อกเชนโดยตรง ไม่ต้องกดยินยอม Approve ร้านค้าใดๆ ทั้งสิ้น
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 space-y-2">
                    <button
                      type="submit"
                      disabled={isProcessing || balance <= 0 || (parseInt(burnAmount) || 0) <= 0 || (parseInt(burnAmount) || 0) > balance}
                      className="w-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white text-xs font-bold py-3.5 px-4 rounded-2xl transition shadow-md"
                    >
                      {isProcessing ? 'กำลังส่งคำขอลงบล็อกเชน...' : 'ยืนยันแลกแต้ม (1-Click Redeem)'}
                    </button>

                    {isWeb3Connected && chainId === 31337 && (
                      <button
                        type="button"
                        onClick={handleDirectLocalBurnSelf}
                        disabled={isProcessing || balance <= 0 || (parseInt(burnAmount) || 0) <= 0 || (parseInt(burnAmount) || 0) > balance}
                        className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-slate-300 text-white text-xs font-semibold py-2.5 px-4 rounded-2xl transition flex items-center justify-center space-x-1.5 shadow-sm shadow-amber-600/20"
                      >
                        <span>⚡ แลกตรงผ่าน Local Node (Instant 1-Click)</span>
                      </button>
                    )}
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 2: STAFF (MINTER) VIEW WITH MULTI-UNIT SCALE & SEARCH */}
        {/* ============================================================== */}
        {activeTab === 'minter' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                  <Scale className="w-5 h-5 text-amber-600" />
                  <span>บันทึกชั่งเศษโลหะ / E-Waste และ Mint แต้ม</span>
                </h3>
                <p className="text-xs text-slate-400">
                  รองรับตั้งแต่หน่วยกรัม (เม็ดเงิน/แรม/CPU) จนถึงหลักตัน (ทองแดง/เหล็ก/บอร์ด)
                </p>
              </div>

              <div className="bg-emerald-50/80 border border-emerald-200/80 rounded-2xl px-4 py-2 text-right">
                <div className="text-[11px] font-semibold text-emerald-800">สเกลระดับอุตสาหกรรม / โรงหลอม</div>
                <div className="text-sm font-bold font-mono text-emerald-900 flex items-center justify-end space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>ไม่จำกัดเพดานโควตา (Unlimited)</span>
                </div>
              </div>
            </div>

            {/* Role & Gas Status Banner for Minter View */}
            {isWeb3Connected && (
              <div
                className={`p-4 rounded-2xl border text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  onChainRoles.minter
                    ? 'bg-emerald-50/60 border-emerald-200 text-emerald-900'
                    : 'bg-amber-50 border-amber-300 text-amber-900'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      onChainRoles.minter ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'
                    }`}
                  />
                  <div>
                    <div className="font-bold">
                      {onChainRoles.minter
                        ? '✓ กระเป๋าของคุณได้รับสิทธิ์ MINTER_ROLE เรียบร้อยแล้ว'
                        : '⚠️ กระเป๋านี้ยังไม่มีสิทธิ์ MINTER_ROLE (พนักงานชั่ง)'}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {onChainRoles.minter
                        ? 'คุณสามารถบันทึกชั่งและยิง Mint เหรียญลงในบล็อกเชนได้ทันที'
                        : 'หากยังไม่มีสิทธิ์ ธุรกรรมจะ Revert กรุณากดปุ่มปลดล็อกเพื่อรับสิทธิ์และ Gas ETH ฟรี'}
                    </div>
                  </div>
                </div>

                {!onChainRoles.minter && chainId === 31337 && (
                  <button
                    type="button"
                    onClick={handleAutoGrantLocalRoles}
                    disabled={isProcessing}
                    className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:bg-slate-300 text-white font-bold text-xs whitespace-nowrap shadow-sm shadow-amber-600/20"
                  >
                    ⚡ รับสิทธิ์ Minter + 50 Test ETH
                  </button>
                )}
              </div>
            )}

            <form onSubmit={handleMint} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column: Form Controls (7 cols) */}
              <div className="lg:col-span-7 space-y-5">
                {/* Receiver Customer Address & Live Balance */}
                <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <label className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
                      <span>กระเป๋าผู้ขายที่จะได้รับแต้ม CUP</span>
                    </label>
                    <span className="text-[11px] font-semibold text-amber-800 bg-amber-100/80 border border-amber-200 px-2.5 py-0.5 rounded-full w-fit">
                      ยอดปัจจุบัน: <strong>{buyerCustomerBalance.toLocaleString()} CUP</strong>
                    </span>
                  </div>

                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={buyerCustomerAddress}
                      onChange={(e) => setBuyerCustomerAddress(e.target.value)}
                      placeholder="0x..."
                      className="w-full text-xs font-mono px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                    />
                  </div>

                  {/* Quick Select Receiver Buttons */}
                  <div className="flex flex-wrap items-center gap-2 pt-0.5">
                    {isWeb3Connected && walletAddress && (
                      <button
                        type="button"
                        onClick={() => setBuyerCustomerAddress(walletAddress)}
                        className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition flex items-center space-x-1.5 ${
                          buyerCustomerAddress.toLowerCase() === walletAddress.toLowerCase()
                            ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                            : 'bg-white hover:bg-amber-50 text-amber-900 border-amber-200'
                        }`}
                      >
                        <Check className={`w-3.5 h-3.5 ${buyerCustomerAddress.toLowerCase() === walletAddress.toLowerCase() ? 'inline' : 'hidden'}`} />
                        <span>โอนเข้ากระเป๋าฉัน ({walletAddress.substring(0, 6)}...{walletAddress.substring(38)})</span>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setBuyerCustomerAddress(DEMO_ACCOUNTS[0].address)}
                      className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition flex items-center space-x-1.5 ${
                        buyerCustomerAddress.toLowerCase() === DEMO_ACCOUNTS[0].address.toLowerCase()
                          ? 'bg-slate-800 text-white border-slate-800 shadow-sm'
                          : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      <Check className={`w-3.5 h-3.5 ${buyerCustomerAddress.toLowerCase() === DEMO_ACCOUNTS[0].address.toLowerCase() ? 'inline' : 'hidden'}`} />
                      <span>โอนเข้ากระเป๋าลูกค้า ({DEMO_ACCOUNTS[0].address.substring(0, 6)}...{DEMO_ACCOUNTS[0].address.substring(38)})</span>
                    </button>
                  </div>

                  {/* Destination Explanatory Pill */}
                  <div className="text-[11px] leading-relaxed pt-1 border-t border-slate-200/60">
                    {isWeb3Connected && walletAddress && buyerCustomerAddress.toLowerCase() === walletAddress.toLowerCase() ? (
                      <span className="text-emerald-700 font-semibold flex items-center space-x-1">
                        <span>🟢</span>
                        <span>แต้ม +{calculatedPoints.toLocaleString()} CUP จะวิ่งเข้ากระเป๋า MetaMask ของคุณโดยตรง!</span>
                      </span>
                    ) : (
                      <span className="text-amber-800 font-medium">
                        💡 แต้ม +{calculatedPoints.toLocaleString()} CUP จะโอนเข้ากระเป๋าลูกค้า <strong>{buyerCustomerAddress.substring(0, 6)}...{buyerCustomerAddress.substring(38)}</strong> (หากต้องการให้เข้ากระเป๋า MetaMask ของตัวเอง ให้คลิกปุ่ม <strong>"โอนเข้ากระเป๋าฉัน"</strong> ด้านบนครับ)
                      </span>
                    )}
                  </div>
                </div>

                {/* Search & Category Tabs for Staff */}
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <label className="text-xs font-semibold text-slate-700">
                      เลือกสินค้าที่นำมาชั่ง ({filterItems(staffFilter, staffSearch).length} รายการ)
                    </label>
                    <div className="relative w-full sm:w-52">
                      <Search className="w-3 h-3 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={staffSearch}
                        onChange={(e) => setStaffSearch(e.target.value)}
                        placeholder="ค้นหาชื่อสินค้า..."
                        className="w-full text-[11px] pl-8 pr-3 py-1.5 rounded-full border border-slate-200 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  {/* Staff Category Filter */}
                  <div className="flex flex-wrap gap-1">
                    {CATEGORIES.map((cat) => (
                      <button
                        type="button"
                        key={cat.id}
                        onClick={() => setStaffFilter(cat.id)}
                        className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition ${
                          staffFilter === cat.id
                            ? 'bg-amber-600 text-white shadow-sm'
                            : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200/70'
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>

                  {/* Product Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-[250px] overflow-y-auto pr-1">
                    {filterItems(staffFilter, staffSearch).map((metal) => (
                      <button
                        type="button"
                        key={metal.id}
                        onClick={() => handleSelectMetal(metal)}
                        className={`p-2.5 rounded-2xl border text-left transition-all flex items-center space-x-2 ${
                          selectedMetal === metal.id
                            ? 'bg-amber-50/80 border-amber-500 ring-2 ring-amber-400/20 shadow-sm'
                            : 'bg-white border-slate-200/80 hover:border-slate-300'
                        }`}
                      >
                        <CartoonScrapIcon type={metal.iconType} size={34} />
                        <div className="min-w-0 flex-1">
                          <div className="text-[11px] font-bold text-slate-800 truncate">{metal.name}</div>
                          <div className="text-[10px] text-emerald-700 font-bold font-mono">
                            ฿{metal.buyPrice.toLocaleString()}/{metal.unitType === 'piece' ? 'เครื่อง' : 'กก.'}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Smart Multi-Unit Input (g / kg / ton / pcs) */}
                <div className="bg-slate-50/80 p-5 rounded-3xl border border-slate-200/80 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <label className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
                      <Scale className="w-4 h-4 text-amber-600" />
                      <span>
                        {currentMetalObj.unitType === 'piece' ? 'จำนวนเครื่อง / ชิ้น' : 'น้ำหนักที่ชั่งได้'}
                      </span>
                    </label>

                    {/* Unit Selector */}
                    {currentMetalObj.unitType === 'piece' ? (
                      <span className="px-3 py-1 rounded-xl bg-slate-900 text-white text-xs font-bold">
                        หน่วย: เครื่อง / ชิ้น
                      </span>
                    ) : (
                      <div className="flex items-center bg-white p-1 rounded-xl border border-slate-200 text-xs font-semibold">
                        {[
                          { id: 'g', label: 'กรัม (g)' },
                          { id: 'kg', label: 'กิโลกรัม (กก.)' },
                          { id: 'ton', label: 'ตัน (Ton)' }
                        ].map((u) => (
                          <button
                            key={u.id}
                            type="button"
                            onClick={() => setWeightUnit(u.id)}
                            className={`px-2.5 py-1 rounded-lg transition ${
                              weightUnit === u.id
                                ? 'bg-slate-900 text-white shadow-sm'
                                : 'text-slate-500 hover:text-slate-800'
                            }`}
                          >
                            {u.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Direct Numeric Input */}
                  <div className="relative">
                    <input
                      type="number"
                      step="any"
                      min="0"
                      value={scrapQuantityInput}
                      onChange={(e) => setScrapQuantityInput(e.target.value)}
                      className="w-full text-2xl font-bold font-mono px-4 py-3 rounded-2xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 bg-white pr-28 text-slate-900"
                    />
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold font-mono px-3 py-1.5 rounded-xl bg-amber-50 text-amber-800 border border-amber-200">
                      {currentMetalObj.unitType === 'piece'
                        ? 'เครื่อง'
                        : weightUnit === 'g'
                        ? 'กรัม'
                        : weightUnit === 'ton'
                        ? 'ตัน'
                        : 'กิโลกรัม'}
                    </div>
                  </div>

                  {/* Smart Presets adapted to current unit */}
                  <div className="flex flex-wrap gap-1.5">
                    {currentMetalObj.unitType === 'piece'
                      ? [5, 10, 25, 50, 100].map((v) => (
                          <button
                            key={v}
                            type="button"
                            onClick={() => setScrapQuantityInput(v.toString())}
                            className="px-2.5 py-1 rounded-xl text-xs font-semibold bg-white hover:bg-slate-100 text-slate-700 border border-slate-200/80"
                          >
                            {v} เครื่อง
                          </button>
                        ))
                      : weightUnit === 'g'
                      ? [25, 50, 120, 250, 500, 1000].map((v) => (
                          <button
                            key={v}
                            type="button"
                            onClick={() => setScrapQuantityInput(v.toString())}
                            className="px-2.5 py-1 rounded-xl text-xs font-semibold bg-white hover:bg-slate-100 text-slate-700 border border-slate-200/80"
                          >
                            {v.toLocaleString()} กรัม
                          </button>
                        ))
                      : weightUnit === 'ton'
                      ? [0.5, 1, 2.5, 5, 10].map((v) => (
                          <button
                            key={v}
                            type="button"
                            onClick={() => setScrapQuantityInput(v.toString())}
                            className="px-2.5 py-1 rounded-xl text-xs font-semibold bg-white hover:bg-slate-100 text-slate-700 border border-slate-200/80"
                          >
                            {v} ตัน
                          </button>
                        ))
                      : [10, 50, 100, 500, 1000, 5000].map((v) => (
                          <button
                            key={v}
                            type="button"
                            onClick={() => setScrapQuantityInput(v.toString())}
                            className="px-2.5 py-1 rounded-xl text-xs font-semibold bg-white hover:bg-slate-100 text-slate-700 border border-slate-200/80"
                          >
                            {v.toLocaleString()} กก.
                          </button>
                        ))}
                  </div>
                </div>

                {/* Slip number & Mock IPFS Photo */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      เลขอ้างอิงใบเสร็จ / ใบชั่ง
                    </label>
                    <input
                      type="text"
                      value={scrapReceipt}
                      onChange={(e) => setScrapReceipt(e.target.value)}
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      หลักฐานภาพถ่าย IPFS
                    </label>
                    <div className="flex items-center space-x-2 h-[38px] px-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-medium">
                      <Camera className="w-3.5 h-3.5 text-emerald-600" />
                      <span>ถ่ายรูปแนบแล้ว (CID)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Live Mascot & Value Calculation (5 cols) */}
              <div className="lg:col-span-5 bg-gradient-to-b from-amber-50/40 to-slate-50/50 border border-amber-100 rounded-3xl p-6 flex flex-col justify-between items-center text-center">
                <div className="my-auto py-3 space-y-2">
                  <CartoonScrapIcon type={currentMetalObj.iconType} size={96} />
                  <div className="text-sm font-bold text-slate-800">{currentMetalObj.name}</div>
                  <div className="text-[11px] text-slate-500">
                    {currentMetalObj.desc}
                  </div>
                  <div className="pt-2 space-y-1 text-xs">
                    <div className="bg-white px-4 py-2 rounded-xl border border-slate-200/80 flex justify-between items-center gap-4">
                      <span className="text-slate-500">ยอดจ่ายเงินสดให้ผู้ขาย:</span>
                      <span className="font-bold font-mono text-slate-900 text-sm">
                        ฿{estimatedBuyThb.toLocaleString()}
                      </span>
                    </div>
                    <div className="bg-emerald-50/70 px-4 py-1.5 rounded-xl border border-emerald-200/60 flex justify-between items-center gap-4 text-[11px]">
                      <span className="text-emerald-800">ราคาขายต่อโรงหลอม (+กำไร):</span>
                      <span className="font-bold font-mono text-emerald-700">
                        ฿{estimatedSellThb.toLocaleString()} (+฿{estimatedProfitThb.toLocaleString()})
                      </span>
                    </div>
                  </div>
                </div>

                <div className="w-full bg-white p-4 rounded-2xl border border-amber-200/60 shadow-sm text-center mb-4">
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    แต้มสะสม CUP ที่ Mint ให้ลูกค้า (5%)
                  </div>
                  <div className="text-3xl sm:text-4xl font-extrabold font-mono text-amber-600 my-1">
                    +{calculatedPoints.toLocaleString()} <span className="text-sm font-bold text-slate-700">CUP</span>
                  </div>
                  <div className="text-[10px] text-emerald-600 font-medium">
                    ✓ คำนวณจากยอดเงินจริง (20 บาท = 1 CUP) ใช้ได้กับของทุกชนิด
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing || isPaused}
                  className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-slate-300 text-white text-xs font-bold py-3.5 px-4 rounded-2xl transition shadow-md shadow-amber-600/20"
                >
                  {isProcessing ? 'กำลังยืนยันบนเชน...' : 'บันทึกซื้อและให้แต้มลูกค้า (Mint)'}
                </button>

                {isWeb3Connected && chainId === 31337 && (
                  <button
                    type="button"
                    onClick={handleDirectLocalMint}
                    disabled={isProcessing || isPaused}
                    className="w-full mt-2 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white text-xs font-semibold py-2.5 px-4 rounded-2xl transition flex items-center justify-center space-x-1.5"
                  >
                    <span>⚡ บันทึกตรงผ่าน Local Node (Instant 1-Click)</span>
                  </button>
                )}
              </div>
            </form>
          </div>
        )}



        {/* ============================================================== */}
        {/* TAB 4: ADMIN & PROFIT SUMMARY VIEW */}
        {/* ============================================================== */}
        {activeTab === 'admin' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                  <ShieldCheck className="w-5 h-5 text-indigo-600" />
                  <span>สรุปบัญชีซื้อ-ขาย กำไร และการจัดการระบบ (Admin)</span>
                </h3>
                <p className="text-xs text-slate-400">
                  เปรียบเทียบต้นทุนรับซื้อหน้าร้าน vs ยอดขายโรงหลอม (กทม./โคราช) แบบ Real-time
                </p>
              </div>

              <button
                onClick={handleTogglePause}
                disabled={isProcessing}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
                  isPaused
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    : 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200'
                }`}
              >
                <span>{isPaused ? '▶ เปิดใช้งานระบบ (Unpause)' : '⏸ สั่งหยุดระบบฉุกเฉิน (Pause)'}</span>
              </button>
            </div>

            {/* Profit KPI Cards (อิงจากข้อมูลจริงในบัญชี) */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70">
                <div className="text-[11px] font-semibold text-slate-500">น้ำหนักรับซื้อสะสม</div>
                <div className="text-xl font-extrabold font-mono text-slate-900 mt-1">
                  {adminLedgerStats.totalWeightKg.toLocaleString(undefined, { maximumFractionDigits: 1 })} กก.
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">({(adminLedgerStats.totalWeightKg / 1000).toFixed(2)} ตัน)</div>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/70">
                <div className="text-[11px] font-semibold text-amber-800">ยอดเงินรับซื้อรวม</div>
                <div className="text-xl font-extrabold font-mono text-amber-900 mt-1">
                  ฿{adminLedgerStats.totalBuyThb.toLocaleString()}
                </div>
                <div className="text-[10px] text-amber-700 mt-0.5">ต้นทุนหน้าลาน</div>
              </div>

              <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-200/70">
                <div className="text-[11px] font-semibold text-sky-800">ยอดขายต่อโรงหลอม</div>
                <div className="text-xl font-extrabold font-mono text-sky-900 mt-1">
                  ฿{adminLedgerStats.totalSellThb.toLocaleString()}
                </div>
                <div className="text-[10px] text-sky-700 mt-0.5">ราคาขายส่ง (กทม./โคราช)</div>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200">
                <div className="text-[11px] font-semibold text-emerald-800 flex items-center space-x-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>กำไรสุทธิ (Gross Profit)</span>
                </div>
                <div className="text-xl font-extrabold font-mono text-emerald-700 mt-1">
                  +฿{(adminLedgerStats.totalSellThb - adminLedgerStats.totalBuyThb).toLocaleString()}
                </div>
                <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">
                  Margin ~{(((adminLedgerStats.totalSellThb - adminLedgerStats.totalBuyThb) / adminLedgerStats.totalSellThb) * 100).toFixed(1)}%
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-slate-200/80 rounded-2xl p-5 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  ความปลอดภัย & กฎ Smart Contract
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-800">ระบบผูกบัตรประชาชน (KYC)</div>
                      <div className="text-[11px] text-slate-400">ป้องกันการรับซื้อสายไฟขโมย เก็บแบบ Hash ตาม PDPA</div>
                    </div>
                    <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                      เปิดใช้งาน
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-800">ระบบจัดเก็บรูปภาพ IPFS</div>
                      <div className="text-[11px] text-slate-400">แนบภาพถ่ายสินค้าบนตราชั่งกับใบเสร็จถาวร</div>
                    </div>
                    <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                      เปิดใช้งาน
                    </span>
                  </div>
                </div>
              </div>

              <div className="border border-slate-200/80 rounded-2xl p-5 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  สถานะสิทธิ์ผู้ใช้งาน (RBAC) & มอบสิทธิ์ On-Chain
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-50 flex justify-between items-center">
                    <span className="font-semibold text-slate-700">MINTER_ROLE (พนักงานชั่ง)</span>
                    <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                      Unlimited Scale
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 flex justify-between items-center">
                    <span className="font-semibold text-slate-700">MERCHANT_ROLE (ฝ่ายการเงิน)</span>
                    <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                      Redeem & Burn
                    </span>
                  </div>
                </div>

                <form onSubmit={handleGrantRole} className="pt-2 border-t border-slate-100 space-y-2">
                  <div className="text-[11px] font-bold text-slate-700 flex items-center space-x-1.5">
                    <UserPlus className="w-3.5 h-3.5 text-indigo-600" />
                    <span>มอบสิทธิ์ให้กระเป๋า MetaMask อื่น (ต้องเชื่อม Admin)</span>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      value={grantTargetAddress}
                      onChange={(e) => setGrantTargetAddress(e.target.value)}
                      placeholder="0x... Address กระเป๋าพนักงาน/ร้านค้า"
                      className="flex-1 text-[11px] font-mono px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500"
                    />
                    <select
                      value={grantRoleType}
                      onChange={(e) => setGrantRoleType(e.target.value)}
                      className="text-[11px] font-semibold px-2.5 py-2 rounded-xl border border-slate-200 bg-white"
                    >
                      <option value="MINTER_ROLE">MINTER_ROLE</option>
                      <option value="MERCHANT_ROLE">MERCHANT_ROLE</option>
                    </select>
                    <button
                      type="submit"
                      disabled={isProcessing || !isWeb3Connected}
                      className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 text-white text-[11px] font-bold whitespace-nowrap"
                    >
                      มอบสิทธิ์
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* PUBLIC ON-CHAIN TRANSACTION HISTORY */}
        {/* ============================================================== */}
        <div className="mt-8 bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2.5">
              <History className="w-5 h-5 text-slate-700" />
              <div>
                <h3 className="font-bold text-slate-900 text-sm">ประวัติธุรกรรมบนบล็อกเชน (Audit Trail)</h3>
                <p className="text-xs text-slate-400">
                  Contract: {chainId === 11155111 ? (
                    <a href={`https://sepolia.etherscan.io/address/${CONTRACT_ADDRESS}`} target="_blank" rel="noreferrer" className="font-mono text-amber-600 hover:underline font-semibold">
                      {CONTRACT_ADDRESS} ↗
                    </a>
                  ) : (
                    <span className="font-mono">{CONTRACT_ADDRESS}</span>
                  )} ({isWeb3Connected ? (chainId === 11155111 ? 'Sepolia Testnet' : `Hardhat Local #${chainId}`) : 'Demo Mode'})
                </p>
              </div>
            </div>
            <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
              {txHistory.length} รายการ
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {txHistory.map((tx) => (
              <div key={tx.id} className="py-4 flex items-center justify-between gap-4">
                <div className="flex items-center space-x-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center flex-shrink-0">
                    {tx.iconType ? (
                      tx.isReward ? (
                        <CartoonRewardIcon id={tx.iconType} size={28} />
                      ) : (
                        <CartoonScrapIcon type={tx.iconType} size={32} />
                      )
                    ) : (
                      <Coins className="w-5 h-5 text-amber-500" />
                    )}
                  </div>

                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-slate-800 flex items-center space-x-2">
                      <span>{tx.title}</span>
                      <span className="text-[10px] font-mono font-medium px-2 py-0.2 bg-slate-100 text-slate-600 rounded-full">
                        {tx.method}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400">{tx.subtitle}</div>
                    <div className="text-[10px] font-mono text-slate-400 flex items-center space-x-1">
                      {chainId === 11155111 && typeof tx.hash === 'string' && tx.hash.length === 66 ? (
                        <a
                          href={`https://sepolia.etherscan.io/tx/${tx.hash}`}
                          target="_blank"
                          rel="noreferrer"
                          className="hover:text-amber-600 underline flex items-center space-x-1"
                        >
                          <span>Tx: {tx.hash.substring(0, 18)}...</span>
                          <ExternalLink className="w-2.5 h-2.5 inline" />
                        </a>
                      ) : (
                        <>
                          <span>
                            Tx:{' '}
                            {typeof tx.hash === 'string'
                              ? tx.hash.length > 26
                                ? `${tx.hash.substring(0, 22)}...`
                                : tx.hash
                              : '0x...'}
                            {' '}({tx.timestamp || 'ล่าสุด'})
                          </span>
                          <ExternalLink className="w-2.5 h-2.5 inline text-slate-300" />
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-right flex-shrink-0">
                  <span
                    className={`font-mono font-bold text-sm ${
                      (Number(tx.amount) || 0) > 0 ? 'text-emerald-600' : 'text-rose-500'
                    }`}
                  >
                    {(Number(tx.amount) || 0) > 0
                      ? `+${(Number(tx.amount) || 0).toLocaleString()}`
                      : (Number(tx.amount) || 0).toLocaleString()}
                  </span>
                  <div className="text-[10px] text-slate-400 font-medium">CUP</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        </>
        )}

        {/* Minimal Footer */}
        <footer className="mt-12 text-center text-xs text-slate-400 space-y-1">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <NongCopper size={28} mood="happy" />
            <span className="font-bold text-slate-700">CopperPoint</span>
          </div>
          <p>Senior Project Web3 • Smart Contract ERC-20 on Sepolia Testnet</p>
          <p className="text-[11px] text-slate-400">
            ระบบสะสมแต้มซื้อขายโลหะมีมูลค่าและ E-Waste ตาม พ.ร.บ. ของเก่า พ.ศ. 2474
          </p>
        </footer>
      </main>
    </div>
  );
}
