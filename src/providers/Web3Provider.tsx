"use client";

import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { mainnet, polygon, arbitrum, optimism } from "wagmi/chains";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

// Set up the wagmi config using RainbowKit's helper
const config = getDefaultConfig({
  appName: "DeFi Dashboard",
  projectId:
    process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ??
    (() => {
      console.error(
        "Missing NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID environment variable"
      );
      throw new Error("Missing: Wallet Connect Project ID");
    })(),
  chains: [mainnet, polygon, arbitrum, optimism],
  ssr: true, // Enable server-side rendering support
});

const queryClient = new QueryClient();

export function Web3Provider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider showRecentTransactions={true} modalSize="compact">
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
