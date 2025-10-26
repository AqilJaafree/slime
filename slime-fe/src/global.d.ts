interface Window {
  ethereum?: {
    isMetaMask?: boolean;
    providers?: any[];
    request: (args: { method: string; params?: any[] }) => Promise<any>;
  };
}