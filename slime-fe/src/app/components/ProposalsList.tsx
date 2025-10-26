'use client';

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { ADDRESSES, FUTARCHY_ABI } from '@/src/lib/contracts';

export default function ProposalsList() {
  const [proposals, setProposals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProposals();
  }, []);

  const loadProposals = async () => {
    try {
      const provider = new ethers.JsonRpcProvider('https://testnet.hashio.io/api');
      const contract = new ethers.Contract(ADDRESSES.FUTARCHY, FUTARCHY_ABI, provider);
      
      const loaded = [];
      for (let i = 1; i <= 10; i++) {
        try {
          const proposal = await contract.getProposal(i);
          loaded.push({
            id: i,
            strategyName: proposal[2] || 'Unknown',
            targetAPR: proposal[3] || 0n,
            fundingGoal: proposal[4] || 0n,
            fundingRaised: proposal[5] || 0n,
            deadline: proposal[6] || 0n,
            status: proposal[7] || 0,
          });
        } catch (error) {
          console.log(`Proposal ${i} not found`);
          break;
        }
      }
      setProposals(loaded);
      setLoading(false);
    } catch (error) {
      console.error('Load error:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 border border-white/10 rounded-lg">
        <p className="text-gray-400">Loading proposals...</p>
      </div>
    );
  }

  if (proposals.length === 0) {
    return (
      <div className="p-6 border border-white/10 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Active Proposals</h2>
        <p className="text-gray-400">No proposals yet. Create the first one!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Active Proposals</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {proposals.map((p) => (
          <div key={p.id} className="p-6 border border-white/10 rounded-lg hover:border-emerald-500/50 transition-all">
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-xl font-bold">{p.strategyName}</h3>
              <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 text-xs rounded">
                #{p.id}
              </span>
            </div>
            <div className="space-y-1 text-sm">
              <p className="text-gray-400">
                Target APR: <span className="text-white">{Number(p.targetAPR) / 100}%</span>
              </p>
              <p className="text-gray-400">
                Goal: <span className="text-white">{ethers.formatUnits(p.fundingGoal, 6)} PYUSD</span>
              </p>
              <p className="text-gray-400">
                Raised: <span className="text-emerald-400">{ethers.formatUnits(p.fundingRaised, 6)} PYUSD</span>
              </p>
              <div className="mt-2 w-full h-2 bg-white/5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-500"
                  style={{ 
                    width: `${Math.min((Number(p.fundingRaised) / Number(p.fundingGoal)) * 100, 100)}%` 
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}