'use client';

import { useState } from 'react';
import { ethers } from 'ethers';
import { ADDRESSES, FUTARCHY_ABI } from '@/src/lib/contracts';
import { useWallet } from '@/src/context/WalletContext';

export default function ClaimWinnings() {
  const { address } = useWallet();
  const [proposalId, setProposalId] = useState('1');

  const handleClaim = async () => {
    if (!address) {
      alert('Connect wallet');
      return;
    }

    try {
      const metamask = window.ethereum?.providers?.find((p: any) => p.isMetaMask) || window.ethereum;
      const provider = new ethers.BrowserProvider(metamask as any);
      const signer = await provider.getSigner();

      const futarchy = new ethers.Contract(ADDRESSES.FUTARCHY, FUTARCHY_ABI, signer);
      const tx = await futarchy.claimWinnings(proposalId);
      await tx.wait();

      alert('Winnings claimed!');
    } catch (error: any) {
      alert(error.message || 'Failed');
    }
  };

  return (
    <div className="p-6 border border-white/10 rounded-lg space-y-4">
      <h2 className="text-2xl font-bold">Claim Winnings</h2>

      <div>
        <label className="block text-sm mb-2">Proposal ID</label>
        <input
          type="number"
          value={proposalId}
          onChange={(e) => setProposalId(e.target.value)}
          className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
        />
      </div>

      <button
        onClick={handleClaim}
        disabled={!address}
        className="w-full px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-black font-semibold rounded-lg disabled:opacity-50"
      >
        {address ? 'Claim Winnings' : 'Connect Wallet'}
      </button>
    </div>
  );
}