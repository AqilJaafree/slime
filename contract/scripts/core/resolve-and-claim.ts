import { network } from "hardhat";
import * as dotenv from "dotenv";

dotenv.config();

const { ethers } = await network.connect({ network: "hedera" });

async function main() {
  console.log("\n" + "=".repeat(60));
  console.log("🎯 RESOLVING MARKET & CLAIMING WINNINGS");
  console.log("=".repeat(60) + "\n");

  const FUTARCHY_ADDRESS = process.env.FUTARCHY_ADDRESS || "0x13E4F948A7BF143482c2297B5Be1bc1Bc81EA8A6";
  const PROPOSAL_ID = process.env.PROPOSAL_ID || "2";

  const [owner] = await ethers.getSigners();
  console.log(`👤 Account: ${owner.address}\n`);

  const futarchy = await ethers.getContractAt("ProposalFutarchy", FUTARCHY_ADDRESS);

  // Check proposal
  const proposal = await futarchy.getProposal(PROPOSAL_ID);
  console.log(`📋 Proposal #${PROPOSAL_ID}:`);
  console.log(`   Strategy: ${proposal.strategyName}`);
  console.log(`   Target APR: ${Number(proposal.targetAPR) / 100}%`);
  console.log(`   Status: ${proposal.status}\n`);

  // Check market before resolution
  const marketBefore = await futarchy.getMarket(PROPOSAL_ID);
  console.log(`📊 Market Status (Before):`);
  console.log(`   YES Shares: ${ethers.formatUnits(marketBefore.yesShares, 6)}`);
  console.log(`   NO Shares: ${ethers.formatUnits(marketBefore.noShares, 6)}`);
  console.log(`   YES Collateral: ${ethers.formatUnits(marketBefore.yesCollateral, 6)} PYUSD`);
  console.log(`   NO Collateral: ${ethers.formatUnits(marketBefore.noCollateral, 6)} PYUSD`);
  console.log(`   Resolved: ${marketBefore.resolved}\n`);

  if (marketBefore.resolved) {
    console.log("✅ Market already resolved!\n");
  } else {
    // ============ RESOLVE MARKET ============
    console.log("=".repeat(60));
    console.log("STEP 1: RESOLVE MARKET");
    console.log("=".repeat(60) + "\n");

    console.log("Choose outcome:");
    console.log("   true  = Strategy succeeded (18% APR achieved)");
    console.log("   false = Strategy failed (didn't reach target)\n");

    // For testing, let's say it succeeded
    const success = true;
    
    console.log(`🎲 Resolving market as: ${success ? "SUCCESS ✅" : "FAILURE ❌"}`);
    
    try {
      const resolveTx = await futarchy.resolveMarket(PROPOSAL_ID, success);
      console.log(`   TX: ${resolveTx.hash}`);
      await resolveTx.wait();
      console.log("   ✅ Market resolved!\n");
    } catch (error: any) {
      console.error(`   ❌ Failed to resolve: ${error.message}\n`);
      if (error.message.includes("Not active")) {
        console.log("   💡 Market might not be active or deadline hasn't passed\n");
      }
      return;
    }
  }

  // Check market after resolution
  const marketAfter = await futarchy.getMarket(PROPOSAL_ID);
  console.log(`📊 Market Status (After):`);
  console.log(`   Outcome: ${marketAfter.outcome === 1n ? "YES (Success)" : marketAfter.outcome === 2n ? "NO (Failure)" : "Undecided"}`);
  console.log(`   Resolved: ${marketAfter.resolved}\n`);

  // ============ CLAIM WINNINGS ============
  console.log("=".repeat(60));
  console.log("STEP 2: CLAIM WINNINGS");
  console.log("=".repeat(60) + "\n");

  // Check position
  const position = await futarchy.getPosition(PROPOSAL_ID, owner.address);
  console.log(`👤 Your Position:`);
  console.log(`   YES Shares: ${ethers.formatUnits(position.yesShares, 6)}`);
  console.log(`   NO Shares: ${ethers.formatUnits(position.noShares, 6)}`);
  console.log(`   Funding: ${ethers.formatUnits(position.fundingAmount, 6)} PYUSD`);
  console.log(`   Already Claimed: ${position.claimed}\n`);

  if (position.claimed) {
    console.log("✅ Winnings already claimed!\n");
    return;
  }

  // Get PYUSD balance before
  const PYUSD_ADDRESS = process.env.OFT_ADDRESS || "0x6a87032589b837935b1a393dc905c84e908c6974";
  const pyusd = await ethers.getContractAt(
    ["function balanceOf(address) view returns (uint256)"],
    PYUSD_ADDRESS
  );
  
  const balanceBefore = await pyusd.balanceOf(owner.address);
  console.log(`💰 PYUSD Balance (Before): ${ethers.formatUnits(balanceBefore, 6)} PYUSD`);

  console.log("\n💸 Claiming winnings...");
  try {
    const claimTx = await futarchy.claimWinnings(PROPOSAL_ID);
    console.log(`   TX: ${claimTx.hash}`);
    await claimTx.wait();
    console.log("   ✅ Winnings claimed!\n");
  } catch (error: any) {
    console.error(`   ❌ Failed to claim: ${error.message}\n`);
    return;
  }

  // Get PYUSD balance after
  const balanceAfter = await pyusd.balanceOf(owner.address);
  const profit = balanceAfter - balanceBefore;
  
  console.log(`💰 PYUSD Balance (After): ${ethers.formatUnits(balanceAfter, 6)} PYUSD`);
  console.log(`📈 Profit: ${ethers.formatUnits(profit, 6)} PYUSD\n`);

  // ============ SUMMARY ============
  console.log("=".repeat(60));
  console.log("🎉 COMPLETE CYCLE FINISHED!");
  console.log("=".repeat(60) + "\n");

  console.log("📊 Final Summary:");
  console.log(`   Initial Investment: 60 PYUSD`);
  console.log(`   - 10 PYUSD (YES shares bet)`);
  console.log(`   - 50 PYUSD (funding contribution)`);
  console.log(`   Profit: ${ethers.formatUnits(profit, 6)} PYUSD`);
  console.log(`   Final Balance: ${ethers.formatUnits(balanceAfter, 6)} PYUSD`);
  
  const profitPercent = profit > 0n ? ((Number(profit) / 1000000 / 60) * 100).toFixed(2) : "0.00";
  console.log(`   ROI: ${profit > 0n ? "+" : ""}${profitPercent}%\n`);

  console.log("🔍 View on HashScan:");
  console.log(`   https://hashscan.io/testnet/contract/${FUTARCHY_ADDRESS}\n`);

  console.log("✅ Futarchy protocol working perfectly!\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Error:");
    console.error(error);
    process.exit(1);
  });