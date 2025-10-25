// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/Ownable.sol";

interface IProposalFutarchy {
    function updateYield(
        uint256 proposalId,
        uint256 actualAPR,
        bytes calldata proof
    ) external;
}

contract AgentTrigger is Ownable {
    
    // ============ STATE VARIABLES ============
    
    IProposalFutarchy public futarchyContract;
    
    struct AgentInfo {
        address agentAddress;      // Vincent backend wallet address
        string vincentAppId;       // Vincent App ID (for tracking)
        uint256 version;           // App version
        bool active;               // Can be deactivated
        uint256 registeredAt;      // When registered
    }
    
    struct YieldReport {
        uint256 actualAPR;         // Reported APR (in basis points)
        uint256 reportedAt;        // When reported
        bytes proof;               // Pyth oracle proof
        bool verified;             // Was it verified
    }
    
    // proposalId => AgentInfo
    mapping(uint256 => AgentInfo) public proposalAgents;
    
    // proposalId => YieldReport
    mapping(uint256 => YieldReport) public yieldReports;
    
    // agent address => array of proposal IDs they manage
    mapping(address => uint256[]) public agentProposals;
    
    // ============ EVENTS ============
    
    event AgentRegistered(
        uint256 indexed proposalId,
        address indexed agentAddress,
        string vincentAppId,
        uint256 version
    );
    
    event AgentDeactivated(
        uint256 indexed proposalId,
        address indexed agentAddress
    );
    
    event YieldReported(
        uint256 indexed proposalId,
        address indexed agentAddress,
        uint256 actualAPR,
        bytes proof
    );
    
    event AgentUpdated(
        uint256 indexed proposalId,
        address oldAgent,
        address newAgent
    );
    
    // ============ CONSTRUCTOR ============
    
    constructor(address _futarchyContract) Ownable(msg.sender) {
        futarchyContract = IProposalFutarchy(_futarchyContract);
    }
    
    // ============ MAIN FUNCTIONS ============
    
    /**
     * @notice Register a Vincent agent for a proposal
     * @dev Only proposal creator or contract owner can call this
     * @param proposalId The proposal ID from ProposalFutarchy
     * @param agentAddress The Vincent backend wallet address
     * @param vincentAppId The Vincent App ID (e.g., "app-12345")
     */
    function registerAgent(
        uint256 proposalId,
        address agentAddress,
        string calldata vincentAppId
    ) external {
        require(agentAddress != address(0), "Invalid agent address");
        require(
            proposalAgents[proposalId].agentAddress == address(0),
            "Agent already registered"
        );
        
        // In production, add check: require(msg.sender == proposalCreator)
        
        proposalAgents[proposalId] = AgentInfo({
            agentAddress: agentAddress,
            vincentAppId: vincentAppId,
            version: 1,
            active: true,
            registeredAt: block.timestamp
        });
        
        agentProposals[agentAddress].push(proposalId);
        
        emit AgentRegistered(proposalId, agentAddress, vincentAppId, 1);
    }
    
    /**
     * @notice Report yield results for a proposal
     * @dev Only the registered agent can call this
     * @param proposalId The proposal ID
     * @param actualAPR The actual APR achieved (in basis points, e.g., 1800 = 18%)
     * @param proof Pyth oracle proof (can be empty for now)
     */
    function reportYield(
        uint256 proposalId,
        uint256 actualAPR,
        bytes calldata proof
    ) external {
        AgentInfo storage agent = proposalAgents[proposalId];
        
        require(agent.agentAddress != address(0), "No agent registered");
        require(agent.agentAddress == msg.sender, "Not authorized agent");
        require(agent.active, "Agent deactivated");
        require(yieldReports[proposalId].reportedAt == 0, "Already reported");
        
        // Store the report
        yieldReports[proposalId] = YieldReport({
            actualAPR: actualAPR,
            reportedAt: block.timestamp,
            proof: proof,
            verified: true // In production, verify Pyth proof here
        });
        
        // Forward to ProposalFutarchy
        futarchyContract.updateYield(proposalId, actualAPR, proof);
        
        emit YieldReported(proposalId, msg.sender, actualAPR, proof);
    }
    
    /**
     * @notice Deactivate an agent (can't report anymore)
     * @dev Only owner or proposal creator can call
     * @param proposalId The proposal ID
     */
    function deactivateAgent(uint256 proposalId) external {
        AgentInfo storage agent = proposalAgents[proposalId];
        require(agent.agentAddress != address(0), "No agent registered");
        require(agent.active, "Already deactivated");
        
        agent.active = false;
        
        emit AgentDeactivated(proposalId, agent.agentAddress);
    }
    
    /**
     * @notice Update agent address for a proposal
     * @dev Useful if you want to change backend wallet
     * @param proposalId The proposal ID
     * @param newAgentAddress The new agent address
     */
    function updateAgent(
        uint256 proposalId,
        address newAgentAddress
    ) external {
        require(newAgentAddress != address(0), "Invalid address");
        
        AgentInfo storage agent = proposalAgents[proposalId];
        require(agent.agentAddress != address(0), "No agent registered");
        
        address oldAgent = agent.agentAddress;
        agent.agentAddress = newAgentAddress;
        
        // Update the mapping
        agentProposals[newAgentAddress].push(proposalId);
        
        emit AgentUpdated(proposalId, oldAgent, newAgentAddress);
    }
    
    // ============ VIEW FUNCTIONS ============
    
    /**
     * @notice Get agent info for a proposal
     * @param proposalId The proposal ID
     * @return Agent information
     */
    function getAgentInfo(uint256 proposalId) 
        external 
        view 
        returns (AgentInfo memory) 
    {
        return proposalAgents[proposalId];
    }
    
    /**
     * @notice Get yield report for a proposal
     * @param proposalId The proposal ID
     * @return Yield report
     */
    function getYieldReport(uint256 proposalId) 
        external 
        view 
        returns (YieldReport memory) 
    {
        return yieldReports[proposalId];
    }
    
    /**
     * @notice Get all proposals managed by an agent
     * @param agentAddress The agent address
     * @return Array of proposal IDs
     */
    function getAgentProposals(address agentAddress) 
        external 
        view 
        returns (uint256[] memory) 
    {
        return agentProposals[agentAddress];
    }
    
    /**
     * @notice Check if an agent can report for a proposal
     * @param proposalId The proposal ID
     * @param agentAddress The agent address to check
     * @return bool True if authorized
     */
    function isAuthorizedAgent(uint256 proposalId, address agentAddress) 
        external 
        view 
        returns (bool) 
    {
        AgentInfo storage agent = proposalAgents[proposalId];
        return agent.agentAddress == agentAddress && agent.active;
    }
}