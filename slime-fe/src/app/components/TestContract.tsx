'use client';

import { useState } from 'react';
import { ethers } from 'ethers';
import { ADDRESSES, PYUSD_ABI, DECIMALS } from '@/src/lib/contracts';

export default function TestContract() {
  const [balance, setBalance] = useState<string>('');

  const checkBalance = async () => {
    try {
      const provider = new ethers.JsonRpcProvider('https://testnet.hashio.io/api');
      const contract = new ethers.Contract(ADDRESSES.PYUSD, PYUSD_ABI, provider);
      const bal = await contract.balanceOf(ADDRESSES.BACKEND_WALLET);
      const formatted = ethers.formatUnits(bal, DECIMALS.PYUSD);
      setBalance(formatted);
    } catch (error) {
      console.error('Error:', error);
      setBalance('Error');
    }
  };

  return (
    <div className="p-6 border border-white/10 rounded-lg">
      <button 
        onClick={checkBalance}
        className="px-6 py-2 bg-emerald-500 text-black rounded-lg"
      >
        Check PYUSD Balance
      </button>
      {balance && (
        <p className="mt-4 text-white">Balance: {balance} PYUSD</p>
      )}
    </div>
  );
}