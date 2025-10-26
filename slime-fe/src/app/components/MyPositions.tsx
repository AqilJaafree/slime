'use client';

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { ADDRESSES, FUTARCHY_ABI, DECIMALS } from '@/src/lib/contracts';
import { useWallet } from '@/src/context/WalletContext';

export default function MyPositions() {
  const { address } = useWallet();
  const [positions, setPositions] = useState<any[]>([]);

  useEffect(() => {
    if (address) loadPositions();
  }, [address]);

  const loadPositions = async () => {
    if (!address) return;

    try {
      const provider = new ethers.JsonRpcProvider('https://testnet.hashio.io/api');
      const contract = new ethers.Contract(ADDRESSES.FUTARCHY, FUTARCHY_ABI, provider);

      const loaded = [];
      for (let i = 1; i <= 10; i++) {
        try {
          const position = await contract.getUserPosition(i, address);
          if (position.yesShares > 0 || position.noShares > 0 || position.fundingContributed > 0) {
            loaded.push({ proposalId: i, ...position });
          }
        } catch (error) {
          break;
        }
      }
      setPositions(loaded);
    } catch (error) {
      console.error('Load positions error:', error);
    }
  };

  if (!address) {
    return (
      <div className="p-6 border border-white/10 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">My Positions</h2>
        <p className="text-gray-400">Connect wallet to view positions</p>
      </div>
    );
  }

  return (
    <div className="p-6 border border-white/10 rounded-lg space-y-4">
      <h2 className="text-2xl font-bold">My Positions</h2>
      
      {positions.length === 0 ? (
        <p className="text-gray-400">No positions yet</p>
      ) : (
        <div className="space-y-3">
          {positions.map((pos) => (
            <div key={pos.proposalId} className="p-4 bg-white/5 rounded-lg">
              <p className="font-bold">Proposal #{pos.proposalId}</p>
              <p className="text-sm text-gray-400">YES: {ethers.formatUnits(pos.yesShares, DECIMALS.PYUSD)}</p>
              <p className="text-sm text-gray-400">NO: {ethers.formatUnits(pos.noShares, DECIMALS.PYUSD)}</p>
              <p className="text-sm text-gray-400">Funded: {ethers.formatUnits(pos.fundingContributed, DECIMALS.PYUSD)} PYUSD</p>
              <p className="text-sm text-emerald-400">
                {pos.claimed ? '✓ Claimed' : 'Not claimed'}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}