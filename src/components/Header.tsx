"use client";

import { ShieldCheck } from "lucide-react";
import { CustomConnectButton } from "./CustomConnectButton";
import Link from "next/link";

export function Header() {
  return (
    <header className="container mx-auto p-4 md:p-6 lg:px-8">
      <div className="flex justify-between items-center">
        <Link
          href={"/"}
          className="flex items-center gap-3 text-xl font-bold text-foreground"
        >
          <ShieldCheck className="h-7 w-7 text-primary" />
          <h1>DeFi Dashboard</h1>
        </Link>
        <div>
          <CustomConnectButton />
        </div>
      </div>
    </header>
  );
}
