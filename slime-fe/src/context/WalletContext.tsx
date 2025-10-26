'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface WalletContextType {
  address: string | null;
  connect: () => Promise<void>;
  disconnect: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);

  useEffect(() => {
    checkConnection();
  }, []);

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

  const checkConnection = async () => {
    const metamask = getMetaMask();
    if (metamask) {
      try {
        const accounts = await metamask.request({ method: 'eth_accounts' });
        if (accounts.length > 0) setAddress(accounts[0]);
      } catch (error) {
        console.error('Check error:', error);
      }
    }
  };

  const connect = async () => {
    const metamask = getMetaMask();
    if (!metamask) {
      alert('Install MetaMask');
      return;
    }

    try {
      await metamask.request({
        method: 'wallet_addEthereumChain',
        params: [{
          chainId: '0x128',
          chainName: 'Hedera Testnet',
          nativeCurrency: { name: 'HBAR', symbol: 'HBAR', decimals: 18 },
          rpcUrls: ['https://testnet.hashio.io/api'],
          blockExplorerUrls: ['https://hashscan.io/testnet'],
        }],
      });

      const accounts = await metamask.request({ method: 'eth_requestAccounts' });
      setAddress(accounts[0]);
    } catch (error: any) {
      console.error('Connect error:', error);
    }
  };

  const disconnect = () => {
    setAddress(null);
  };

  return (
    <WalletContext.Provider value={{ address, connect, disconnect }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) throw new Error('useWallet must be used within WalletProvider');
  return context;
}