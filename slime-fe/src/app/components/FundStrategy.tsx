'use client';

import { useState } from 'react';
import { ethers } from 'ethers';
import { ADDRESSES, FUTARCHY_ABI, PYUSD_ABI, DECIMALS } from '@/src/lib/contracts';
import { useWallet } from '@/src/context/WalletContext';

export default function FundStrategy() {
  const { address } = useWallet();
  const [proposalId, setProposalId] = useState('1');
  const [amount, setAmount] = useState('100');

  const handleFund = async () => {
    if (!address) {
      alert('Connect wallet');
      return;
    }

    try {
      const metamask = window.ethereum?.providers?.find((p: any) => p.isMetaMask) || window.ethereum;
      const provider = new ethers.BrowserProvider(metamask as any);
      const signer = await provider.getSigner();
      const amountWei = ethers.parseUnits(amount, DECIMALS.PYUSD);

      // Approve
      const pyusd = new ethers.Contract(ADDRESSES.PYUSD, PYUSD_ABI, signer);
      const approveTx = await pyusd.approve(ADDRESSES.FUTARCHY, amountWei);
      await approveTx.wait();

      // Fund
      const futarchy = new ethers.Contract(ADDRESSES.FUTARCHY, FUTARCHY_ABI, signer);
      const fundTx = await futarchy.fundStrategy(proposalId, amountWei);
      await fundTx.wait();

      alert('Strategy funded!');
    } catch (error: any) {
      alert(error.message || 'Failed');
    }
  };

  return (
    <div className="p-6 border border-white/10 rounded-lg space-y-4">
      <h2 className="text-2xl font-bold">Fund Strategy</h2>

      <div>
        <label className="block text-sm mb-2">Proposal ID</label>
        <input
          type="number"
          value={proposalId}
          onChange={(e) => setProposalId(e.target.value)}
          className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
        />
      </div>

      <div>
        <label className="block text-sm mb-2">Amount (PYUSD)</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
        />
      </div>

      <button
        onClick={handleFund}
        disabled={!address}
        className="w-full px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg disabled:opacity-50"
      >
        {address ? 'Fund Strategy' : 'Connect Wallet'}
      </button>
    </div>
  );
}