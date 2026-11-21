const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CopperPoint (CUP) Smart Contract", function () {
  async function deployFixture() {
    const [admin, customer, staff, merchant, stranger] = await ethers.getSigners();
    const CopperPoint = await ethers.getContractFactory("CopperPoint");
    const cup = await CopperPoint.deploy();
    await cup.waitForDeployment();

    const MINTER_ROLE = await cup.MINTER_ROLE();
    const MERCHANT_ROLE = await cup.MERCHANT_ROLE();
    await cup.grantRole(MINTER_ROLE, staff.address);
    await cup.grantRole(MERCHANT_ROLE, merchant.address);

    return { cup, admin, customer, staff, merchant, stranger, MINTER_ROLE, MERCHANT_ROLE };
  }

  it("allows staff to mint unlimited industrial scale points with scrap metadata", async function () {
    const { cup, customer, staff } = await deployFixture();
    const [remaining, limit] = await cup.getMinterQuotaRemaining(staff.address);
    expect(limit).to.equal(0n);
    expect(remaining).to.equal(ethers.MaxUint256);

    const amount = ethers.parseUnits("25200", 18);
    await expect(
      cup.connect(staff).mintWithScrapDetails(
        customer.address,
        amount,
        "ทองแดงปอกสวย",
        1200000,
        "REC-2026-0112"
      )
    )
      .to.emit(cup, "ScrapTraded");

    expect(await cup.balanceOf(customer.address)).to.equal(amount);
  });

  it("blocks non-minter from minting", async function () {
    const { cup, customer, stranger } = await deployFixture();
    await expect(
      cup.connect(stranger).mintWithScrapDetails(customer.address, 100n, "ทองแดงใหญ่", 1000, "REC-1")
    ).to.be.reverted;
  });

  it("supports customer self-burn and merchant approve + redeem flow", async function () {
    const { cup, customer, staff, merchant } = await deployFixture();
    await cup.connect(staff).mintWithScrapDetails(
      customer.address,
      ethers.parseUnits("100000", 18),
      "ทองแดงปอกสวย",
      5000000,
      "REC-100"
    );

    // Self burn 15,000 CUP
    await cup.connect(customer).burnSelf(ethers.parseUnits("15000", 18), "Cashback 15k");
    expect(await cup.balanceOf(customer.address)).to.equal(ethers.parseUnits("85000", 18));

    // Approve & merchant redeem 50,000 CUP
    await cup.connect(customer).approve(merchant.address, ethers.parseUnits("50000", 18));
    await expect(
      cup.connect(merchant).merchantRedeem(
        customer.address,
        ethers.parseUnits("50000", 18),
        "โบนัสเงินสด 50,000 บาท"
      )
    ).to.emit(cup, "RewardRedeemed");

    expect(await cup.balanceOf(customer.address)).to.equal(ethers.parseUnits("35000", 18));
    expect(await cup.allowance(customer.address, merchant.address)).to.equal(0n);
  });

  it("allows admin to pause and unpause transactions", async function () {
    const { cup, admin, customer, staff } = await deployFixture();
    await cup.connect(admin).setPaused(true);
    await expect(
      cup.connect(staff).mintWithScrapDetails(customer.address, 100n, "ทองแดงใหญ่", 1000, "REC-PAUSE")
    ).to.be.reverted;

    await cup.connect(admin).setPaused(false);
    await cup.connect(staff).mintWithScrapDetails(customer.address, 100n, "ทองแดงใหญ่", 1000, "REC-OK");
    expect(await cup.balanceOf(customer.address)).to.equal(100n);
  });
});
