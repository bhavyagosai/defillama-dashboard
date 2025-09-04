"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useAccount, useDisconnect } from "wagmi";

interface WalletContextType {
  isConnected: boolean;
  address: string | undefined;
  isConnecting: boolean;
  disconnect: () => void;
  isYieldAggregatorUnlocked: boolean;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const { address, isConnected, isConnecting } = useAccount();
  const { disconnect } = useDisconnect();
  const [isYieldAggregatorUnlocked, setIsYieldAggregatorUnlocked] = useState(false);

  // Update unlock state when wallet connection changes
  useEffect(() => {
    setIsYieldAggregatorUnlocked(isConnected);
  }, [isConnected]);

  const value = {
    isConnected,
    address,
    isConnecting,
    disconnect,
    isYieldAggregatorUnlocked,
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
}
