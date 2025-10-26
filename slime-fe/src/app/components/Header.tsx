'use client';

import { useState, useEffect } from 'react';
import { Wallet } from 'lucide-react';
import { useWallet } from '@/src/context/WalletContext';

export default function Header() {
  const { address, connect, disconnect } = useWallet();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">⚡</span>
          <span className="text-xl font-bold">SLIME</span>
        </div>

        <button 
          onClick={address ? disconnect : connect}
          className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-black font-semibold rounded-lg transition-all"
        >
          {address ? (
            <span className="flex items-center gap-2">
              <Wallet size={16} />
              {address.slice(0, 6)}...{address.slice(-4)}
            </span>
          ) : (
            'Connect Wallet'
          )}
        </button>
      </div>
    </header>
  );
}