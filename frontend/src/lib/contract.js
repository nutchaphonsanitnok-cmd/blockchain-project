// Contract ABI, live deployment info, and complete scrap/e-waste catalog for CopperPoint (CUP)
import deployment from './deployment.json';

export const CONTRACT_ADDRESS =
  import.meta.env.VITE_CONTRACT_ADDRESS ||
  deployment.address ||
  "0x5FbDB2315678afecb367f032d93F642f64180aa3";

export const TARGET_CHAIN_ID = Number(import.meta.env.VITE_CHAIN_ID || deployment.chainId || 31337);
export const TARGET_NETWORK_NAME = import.meta.env.VITE_NETWORK_NAME || deployment.network || "localhost";

export const HARDHAT_TEST_ACCOUNTS = {
  admin: "0xAa90501641d45e97D979C50C767bEF5B680691c8",    // Admin (ครบทุกบทบาท)
  customer: "0xaE5d5A37A1D976cE09793e036d12d2b6Caf1F23d", // ลูกค้า (Customer 185,000 CUP)
  staff: "0x5faEf8786001692D7a8E5fF9328fD9FDD48f4DD1",    // พนักงานชั่ง (Minter)
  merchant: "0xAa90501641d45e97D979C50C767bEF5B680691c8"  // Merchant
};

export const CONTRACT_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address) view returns (uint256)",
  "function allowance(address, address) view returns (uint256)",
  "function approve(address spender, uint256 value) returns (bool)",
  "function mintWithScrapDetails(address customer, uint256 amount, string metalType, uint256 weightGrams, string note) returns (bool)",
  "function burnSelf(uint256 amount, string reason) returns (bool)",
  "function merchantRedeem(address customer, uint256 amount, string rewardItem) returns (bool)",
  "function MINTER_ROLE() view returns (bytes32)",
  "function MERCHANT_ROLE() view returns (bytes32)",
  "function DEFAULT_ADMIN_ROLE() view returns (bytes32)",
  "function hasRole(bytes32 role, address account) view returns (bool)",
  "function grantRole(bytes32 role, address account)",
  "function revokeRole(bytes32 role, address account)",
  "function paused() view returns (bool)",
  "function setPaused(bool)",
  "function setMinterQuota(address minter, uint256 limit)",
  "function getMinterQuotaRemaining(address minter) view returns (uint256 remaining, uint256 limit)",
  "event ScrapTraded(address indexed customer, address indexed minter, string metalType, uint256 weightGrams, uint256 pointsMinted, string note, uint256 timestamp)",
  "event RewardRedeemed(address indexed customer, address indexed merchant, string rewardItem, uint256 pointsBurned, uint256 timestamp)",
  "error AccessControlUnauthorizedAccount(address account, bytes32 neededRole)",
  "error AccessControlBadConfirmation()",
  "error EnforcedPause()",
  "error ExpectedPause()",
  "error ERC20InsufficientBalance(address sender, uint256 balance, uint256 needed)",
  "error ERC20InsufficientAllowance(address spender, uint256 allowance, uint256 needed)"
];

// อัตราให้แต้มสะสม: ยอดซื้อขายทุกๆ 20 บาท = 1 แต้ม CUP (รีเบต 5% โดย 1 CUP = 1 บาทสำหรับแลกของรางวัล/แคชแบ็ก)
export const THB_PER_POINT = 20;

export const CATEGORIES = [
  { id: "all", label: "ทั้งหมด" },
  { id: "copper", label: "🟠 ทองแดง" },
  { id: "precious", label: "💎 เม็ดเงิน / คาร์ไบด์" },
  { id: "ewaste_high", label: "🖥️ บอร์ดคอม & แรม" },
  { id: "ewaste_general", label: "💿 E-Waste ทั่วไป" },
  { id: "electrical", label: "⚡ อะไหล่ไฟฟ้า" },
  { id: "metal_other", label: "🔩 โลหะ/เหล็ก/มือถือ" }
];

// รายการสินค้าอ้างอิงจากใบราคาและบัญชีรับซื้อ-ขายจริง
export const SCRAP_METALS = [
  // ================= 1. ตระกูลทองแดง =================
  {
    id: "cu_peeled",
    category: "copper",
    iconType: "cu_big",
    unitType: "weight",
    defaultUnit: "kg",
    name: "ทองแดงปอกสวย",
    buyPrice: 420,
    sellPrice: 475,
    badge: "เกรดสูงสุด 👑",
    desc: "สายไฟปอกเปลือกสะอาด เงาสวย ไร้คราบ"
  },
  {
    id: "cu_short",
    category: "copper",
    iconType: "cu_small",
    unitType: "weight",
    defaultUnit: "kg",
    name: "ทองแดงช็อต / ช็อตดำ",
    buyPrice: 410,
    sellPrice: 465,
    badge: "ยอดนิยม 🔥",
    desc: "ลวดทองแดงจากขดลวดมอเตอร์/สายไฟช็อต"
  },
  {
    id: "cu_telecom",
    category: "copper",
    iconType: "cu_small",
    unitType: "weight",
    defaultUnit: "kg",
    name: "ทองแดงสายโทรศัพท์",
    buyPrice: 395,
    sellPrice: 446,
    badge: "น้ำหนักเยอะ 📞",
    desc: "ลวดทองแดงจากสายสื่อสาร/โทรศัพท์"
  },
  {
    id: "cu_big",
    category: "copper",
    iconType: "cu_big",
    unitType: "weight",
    defaultUnit: "kg",
    name: "ทองแดงใหญ่",
    buyPrice: 385,
    sellPrice: 445,
    badge: "เส้นหนา",
    desc: "ทองแดงเส้นใหญ่ ท่อแอร์ แป๊ปทองแดง"
  },
  {
    id: "cu_small",
    category: "copper",
    iconType: "cu_small",
    unitType: "weight",
    defaultUnit: "kg",
    name: "ทองแดงเล็ก",
    buyPrice: 370,
    sellPrice: 438,
    badge: "สายฝอย",
    desc: "ทองแดงเส้นเล็ก ลวดพัดลม สายฝอย"
  },
  {
    id: "cu_burned",
    category: "copper",
    iconType: "cu_burned",
    unitType: "weight",
    defaultUnit: "kg",
    name: "ทองแดงเผา / เล็กเผา",
    buyPrice: 375,
    sellPrice: 438,
    badge: "ผ่านการเผา 🔥",
    desc: "ทองแดงลอกฉนวนด้วยการเผา มีคราบเขม่า"
  },
  {
    id: "cu_plated",
    category: "copper",
    iconType: "cu_plated",
    unitType: "weight",
    defaultUnit: "kg",
    name: "ทองแดงชุบขาว",
    buyPrice: 360,
    sellPrice: 429,
    badge: "ชุบดีบุก ⚡",
    desc: "สายไฟหรือบัสบาร์ทองแดงเคลือบดีบุกขาว"
  },

  // ================= 2. เม็ดเงิน & คาร์ไบด์ (มูลค่าสูงมาก) =================
  {
    id: "silver_pure",
    category: "precious",
    iconType: "silver",
    unitType: "weight",
    defaultUnit: "g",
    name: "เม็ดเงินบริสุทธิ์ / รวม",
    buyPrice: 35000,
    sellPrice: 40000,
    badge: "ราคาหลักหมื่น! 💎",
    desc: "เม็ดเงินบริสุทธิ์แกะสะอาด (นิยมชั่งเป็นกรัม)"
  },
  {
    id: "silver_magnetic",
    category: "precious",
    iconType: "silver",
    unitType: "weight",
    defaultUnit: "g",
    name: "เม็ดเงินแมกเนติก",
    buyPrice: 22000,
    sellPrice: 25000,
    badge: "หน้าสัมผัสแมกฯ 💎",
    desc: "เม็ดเงินจากหน้าสัมผัสแมกเนติกคอนแทคเตอร์"
  },
  {
    id: "silver_breaker",
    category: "precious",
    iconType: "silver",
    unitType: "weight",
    defaultUnit: "g",
    name: "เม็ดเงินเบรคเกอร์",
    buyPrice: 17500,
    sellPrice: 20000,
    badge: "หน้าสัมผัสเบรคฯ 💎",
    desc: "เม็ดเงินที่ถอดแยกจากตัวเบรคเกอร์ไฟฟ้า"
  },
  {
    id: "carbide_rod",
    category: "precious",
    iconType: "carbide",
    unitType: "weight",
    defaultUnit: "kg",
    name: "คาร์ไบด์ ก้าน",
    buyPrice: 1850,
    sellPrice: 2200,
    badge: "ทังสเตนคาร์ไบด์",
    desc: "ดอกเอ็นมิลล์ ก้านคาร์ไบด์โรงกลึง CNC"
  },
  {
    id: "carbide_insert",
    category: "precious",
    iconType: "carbide",
    unitType: "weight",
    defaultUnit: "kg",
    name: "คาร์ไบด์ เม็ด / ก้อน",
    buyPrice: 1650,
    sellPrice: 2000,
    badge: "มีดกลึงเก่า",
    desc: "เม็ดมีดกลึงคาร์ไบด์ และก้อนคาร์ไบด์"
  },

  // ================= 3. แผงวงจรเกรดสูง (High-Value E-Waste) =================
  {
    id: "ram_thin",
    category: "ewaste_high",
    iconType: "ram",
    unitType: "weight",
    defaultUnit: "g",
    name: "แรมบาง (RAM ขาทอง)",
    buyPrice: 2750,
    sellPrice: 3870,
    badge: "เกรดคอมท็อป ✨",
    desc: "แผงแรมคอมพิวเตอร์/โน้ตบุ๊ก แถบทองคำ"
  },
  {
    id: "board_hdd",
    category: "ewaste_high",
    iconType: "board",
    unitType: "weight",
    defaultUnit: "g",
    name: "บอร์ดฮาร์ดดิส (HDD Board)",
    buyPrice: 1295,
    sellPrice: 1925,
    badge: "บอร์ดราคาแรง 🔥",
    desc: "แผงวงจรสีเขียว/น้ำเงินใต้ตัวฮาร์ดดิสก์"
  },
  {
    id: "cpu_green",
    category: "ewaste_high",
    iconType: "cpu",
    unitType: "weight",
    defaultUnit: "g",
    name: "CPU เขียว / CPU ไม้",
    buyPrice: 910,
    sellPrice: 1300,
    badge: "ชิพประมวลผล 🧠",
    desc: "ซีพียูคอมพิวเตอร์ขา/แผ่นหน้าสัมผัสทอง"
  },
  {
    id: "board_phone",
    category: "ewaste_high",
    iconType: "board",
    unitType: "weight",
    defaultUnit: "g",
    name: "บอร์ดโทรศัพท์มือถือ",
    buyPrice: 900,
    sellPrice: 1250,
    badge: "บอร์ดมือถือ 📱",
    desc: "เมนบอร์ดภายในสมาร์ทโฟนและโทรศัพท์ปุ่มกด"
  },
  {
    id: "board_ruler",
    category: "ewaste_high",
    iconType: "ram",
    unitType: "weight",
    defaultUnit: "kg",
    name: "บอร์ดไม้บรรทัด (จอ LCD)",
    buyPrice: 560,
    sellPrice: 795,
    badge: "บอร์ดยาว",
    desc: "แผงวงจรทรงเรียวยาวจากหลังจอ TV/Monitor"
  },
  {
    id: "board_2chip_gpu",
    category: "ewaste_high",
    iconType: "gpu",
    unitType: "weight",
    defaultUnit: "kg",
    name: "การ์ดจอ / บอร์ด 2 ชิพ",
    buyPrice: 420,
    sellPrice: 625,
    badge: "การ์ดจอ 🎮",
    desc: "เมนบอร์ดคอมพิวเตอร์ 2 ชิพ และการ์ดจอแยก"
  },
  {
    id: "board_gold_dot",
    category: "ewaste_high",
    iconType: "board",
    unitType: "weight",
    defaultUnit: "kg",
    name: "บอร์ดแต้มทอง",
    buyPrice: 390,
    sellPrice: 550,
    badge: "มีลายทอง ✨",
    desc: "แผงวงจรที่มีจุดสัมผัสเคลือบทองคำเยอะ"
  },
  {
    id: "board_sub_a",
    category: "ewaste_high",
    iconType: "board",
    unitType: "weight",
    defaultUnit: "kg",
    name: "บอร์ดรอง A",
    buyPrice: 295,
    sellPrice: 420,
    badge: "เกรด A",
    desc: "บอร์ดเซิร์ฟเวอร์หรือบอร์ดอุปกรณ์เครือข่ายเกรด A"
  },
  {
    id: "board_1chip",
    category: "ewaste_high",
    iconType: "board",
    unitType: "weight",
    defaultUnit: "kg",
    name: "บอร์ดคอม 1 ชิพ",
    buyPrice: 270,
    sellPrice: 390,
    badge: "บอร์ดคอม",
    desc: "เมนบอร์ดคอมพิวเตอร์รุ่นที่มีชิพเซ็ตหลัก 1 ตัว"
  },
  {
    id: "board_0chip",
    category: "ewaste_high",
    iconType: "board",
    unitType: "weight",
    defaultUnit: "kg",
    name: "บอร์ดคอม 0 ชิพ",
    buyPrice: 192,
    sellPrice: 275,
    badge: "บอร์ดคอม",
    desc: "เมนบอร์ดคอมพิวเตอร์แบบถอดชิพหรือไม่มีชิพใหญ่"
  },
  {
    id: "board_router",
    category: "ewaste_high",
    iconType: "board",
    unitType: "weight",
    defaultUnit: "kg",
    name: "บอร์ดเร้าเตอร์ (Router)",
    buyPrice: 160,
    sellPrice: 230,
    badge: "เน็ตเวิร์ก 📡",
    desc: "แผงวงจรเร้าเตอร์ Wi-Fi และกล่องอินเทอร์เน็ต"
  },

  // ================= 4. E-Waste ทั่วไป & แผงวงจร =================
  {
    id: "hdd_full",
    category: "ewaste_general",
    iconType: "hdd",
    unitType: "weight",
    defaultUnit: "kg",
    name: "ฮาร์ดดิส (เต็มลูก)",
    buyPrice: 120,
    sellPrice: 169,
    badge: "ยังไม่แกะ 💾",
    desc: "ฮาร์ดดิสก์คอมพิวเตอร์ทั้งลูกพร้อมบอร์ดครบ"
  },
  {
    id: "pw_green",
    category: "ewaste_general",
    iconType: "board",
    unitType: "weight",
    defaultUnit: "kg",
    name: "แผงเขียว / Pw เขียว",
    buyPrice: 115,
    sellPrice: 164,
    badge: "แผงเขียว",
    desc: "แผงวงจรพาวเวอร์ซัพพลายหรือเครื่องใช้ไฟฟ้าสีเขียว"
  },
  {
    id: "hdd_stripped",
    category: "ewaste_general",
    iconType: "hdd",
    unitType: "weight",
    defaultUnit: "kg",
    name: "ฮาร์ดดิส (แกะบอร์ดออกแล้ว)",
    buyPrice: 80,
    sellPrice: 100,
    badge: "ตัวถังอะลูฯ",
    desc: "ตัวถังฮาร์ดดิสก์ที่แกะบอร์ดเขียวด้านล่างออกแล้ว"
  },
  {
    id: "pw_red",
    category: "ewaste_general",
    iconType: "board_red",
    unitType: "weight",
    defaultUnit: "kg",
    name: "แผงแดง / Pw แดง / แผงขยะ",
    buyPrice: 62,
    sellPrice: 88,
    badge: "แผงแดง",
    desc: "แผงวงจรสีแดง/น้ำตาลจากเครื่องใช้ไฟฟ้าทั่วไป"
  },
  {
    id: "board_tv",
    category: "ewaste_general",
    iconType: "board_red",
    unitType: "weight",
    defaultUnit: "kg",
    name: "บอร์ดขยะ TV",
    buyPrice: 55,
    sellPrice: 82,
    badge: "แผงทีวี 📺",
    desc: "แผงวงจรทีวีรุ่นเก่า จอแก้ว/จอแบนทั่วไป"
  },
  {
    id: "xray_film",
    category: "ewaste_general",
    iconType: "xray",
    unitType: "weight",
    defaultUnit: "kg",
    name: "ฟิล์ม X-Ray",
    buyPrice: 50,
    sellPrice: 70,
    badge: "มีสารเงิน 🩻",
    desc: "ฟิล์มเอกซเรย์ทางการแพทย์ (สกัดแร่เงินได้)"
  },
  {
    id: "pw_box",
    category: "ewaste_general",
    iconType: "hdd",
    unitType: "weight",
    defaultUnit: "kg",
    name: "พาวเวอร์บ็อก (Pw Box)",
    buyPrice: 45,
    sellPrice: 65,
    badge: "เพาเวอร์คอม",
    desc: "กล่อง Power Supply คอมพิวเตอร์ทั้งลูก"
  },
  {
    id: "cd_rom",
    category: "ewaste_general",
    iconType: "cd",
    unitType: "weight",
    defaultUnit: "kg",
    name: "CD-ROM / DVD Drive",
    buyPrice: 33,
    sellPrice: 49,
    badge: "ไดร์ฟอ่านแผ่น",
    desc: "ตัวอ่านแผ่น CD/DVD จากเคสคอมพิวเตอร์"
  },
  {
    id: "cd_disc",
    category: "ewaste_general",
    iconType: "cd",
    unitType: "weight",
    defaultUnit: "kg",
    name: "แผ่น CD / DVD เก่า",
    buyPrice: 21,
    sellPrice: 30,
    badge: "ขายเป็นร้อยโล 💿",
    desc: "แผ่นซีดี แผ่นดีวีดีเก่าทุกชนิด"
  },

  // ================= 5. อะไหล่ไฟฟ้าอุตสาหกรรม =================
  {
    id: "relay_part",
    category: "electrical",
    iconType: "breaker",
    unitType: "weight",
    defaultUnit: "kg",
    name: "ดีเลย์ (Relay)",
    buyPrice: 185,
    sellPrice: 285,
    badge: "มีหน้าเงิน ⚡",
    desc: "รีเลย์ควบคุมไฟฟ้า ตู้คอนโทรล (ข้างในมีทองแดงและเม็ดเงิน)"
  },
  {
    id: "breaker_mag",
    category: "electrical",
    iconType: "breaker",
    unitType: "weight",
    defaultUnit: "kg",
    name: "เบรคเกอร์ / แมคเนติกส์",
    buyPrice: 130,
    sellPrice: 210,
    badge: "ยอดนิยมโรงงาน 🔌",
    desc: "เบรคเกอร์ตู้ไฟโรงงาน และแมกเนติกคอนแทคเตอร์"
  },
  {
    id: "mag_air",
    category: "electrical",
    iconType: "breaker",
    unitType: "weight",
    defaultUnit: "kg",
    name: "แมกแอร์ (Magnetic แอร์)",
    buyPrice: 50,
    sellPrice: 75,
    badge: "อะไหล่แอร์ ❄️",
    desc: "แมกเนติกตัวเล็กในคอยล์ร้อนเครื่องปรับอากาศ"
  },
  {
    id: "circuit_pickpack",
    category: "electrical",
    iconType: "breaker",
    unitType: "weight",
    defaultUnit: "kg",
    name: "เซอร์กิต / ปิ๊กแป๊ก",
    buyPrice: 20,
    sellPrice: 35,
    badge: "ลูกเซอร์กิต",
    desc: "ลูกเบรคเกอร์ย่อยในบ้านพักอาศัย"
  },
  {
    id: "plug_head",
    category: "electrical",
    iconType: "breaker",
    unitType: "weight",
    defaultUnit: "kg",
    name: "หัวปลั๊กไฟ / ขั้วทองเหลือง",
    buyPrice: 18,
    sellPrice: 28,
    badge: "หัวปลั๊ก",
    desc: "หัวปลั๊กไฟติดสายไฟที่ตัดแยกออกมา"
  },

  // ================= 6. โลหะอื่นๆ เหล็ก แบตเตอรี่ & มือถือ =================
  {
    id: "brass_heavy",
    category: "metal_other",
    iconType: "brass_heavy",
    unitType: "weight",
    defaultUnit: "kg",
    name: "ทองเหลืองหนา / แท้",
    buyPrice: 220,
    sellPrice: 287,
    badge: "ทองเหลือง ✨",
    desc: "ก๊อกน้ำ วาล์ว ข้อต่อเกลียว ใบพัดเรือ"
  },
  {
    id: "alu_wire",
    category: "metal_other",
    iconType: "aluminum_wire",
    unitType: "weight",
    defaultUnit: "kg",
    name: "โลสาย (อะลูมิเนียมสายไฟ)",
    buyPrice: 90,
    sellPrice: 104,
    badge: "โลสาย 🔌",
    desc: "สายเมนไฟอะลูมิเนียมเปลือย"
  },
  {
    id: "alu_thick",
    category: "metal_other",
    iconType: "aluminum_wire",
    unitType: "weight",
    defaultUnit: "kg",
    name: "โลหนา / โลเครื่อง / โลบาง",
    buyPrice: 67,
    sellPrice: 74,
    badge: "อะลูมิเนียม",
    desc: "เสื้อสูบ ฝาสูบ อะลูมิเนียมเครื่องจักรและแผ่นบาง"
  },
  {
    id: "alu_foil",
    category: "metal_other",
    iconType: "aluminum_wire",
    unitType: "weight",
    defaultUnit: "kg",
    name: "ฟรอย / ฟอยล์อะลูมิเนียม",
    buyPrice: 30,
    sellPrice: 40,
    badge: "ฟอยล์",
    desc: "แผ่นฟอยล์อะลูมิเนียม ครีบแอร์"
  },
  {
    id: "bat_phone",
    category: "metal_other",
    iconType: "battery_old",
    unitType: "weight",
    defaultUnit: "kg",
    name: "แบตโทรศัพท์ / โน้ตบุ๊ก",
    buyPrice: 70,
    sellPrice: 95,
    badge: "แบตลิเธียม 🔋",
    desc: "แบตเตอรี่มือถือ (70 บ.) / แบตโน้ตบุ๊ก (25 บ.)"
  },
  {
    id: "steel_heavy",
    category: "metal_other",
    iconType: "steel",
    unitType: "weight",
    defaultUnit: "kg",
    name: "เหล็กหนา / เหล็กบาง",
    buyPrice: 8,
    sellPrice: 8.5,
    badge: "รับเป็นตัน 🏗️",
    desc: "เศษเหล็กโครงสร้าง เหล็กเส้น เหล็กแผ่น"
  },
  {
    id: "phone_touch_thai",
    category: "metal_other",
    iconType: "phone",
    unitType: "piece",
    defaultUnit: "pcs",
    name: "โทรศัพท์สัมผัส (เครื่องไทย)",
    buyPrice: 100,
    sellPrice: 140,
    badge: "นับเป็นเครื่อง 📱",
    desc: "สมาร์ทโฟนเสีย ศูนย์ไทย (คิดราคา 100 บ./เครื่อง)"
  },
  {
    id: "phone_touch_china",
    category: "metal_other",
    iconType: "phone",
    unitType: "piece",
    defaultUnit: "pcs",
    name: "โทรศัพท์สัมผัส (เครื่องจีน)",
    buyPrice: 40,
    sellPrice: 60,
    badge: "นับเป็นเครื่อง 📱",
    desc: "สมาร์ทโฟนเสีย เครื่องจีน (คิดราคา 40 บ./เครื่อง)"
  },
  {
    id: "phone_keypad",
    category: "metal_other",
    iconType: "phone",
    unitType: "piece",
    defaultUnit: "pcs",
    name: "โทรศัพท์ปุ่มกด",
    buyPrice: 15,
    sellPrice: 25,
    badge: "นับเป็นเครื่อง ☎️",
    desc: "โทรศัพท์มือถือรุ่นปุ่มกดเก่า (15 บ./เครื่อง)"
  }
];

// รายการของรางวัล (1 CUP = 1 บาท สำหรับสเกลสะสมระดับ 10,000 - 200,000+ CUP)
export const REWARD_ITEMS = [
  {
    id: "cash_custom",
    name: "โอนเงินสดแคชแบ็กเข้าบัญชีธุรกิจ (1 CUP = 1 บาท)",
    points: 10000,
    cashValueThb: 10000,
    category: "เงินสดโอนไว",
    tag: "โอนพร้อมเพย์ 💵",
    desc: "แลกเงินสดโอนตรงเข้าบัญชีนิติบุคคล/ร้านรับซื้อ ทันทีไม่จำกัดยอด"
  },
  {
    id: "wire_stripper",
    name: "เครื่องปอกสายไฟอัตโนมัติอุตสาหกรรม (1.5 - 38 มม.)",
    points: 15000,
    cashValueThb: 15000,
    category: "เครื่องจักรอุตสาหกรรม",
    tag: "ยอดนิยมลาน ⚙️",
    desc: "มอเตอร์ทองแดงแท้ 370W ปอกสายไฟได้เร็ว 20 เมตร/นาที ประหยัดแรงงาน"
  },
  {
    id: "diesel_fleet",
    name: "บัตรเติมน้ำมัน Fleet Card รถบรรทุก 20,000 บาท",
    points: 20000,
    cashValueThb: 20000,
    category: "พลังงานขนส่ง",
    tag: "รถขนส่ง ⛽",
    desc: "ใช้เติมดีเซลรถ 6 ล้อ / 10 ล้อส่งโรงหลอม ที่สถานีบริการทั่วประเทศ"
  },
  {
    id: "crane_hoist",
    name: "รอกสลิงไฟฟ้าอุตสาหกรรม 1 ตัน (พร้อมรีโมทไร้สาย)",
    points: 25000,
    cashValueThb: 25000,
    category: "เครื่องทุ่นแรง",
    tag: "ยกของหนัก 🏗️",
    desc: "สำหรับยกกระสอบทองแดงและถังเศษโลหะขึ้นท้ายรถบรรทุก สะดวกรวดเร็ว"
  },
  {
    id: "scale_2ton",
    name: "ตราชั่งดิจิทัลตั้งพื้นลานรับซื้อ 2 ตัน (ผ่านการรับรอง ชั่งตวงวัด)",
    points: 35000,
    cashValueThb: 35000,
    category: "เครื่องมือมาตรฐาน",
    tag: "มาตรฐาน กสท. ⚖️",
    desc: "แท่นชั่งเหล็กหนา 1.5x1.5 ม. หัวอ่านดิจิทัล RS-232 ตรวจสอบย้อนหลังได้"
  },
  {
    id: "cash_50k",
    name: "โบนัสเงินสดแคชแบ็ก 50,000 บาท",
    points: 50000,
    cashValueThb: 50000,
    category: "เงินสดโบนัส",
    tag: "แคชแบ็กก้อนโต 💰",
    desc: "เงินสดโอนเข้าบัญชีทันที เป็นงบหมุนเวียนรับซื้อของเข้าลาน"
  },
  {
    id: "cash_100k",
    name: "โบนัสเงินสดแคชแบ็ก 100,000 บาท",
    points: 100000,
    cashValueThb: 100000,
    category: "เงินสดโบนัส",
    tag: "โบนัสยอดขาย 👑",
    desc: "โบนัสประจำยอดส่งโรงหลอม โอนตรงพร้อมใบรับรองการหักภาษี"
  },
  {
    id: "hydraulic_baler",
    name: "เครื่องอัดก้อนเศษโลหะไฮดรอลิกขนาดเล็ก 10 ตัน",
    points: 150000,
    cashValueThb: 150000,
    category: "เครื่องจักรอุตสาหกรรม",
    tag: "เครื่องจักรใหญ่ 🚜",
    desc: "อัดก้อนทองแดง สายไฟ และกระป๋องอะลูมิเนียมเป็นบล็อก ประหยัดพื้นที่ขนส่ง"
  }
];
