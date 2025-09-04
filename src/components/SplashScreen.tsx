"use client";

import { useEffect, useState } from "react";
import { ShieldCheck } from "lucide-react";

interface SplashScreenProps {
  onFinish: () => void; // callback to tell parent "done showing splash"
}

export function SplashScreen({ onFinish }: SplashScreenProps) {
  const [isFadingOut, setIsFadingOut] = useState(false); // false = visible and vice versa

  useEffect(() => {
    // fade-out animation timer
    const fadeOutTimer = setTimeout(() => {
      setIsFadingOut(true); // start fade-out after 1.5s
    }, 1500);

    const finishTimer = setTimeout(() => {
      onFinish();
    }, 2000); // 1.5s visibility + 0.5s fade-out duration to match loading ---> tell parent: splash done after 2s

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
