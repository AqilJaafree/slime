'use client';

import { useState } from 'react';
import { ethers } from 'ethers';
import { ADDRESSES, FUTARCHY_ABI } from '@/src/lib/contracts';
import { useWallet } from '@/src/context/WalletContext';

export default function CreateProposal() {
  const { address } = useWallet();
  const [name, setName] = useState('');
  const [apr, setApr] = useState('650'); // 6.5%
  const [goal, setGoal] = useState('1000');
  const [duration, setDuration] = useState('7'); // days

  const handleCreate = async () => {
    if (!address) {
      alert('Connect wallet');
      return;
    }

    try {
      const metamask = window.ethereum?.providers?.find((p: any) => p.isMetaMask) || window.ethereum;
      const provider = new ethers.BrowserProvider(metamask as any);
      const signer = await provider.getSigner();
      
      const contract = new ethers.Contract(ADDRESSES.FUTARCHY, FUTARCHY_ABI, signer);
      const durationSeconds = Number(duration) * 24 * 60 * 60;
      
      const tx = await contract.createProposal(
        name,
        Number(apr),
        ethers.parseUnits(goal, 6),
        durationSeconds
      );
      
      await tx.wait();
      alert('Proposal created!');
    } catch (error: any) {
      alert(error.message || 'Failed');
    }
  };

  return (
    <div className="p-6 border border-white/10 rounded-lg space-y-4">
      <h2 className="text-2xl font-bold">Create Proposal</h2>

      <div>
        <label className="block text-sm mb-2">Strategy Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="HBARX Liquid Staking"
          className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
        />
      </div>

      <div>
        <label className="block text-sm mb-2">Target APR (basis points, e.g. 650 = 6.5%)</label>
        <input
          type="number"
          value={apr}
          onChange={(e) => setApr(e.target.value)}
          className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
        />
      </div>

      <div>
        <label className="block text-sm mb-2">Funding Goal (PYUSD)</label>
        <input
          type="number"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
        />
      </div>

      <div>
        <label className="block text-sm mb-2">Duration (days)</label>
        <input
          type="number"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
        />
      </div>

      <button
        onClick={handleCreate}
        disabled={!address}
        className="w-full px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-black font-semibold rounded-lg disabled:opacity-50"
      >
        {address ? 'Create Proposal' : 'Connect Wallet'}
      </button>
    </div>
  );
}