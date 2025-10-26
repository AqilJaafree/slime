import { network } from "hardhat";
import * as dotenv from "dotenv";

dotenv.config();

const { ethers } = await network.connect({ network: "hedera" });

async function main() {
  console.log("\n" + "=".repeat(60));
  console.log("🧪 TESTING FUTARCHY PROTOCOL");
  console.log("=".repeat(60) + "\n");

  const FUTARCHY_ADDRESS = process.env.FUTARCHY_ADDRESS || "0x13E4F948A7BF143482c2297B5Be1bc1Bc81EA8A6";
  const PYUSD_ADDRESS = process.env.OFT_ADDRESS || "0x6a87032589b837935b1a393dc905c84e908c6974";

  const [user] = await ethers.getSigners();
  console.log(`👤 Testing with account: ${user.address}\n`);

  // Get contracts
  const futarchy = await ethers.getContractAt("ProposalFutarchy", FUTARCHY_ADDRESS);
  
  // Use minimal ERC20 ABI instead of IERC20 artifact
  const pyusd = await ethers.getContractAt(
    [
      "function balanceOf(address) view returns (uint256)",
      "function approve(address,uint256) returns (bool)",
      "function allowance(address,address) view returns (uint256)"
    ],
    PYUSD_ADDRESS
  );

  // Check balances
  console.log("💰 Checking balances...");
  const pyusdBalance = await pyusd.balanceOf(user.address);
  console.log(`   PYUSD Balance: ${ethers.formatUnits(pyusdBalance, 6)} PYUSD\n`);

  if (pyusdBalance === 0n) {
    console.log("⚠️  You need PYUSD to test!");
    console.log("   Bridge some PYUSD from Sepolia first.\n");
    return;
  }

  // ============ TEST 1: Create Proposal ============
  console.log("=".repeat(60));
  console.log("TEST 1: CREATE PROPOSAL");
  console.log("=".repeat(60) + "\n");

  console.log("📝 Creating proposal...");
  const strategyName = "Meteora PYUSD Pool - 18% APR";
  const targetAPR = 1800; // 18%
  const fundingGoal = ethers.parseUnits("100", 6); // 100 PYUSD
  const duration = 7 * 24 * 60 * 60; // 7 days

  try {
    const tx = await futarchy.createProposal(
      strategyName,
      targetAPR,
      fundingGoal,
      duration
    );
    console.log(`   TX: ${tx.hash}`);
    const receipt = await tx.wait();
    
    // Get proposal ID from event
    const event = receipt?.logs.find((log: any) => {
      try {
        const parsed = futarchy.interface.parseLog(log);
        return parsed?.name === "ProposalCreated";
      } catch {
        return false;
      }
    });

    let proposalId = 1n;
    if (event) {
      const parsed = futarchy.interface.parseLog(event);
      proposalId = parsed?.args[0];
    }

    console.log(`   ✅ Proposal created! ID: ${proposalId}\n`);

    // ============ TEST 2: View Proposal ============
    console.log("=".repeat(60));
    console.log("TEST 2: VIEW PROPOSAL DETAILS");
    console.log("=".repeat(60) + "\n");

    const proposal = await futarchy.getProposal(proposalId);
    console.log(`📋 Proposal #${proposalId}:`);
    console.log(`   Creator: ${proposal.creator}`);
    console.log(`   Strategy: ${proposal.strategyName}`);
    console.log(`   Target APR: ${Number(proposal.targetAPR) / 100}%`);
    console.log(`   Funding Goal: ${ethers.formatUnits(proposal.fundingGoal, 6)} PYUSD`);
    console.log(`   Status: ${proposal.status}\n`);

    // ============ TEST 3: Buy YES Shares ============
    console.log("=".repeat(60));
    console.log("TEST 3: BUY YES SHARES (Betting on Success)");
    console.log("=".repeat(60) + "\n");

    const betAmount = ethers.parseUnits("1", 6); // 10 PYUSD
    
    console.log("💰 Approving PYUSD...");
    const approveTx = await pyusd.approve(FUTARCHY_ADDRESS, betAmount);
    await approveTx.wait();
    console.log("   ✅ Approved\n");

    console.log("🎲 Buying YES shares...");
    const buyTx = await futarchy.buyShares(proposalId, true, betAmount);
    console.log(`   TX: ${buyTx.hash}`);
    await buyTx.wait();
    console.log(`   ✅ Bought ${ethers.formatUnits(betAmount, 6)} YES shares\n`);

    // ============ TEST 4: View Market ============
    console.log("=".repeat(60));
    console.log("TEST 4: VIEW MARKET STATUS");
    console.log("=".repeat(60) + "\n");

    const market = await futarchy.getMarket(proposalId);
    console.log(`📊 Market for Proposal #${proposalId}:`);
    console.log(`   YES Shares: ${ethers.formatUnits(market.yesShares, 6)}`);
    console.log(`   NO Shares: ${ethers.formatUnits(market.noShares, 6)}`);
    console.log(`   YES Collateral: ${ethers.formatUnits(market.yesCollateral, 6)} PYUSD`);
    console.log(`   NO Collateral: ${ethers.formatUnits(market.noCollateral, 6)} PYUSD`);
    console.log(`   Total Funding: ${ethers.formatUnits(market.totalFunding, 6)} PYUSD`);
    console.log(`   Resolved: ${market.resolved}\n`);

    const [yesPrice, noPrice] = await futarchy.getMarketPrice(proposalId);
    console.log(`💹 Current Prices:`);
    console.log(`   YES: ${Number(yesPrice) / 100}%`);
    console.log(`   NO: ${Number(noPrice) / 100}%\n`);

    // ============ TEST 5: Add Funding ============
    console.log("=".repeat(60));
    console.log("TEST 5: ADD FUNDING TO STRATEGY");
    console.log("=".repeat(60) + "\n");

    const fundAmount = ethers.parseUnits("1", 6); // 50 PYUSD
    
    console.log("💰 Approving PYUSD...");
    const approveTx2 = await pyusd.approve(FUTARCHY_ADDRESS, fundAmount);
    await approveTx2.wait();
    console.log("   ✅ Approved\n");

    console.log("💵 Adding funding...");
    const fundTx = await futarchy.addFunding(proposalId, fundAmount);
    console.log(`   TX: ${fundTx.hash}`);
    await fundTx.wait();
    console.log(`   ✅ Added ${ethers.formatUnits(fundAmount, 6)} PYUSD funding\n`);

    // ============ TEST 6: View Your Position ============
    console.log("=".repeat(60));
    console.log("TEST 6: YOUR POSITION");
    console.log("=".repeat(60) + "\n");

    const position = await futarchy.getPosition(proposalId, user.address);
    console.log(`👤 Your Position in Proposal #${proposalId}:`);
    console.log(`   YES Shares: ${ethers.formatUnits(position.yesShares, 6)}`);
    console.log(`   NO Shares: ${ethers.formatUnits(position.noShares, 6)}`);
    console.log(`   Funding Contributed: ${ethers.formatUnits(position.fundingAmount, 6)} PYUSD`);
    console.log(`   Claimed: ${position.claimed}\n`);

    // ============ SUMMARY ============
    console.log("=".repeat(60));
    console.log("✅ ALL TESTS COMPLETED!");
    console.log("=".repeat(60) + "\n");

    console.log("📊 Summary:");
    console.log(`   - Created Proposal #${proposalId}`);
    console.log(`   - Bought ${ethers.formatUnits(betAmount, 6)} YES shares`);
    console.log(`   - Added ${ethers.formatUnits(fundAmount, 6)} PYUSD funding`);
    console.log(`   - Total investment: ${ethers.formatUnits(betAmount + fundAmount, 6)} PYUSD\n`);

    console.log("🔍 View on HashScan:");
    console.log(`   https://hashscan.io/testnet/contract/${FUTARCHY_ADDRESS}\n`);

    console.log("📋 Next Steps:");
    console.log("   1. Wait for proposal deadline to pass");
    console.log("   2. Resolve market (owner only):");
    console.log(`      await futarchy.resolveMarket(${proposalId}, true)`);
    console.log("   3. Claim winnings:");
    console.log(`      await futarchy.claimWinnings(${proposalId})\n`);

  } catch (error: any) {
    console.error("❌ Test failed:");
    console.error(error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Error:");
    console.error(error);
    process.exit(1);
  });