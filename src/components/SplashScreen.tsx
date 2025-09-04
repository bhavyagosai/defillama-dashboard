"use client";

import { useEffect, useState } from "react";
import { ShieldCheck } from "lucide-react";

interface SplashScreenProps {
  onFinish: () => void;
}

export function SplashScreen({ onFinish }: SplashScreenProps) {
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // fade-out animation timer
    const fadeOutTimer = setTimeout(() => {
      setIsFadingOut(true);
    }, 1500);

    const finishTimer = setTimeout(() => {
      onFinish();
    }, 2000); // 1.5s visibility + 0.5s fade-out duration to match loading

    // Cleanup timers if unmount happens
    return () => {
      clearTimeout(fadeOutTimer);
      clearTimeout(finishTimer);
    };
  }, [onFinish]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-background transition-opacity duration-500 ease-in-out
      ${isFadingOut ? "opacity-0" : "opacity-100"}`}
    >
      <div className="flex items-center gap-3 text-2xl md:text-3xl font-bold text-foreground animate-pulse">
        <ShieldCheck className="h-8 w-8 text-primary" />
        <h1>DeFi Dashboard</h1>
      </div>
    </div>
  );
}
