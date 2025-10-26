'use client';

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { ADDRESSES, FUTARCHY_ABI, PYUSD_ABI, DECIMALS } from '@/src/lib/contracts';
import { useWallet } from '@/src/context/WalletContext';

export default function BuyShares() {
  const { address } = useWallet();
  const [mounted, setMounted] = useState(false);
  const [balance, setBalance] = useState<string>('0');
  const [proposalId, setProposalId] = useState('1');
  const [amount, setAmount] = useState('10');
  const [isYes, setIsYes] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (address) {
      getBalance(address);
    }
  }, [address]);

  const getMetaMask = () => {
    if (typeof window === 'undefined') return null;
    if (window.ethereum?.providers) {
      return window.ethereum.providers.find((p: any) => p.isMetaMask);
    }
    if (window.ethereum?.isMetaMask) {
      return window.ethereum;
    }
    return null;
  };

  const getBalance = async (addr: string) => {
    try {
      const metamask = getMetaMask();
      if (!metamask) return;
      
      const provider = new ethers.BrowserProvider(metamask as any);
      const contract = new ethers.Contract(ADDRESSES.PYUSD, PYUSD_ABI, provider);
      const bal = await contract.balanceOf(addr);
      setBalance(ethers.formatUnits(bal, DECIMALS.PYUSD));
    } catch (error) {
      console.error('Balance error:', error);
    }
  };

  const handleBuy = async () => {
    if (!address) {
      alert('Connect wallet first');
      return;
    }

    try {
      const metamask = getMetaMask();
      if (!metamask) {
        alert('MetaMask not found');
        return;
      }

      const provider = new ethers.BrowserProvider(metamask as any);
      const signer = await provider.getSigner();
      const amountWei = ethers.parseUnits(amount, DECIMALS.PYUSD);

      const pyusd = new ethers.Contract(ADDRESSES.PYUSD, PYUSD_ABI, signer);
      const approveTx = await pyusd.approve(ADDRESSES.FUTARCHY, amountWei);
      await approveTx.wait();

      const futarchy = new ethers.Contract(ADDRESSES.FUTARCHY, FUTARCHY_ABI, signer);
      const buyTx = await futarchy.buyShares(proposalId, isYes, amountWei);
      await buyTx.wait();

      alert('Success!');
      getBalance(address);
    } catch (error: any) {
      alert(error.message || 'Failed');
    }
  };

  if (!mounted) return null;

  return (
    <div className="p-6 border border-white/10 rounded-lg space-y-4">
      <h2 className="text-2xl font-bold">Buy Shares</h2>
      <p className="text-gray-400">Balance: {balance} PYUSD</p>

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

      <div className="flex gap-4">
        <button
          onClick={() => setIsYes(true)}
          className={`flex-1 px-4 py-2 rounded-lg font-semibold ${
            isYes ? 'bg-emerald-500 text-black' : 'bg-white/5'
          }`}
        >
          YES
        </button>
        <button
          onClick={() => setIsYes(false)}
          className={`flex-1 px-4 py-2 rounded-lg font-semibold ${
            !isYes ? 'bg-red-500 text-black' : 'bg-white/5'
          }`}
        >
          NO
        </button>
      </div>

      <button
        onClick={handleBuy}
        disabled={!address}
        className="w-full px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-black font-semibold rounded-lg disabled:opacity-50"
      >
        {address ? 'Buy Shares' : 'Connect Wallet First'}
      </button>
    </div>
  );
}