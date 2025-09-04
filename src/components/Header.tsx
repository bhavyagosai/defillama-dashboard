"use client";

import { ShieldCheck, Menu, Sun, Moon } from "lucide-react";
import { CustomConnectButton } from "./CustomConnectButton";
import Link from "next/link";
import { useUI } from "@/context/UIContext";
import { useThemeLocal } from "@/context/ThemeContext";
import { Button } from "./ui/button";

export function Header() {
  const { toggleSidebar } = useUI();
  const { theme, toggleTheme } = useThemeLocal();
  return (
    <header className="container mx-auto p-4 md:p-6 lg:px-8">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <button
            className="lg:hidden p-2 rounded-md hover:bg-muted"
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>
          <Link
            href={"/"}
            className="flex items-center gap-2 md:gap-3 text-lg md:text-xl font-bold text-foreground"
          >
            <ShieldCheck className="h-7 w-7 text-primary" />
            <h1>DeFi Dashboard</h1>
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <CustomConnectButton />
          <Button
            variant="outline"
            className="cursor-pointer"
            onClick={toggleTheme}
          >
            {theme === "light" ? <Moon /> : <Sun />}
          </Button>
        </div>
      </div>
    </header>
  );
}
