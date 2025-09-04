"use client";

import { useEffect, useState } from "react";
import { SplashScreen } from "@/components/SplashScreen";
import { Web3Provider } from "@/providers/Web3Provider";
import { WalletProvider } from "@/context/WalletContext";
import { DataProvider } from "@/context/DataContext";
import { Header } from "@/components/Header";

export function ClientLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Ensure the splash screen only shows once per session
    if (sessionStorage.getItem("splashScreenShown")) {
      setIsLoading(false);
    }
  }, []);

  const handleSplashFinish = () => {
    // Session storage flag so that the splash screen doesn't show again
    sessionStorage.setItem("splashScreenShown", "true");
    setIsLoading(false);
  };

  if (isLoading) {
    return <SplashScreen onFinish={handleSplashFinish} />;
  }

  return (
    <Web3Provider>
      <WalletProvider>
        <DataProvider>
          <Header />
          {children}
        </DataProvider>
      </WalletProvider>
    </Web3Provider>
  );
}
