import { http, createConfig } from 'wagmi'
import { injected } from 'wagmi/connectors'

export const config = createConfig({
  chains: [{
    id: 296,
    name: 'Hedera Testnet',
    nativeCurrency: {
      decimals: 18,
      name: 'HBAR',
      symbol: 'HBAR',
    },
    rpcUrls: {
      default: { http: ['https://testnet.hashio.io/api'] },
    },
    blockExplorers: {
      default: { 
        name: 'HashScan', 
        url: 'https://hashscan.io/testnet' 
      },
    },
  }],
  connectors: [injected()],
  transports: {
    296: http('https://testnet.hashio.io/api'),
  },
})