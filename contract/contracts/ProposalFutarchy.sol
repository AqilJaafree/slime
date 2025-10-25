// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract ProposalFutarchy is Ownable, ReentrancyGuard {
    
    IERC20 public immutable PYUSD;
    address public agentTrigger;
    
    enum ProposalStatus { Active, Resolved, Failed }
    enum Outcome { Undecided, Yes, No }
    
    struct Proposal {
        uint256 id;
        address creator;
        string strategyName;
        uint256 targetAPR;
        uint256 fundingGoal;
        uint256 deadline;
        ProposalStatus status;
        uint256 actualAPR;
        bool yieldReported;
    }
    
    struct Market {
        uint256 yesShares;
        uint256 noShares;
        uint256 yesCollateral;
        uint256 noCollateral;
        uint256 totalFunding;
        Outcome outcome;
        bool resolved;
    }
    
    struct Position {
        uint256 yesShares;
        uint256 noShares;
        uint256 fundingAmount;
        bool claimed;
    }
    
    uint256 public proposalCount;
    mapping(uint256 => Proposal) public proposals;
    mapping(uint256 => Market) public markets;
    mapping(uint256 => mapping(address => Position)) public positions;
    
    event ProposalCreated(uint256 indexed id, address creator, string name, uint256 targetAPR);
    event SharesBought(uint256 indexed id, address buyer, bool isYes, uint256 shares, uint256 amount);
    event FundingAdded(uint256 indexed id, address funder, uint256 amount);
    event MarketResolved(uint256 indexed id, Outcome outcome);
    event YieldUpdated(uint256 indexed id, uint256 actualAPR);
    event Claimed(uint256 indexed id, address user, uint256 amount);
    event AgentTriggerSet(address indexed agentTrigger);
    
    constructor(address _pyusd) Ownable(msg.sender) {
        PYUSD = IERC20(_pyusd);
    }
    
    function setAgentTrigger(address _agentTrigger) external onlyOwner {
        require(_agentTrigger != address(0), "Invalid address");
        agentTrigger = _agentTrigger;
        emit AgentTriggerSet(_agentTrigger);
    }
    
    function createProposal(
        string calldata strategyName,
        uint256 targetAPR,
        uint256 fundingGoal,
        uint256 duration
    ) external returns (uint256) {
        proposalCount++;
        uint256 id = proposalCount;
        
        proposals[id] = Proposal({
            id: id,
            creator: msg.sender,
            strategyName: strategyName,
            targetAPR: targetAPR,
            fundingGoal: fundingGoal,
            deadline: block.timestamp + duration,
            status: ProposalStatus.Active,
            actualAPR: 0,
            yieldReported: false
        });
        
        emit ProposalCreated(id, msg.sender, strategyName, targetAPR);
        return id;
    }
    
    function buyShares(uint256 proposalId, bool isYes, uint256 amount) external nonReentrant {
        require(proposals[proposalId].status == ProposalStatus.Active, "Not active");
        require(block.timestamp < proposals[proposalId].deadline, "Expired");
        require(amount > 0, "Zero amount");
        
        PYUSD.transferFrom(msg.sender, address(this), amount);
        
        Market storage market = markets[proposalId];
        uint256 shares = amount;
        
        if (isYes) {
            market.yesShares += shares;
            market.yesCollateral += amount;
            positions[proposalId][msg.sender].yesShares += shares;
        } else {
            market.noShares += shares;
            market.noCollateral += amount;
            positions[proposalId][msg.sender].noShares += shares;
        }
        
        emit SharesBought(proposalId, msg.sender, isYes, shares, amount);
    }
    
    function addFunding(uint256 proposalId, uint256 amount) external nonReentrant {
        require(proposals[proposalId].status == ProposalStatus.Active, "Not active");
        require(block.timestamp < proposals[proposalId].deadline, "Expired");
        require(amount > 0, "Zero amount");
        
        PYUSD.transferFrom(msg.sender, address(this), amount);
        
        markets[proposalId].totalFunding += amount;
        positions[proposalId][msg.sender].fundingAmount += amount;
        
        markets[proposalId].yesShares += amount;
        positions[proposalId][msg.sender].yesShares += amount;
        
        emit FundingAdded(proposalId, msg.sender, amount);
    }
    
    function resolveMarket(uint256 proposalId, bool success) external onlyOwner {
        require(proposals[proposalId].status == ProposalStatus.Active, "Not active");
        require(!markets[proposalId].resolved, "Already resolved");
        
        markets[proposalId].outcome = success ? Outcome.Yes : Outcome.No;
        markets[proposalId].resolved = true;
        proposals[proposalId].status = success ? ProposalStatus.Resolved : ProposalStatus.Failed;
        
        emit MarketResolved(proposalId, markets[proposalId].outcome);
    }
    
    function updateYield(
        uint256 proposalId,
        uint256 actualAPR,
        bytes calldata /* proof */
    ) external {
        require(msg.sender == agentTrigger, "Only AgentTrigger");
        require(markets[proposalId].resolved, "Not resolved");
        require(!proposals[proposalId].yieldReported, "Already reported");
        
        proposals[proposalId].actualAPR = actualAPR;
        proposals[proposalId].yieldReported = true;
        
        if (actualAPR >= proposals[proposalId].targetAPR) {
            proposals[proposalId].status = ProposalStatus.Resolved;
        } else {
            proposals[proposalId].status = ProposalStatus.Failed;
        }
        
        emit YieldUpdated(proposalId, actualAPR);
    }
    
    function claimWinnings(uint256 proposalId) external nonReentrant {
        require(markets[proposalId].resolved, "Not resolved");
        
        Position storage position = positions[proposalId][msg.sender];
        require(!position.claimed, "Already claimed");
        
        Market storage market = markets[proposalId];
        Proposal storage proposal = proposals[proposalId];
        uint256 payout = 0;
        
        if (market.outcome == Outcome.Yes && position.yesShares > 0) {
            uint256 totalPool = market.yesCollateral + market.noCollateral;
            payout = (position.yesShares * totalPool) / market.yesShares;
        } else if (market.outcome == Outcome.No && position.noShares > 0) {
            uint256 totalPool = market.yesCollateral + market.noCollateral;
            payout = (position.noShares * totalPool) / market.noShares;
        }
        
        if (position.fundingAmount > 0 && proposal.yieldReported) {
            uint256 yield = (position.fundingAmount * proposal.actualAPR) / 10000;
            payout += position.fundingAmount + yield;
        }
        
        require(payout > 0, "No winnings");
        
        position.claimed = true;
        PYUSD.transfer(msg.sender, payout);
        
        emit Claimed(proposalId, msg.sender, payout);
    }
    
    function getProposal(uint256 id) external view returns (Proposal memory) {
        return proposals[id];
    }
    
    function getMarket(uint256 id) external view returns (Market memory) {
        return markets[id];
    }
    
    function getPosition(uint256 id, address user) external view returns (Position memory) {
        return positions[id][user];
    }
    
    function getMarketPrice(uint256 id) external view returns (uint256 yesPrice, uint256 noPrice) {
        Market storage market = markets[id];
        uint256 total = market.yesShares + market.noShares;
        if (total == 0) return (5000, 5000);
        yesPrice = (market.yesShares * 10000) / total;
        noPrice = 10000 - yesPrice;
    }
}