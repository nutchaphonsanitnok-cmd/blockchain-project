// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title CopperPoint (CUP)
 * @notice ERC-20 loyalty & scrap metal tracking token for CopperPoint.
 *         Supports unlimited industrial scale (quotaLimit == 0 => unlimited),
 *         on-chain weight/grade/IPFS receipt audit trail, and role-based redemption.
 */
contract CopperPoint is ERC20, AccessControl, Pausable {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant MERCHANT_ROLE = keccak256("MERCHANT_ROLE");

    uint256 private constant MONTH_SECONDS = 30 days;

    struct QuotaInfo {
        uint256 limit;       // 0 = unlimited industrial scale
        uint256 mintedInWindow;
        uint256 windowStart;
    }

    mapping(address => QuotaInfo) private _minterQuotas;

    event ScrapTraded(
        address indexed customer,
        address indexed minter,
        string metalType,
        uint256 weightGrams,
        uint256 pointsMinted,
        string note,
        uint256 timestamp
    );

    event RewardRedeemed(
        address indexed customer,
        address indexed merchant,
        string rewardItem,
        uint256 pointsBurned,
        uint256 timestamp
    );

    event MinterQuotaUpdated(address indexed minter, uint256 limit);

    constructor() ERC20("CopperPoint", "CUP") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
        _grantRole(MERCHANT_ROLE, msg.sender);
    }

    /**
     * @notice Staff (MINTER_ROLE) records scrap metal/e-waste purchase and mints CUP points.
     * @param customer Wallet address of the seller/customer.
     * @param amount Token amount in wei (18 decimals).
     * @param metalType Name/ID of scrap metal or e-waste item.
     * @param weightGrams Weight in grams (or count when unit is piece).
     * @param note Receipt ID and optional IPFS CID metadata.
     */
    function mintWithScrapDetails(
        address customer,
        uint256 amount,
        string calldata metalType,
        uint256 weightGrams,
        string calldata note
    ) external onlyRole(MINTER_ROLE) whenNotPaused returns (bool) {
        require(customer != address(0), "CopperPoint: invalid customer");
        require(amount > 0, "CopperPoint: amount must be > 0");

        QuotaInfo storage q = _minterQuotas[msg.sender];
        if (q.limit > 0) {
            if (block.timestamp >= q.windowStart + MONTH_SECONDS) {
                q.windowStart = block.timestamp;
                q.mintedInWindow = 0;
            }
            require(q.mintedInWindow + amount <= q.limit, "CopperPoint: minter quota exceeded");
            q.mintedInWindow += amount;
        }

        _mint(customer, amount);
        emit ScrapTraded(customer, msg.sender, metalType, weightGrams, amount, note, block.timestamp);
        return true;
    }

    /**
     * @notice Customer self-burns CUP tokens to redeem cash/discounts directly.
     */
    function burnSelf(uint256 amount, string calldata reason) external whenNotPaused returns (bool) {
        require(amount > 0, "CopperPoint: amount must be > 0");
        _burn(msg.sender, amount);
        emit RewardRedeemed(msg.sender, msg.sender, reason, amount, block.timestamp);
        return true;
    }

    /**
     * @notice Merchant (MERCHANT_ROLE) redeems & burns customer points using ERC-20 allowance.
     */
    function merchantRedeem(
        address customer,
        uint256 amount,
        string calldata rewardItem
    ) external onlyRole(MERCHANT_ROLE) whenNotPaused returns (bool) {
        require(customer != address(0), "CopperPoint: invalid customer");
        require(amount > 0, "CopperPoint: amount must be > 0");

        _spendAllowance(customer, msg.sender, amount);
        _burn(customer, amount);
        emit RewardRedeemed(customer, msg.sender, rewardItem, amount, block.timestamp);
        return true;
    }

    /**
     * @notice Admin can pause/unpause all minting, burning, and transfers during emergencies.
     */
    function setPaused(bool _paused) external onlyRole(DEFAULT_ADMIN_ROLE) {
        if (_paused) {
            _pause();
        } else {
            _unpause();
        }
    }

    /**
     * @notice Admin can configure a monthly minting cap (0 = unlimited scale).
     */
    function setMinterQuota(address minter, uint256 limit) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _minterQuotas[minter].limit = limit;
        if (_minterQuotas[minter].windowStart == 0) {
            _minterQuotas[minter].windowStart = block.timestamp;
        }
        emit MinterQuotaUpdated(minter, limit);
    }

    /**
     * @notice Returns remaining quota and limit for a minter (limit == 0 means unlimited).
     */
    function getMinterQuotaRemaining(address minter)
        external
        view
        returns (uint256 remaining, uint256 limit)
    {
        QuotaInfo memory q = _minterQuotas[minter];
        if (q.limit == 0) {
            return (type(uint256).max, 0);
        }
        if (block.timestamp >= q.windowStart + MONTH_SECONDS) {
            return (q.limit, q.limit);
        }
        uint256 used = q.mintedInWindow;
        return (q.limit > used ? q.limit - used : 0, q.limit);
    }

    function _update(address from, address to, uint256 value) internal override whenNotPaused {
        super._update(from, to, value);
    }
}
