// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title HBARX
 * @notice Liquid Staking Token for HBAR on Hedera (like Stader)
 * @dev Users deposit HBAR and receive HBARX
 *      HBARX value increases as staking rewards accumulate
 */
contract HBARX is ERC20, Ownable, ReentrancyGuard {
    
    // Exchange rate: how much HBAR per HBARX (in wei, 18 decimals)
    // Starts at 1:1, increases as rewards are added
    uint256 public exchangeRate;
    
    // Total HBAR staked in the pool
    uint256 public totalStaked;
    
    // Total rewards accumulated from staking
    uint256 public totalRewards;
    
    // Minimum stake amount (0.01 HBAR)
    uint256 public constant MIN_STAKE = 0.01 ether;
    
    event Staked(address indexed user, uint256 hbarAmount, uint256 hbarxAmount);
    event Unstaked(address indexed user, uint256 hbarxAmount, uint256 hbarAmount);
    event RewardsAdded(uint256 rewardAmount, uint256 newExchangeRate);
    event RewardsDistributed(uint256 amount);
    
    constructor() ERC20("Liquid Staked HBAR", "HBARX") Ownable(msg.sender) {
        exchangeRate = 1 ether; // 1:1 initially
    }
    
    /**
     * @notice Stake HBAR to receive HBARX
     * @dev Send HBAR with the transaction
     */
    function stake() external payable nonReentrant {
        require(msg.value >= MIN_STAKE, "Below minimum stake");
        
        uint256 hbarAmount = msg.value;
        
        // Calculate HBARX to mint based on exchange rate
        uint256 hbarxAmount = (hbarAmount * 1 ether) / exchangeRate;
        
        // Mint HBARX to user
        _mint(msg.sender, hbarxAmount);
        
        totalStaked += hbarAmount;
        
        emit Staked(msg.sender, hbarAmount, hbarxAmount);
    }
    
    /**
     * @notice Unstake HBARX to receive HBAR
     * @param hbarxAmount Amount of HBARX to burn
     */
    function unstake(uint256 hbarxAmount) external nonReentrant {
        require(hbarxAmount > 0, "Amount must be > 0");
        require(balanceOf(msg.sender) >= hbarxAmount, "Insufficient balance");
        
        // Calculate HBAR to return based on exchange rate
        uint256 hbarAmount = (hbarxAmount * exchangeRate) / 1 ether;
        
        require(address(this).balance >= hbarAmount, "Insufficient liquidity");
        
        // Burn HBARX
        _burn(msg.sender, hbarxAmount);
        
        totalStaked -= hbarAmount;
        
        // Transfer HBAR to user
        (bool success, ) = msg.sender.call{value: hbarAmount}("");
        require(success, "HBAR transfer failed");
        
        emit Unstaked(msg.sender, hbarxAmount, hbarAmount);
    }
    
    /**
     * @notice Add staking rewards to the pool
     * @dev Only owner (Vincent agent) can call this
     *      Send HBAR rewards with the transaction
     */
    function addRewards() external payable onlyOwner {
        require(msg.value > 0, "Rewards must be > 0");
        require(totalSupply() > 0, "No stakers");
        
        uint256 rewardAmount = msg.value;
        totalRewards += rewardAmount;
        
        // Update exchange rate
        // New rate = (totalStaked + totalRewards) / totalSupply()
        uint256 totalValue = totalStaked + totalRewards;
        exchangeRate = (totalValue * 1 ether) / totalSupply();
        
        emit RewardsAdded(rewardAmount, exchangeRate);
    }
    
    /**
     * @notice Get current APR based on rewards accumulated
     * @return APR in basis points (e.g., 650 = 6.5%)
     */
    function getCurrentAPR() external view returns (uint256) {
        if (totalStaked == 0) return 0;
        
        // APR = (totalRewards / totalStaked) * 10000
        return (totalRewards * 10000) / totalStaked;
    }
    
    /**
     * @notice Get amount of HBAR user would receive for HBARX
     * @param hbarxAmount Amount of HBARX
     * @return Amount of HBAR
     */
    function previewUnstake(uint256 hbarxAmount) external view returns (uint256) {
        return (hbarxAmount * exchangeRate) / 1 ether;
    }
    
    /**
     * @notice Get amount of HBARX user would receive for HBAR
     * @param hbarAmount Amount of HBAR
     * @return Amount of HBARX
     */
    function previewStake(uint256 hbarAmount) external view returns (uint256) {
        return (hbarAmount * 1 ether) / exchangeRate;
    }
    
    /**
     * @notice Get total value locked in HBAR
     */
    function getTVL() external view returns (uint256) {
        return address(this).balance;
    }
    
    /**
     * @notice Get contract balance
     */
    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }
    
    /**
     * @notice Emergency withdraw (only owner)
     */
    function emergencyWithdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        (bool success, ) = owner().call{value: balance}("");
        require(success, "Withdrawal failed");
    }
    
    /**
     * @notice Receive function to accept HBAR
     */
    receive() external payable {
        // Accept HBAR directly (for rewards)
        emit RewardsDistributed(msg.value);
    }
}
