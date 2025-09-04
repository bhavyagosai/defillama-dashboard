"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { useUI } from "@/context/UIContext";
import { usePathname } from "next/navigation";
import { Home, BarChart2, Settings, Layers, Wallet } from "lucide-react";
import { useWallet } from "@/context/WalletContext";

export function Sidebar() {
  const { isSidebarOpen, closeSidebar } = useUI();
  const { isConnected } = useWallet();

  return (
    <>
      <div
        onClick={closeSidebar}
        className={cn(
          "fixed inset-0 z-30 bg-black/30 transition-opacity lg:hidden",
          isSidebarOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
      />
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-60 shrink-0 border-r bg-card transition-transform duration-200",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full",
          "lg:translate-x-0"
        )}
      >
        <div className="p-4 text-sm text-muted-foreground">Categories</div>
        <nav className="px-2 space-y-1">
          <NavItem href="/" icon={Home} label="Dashboard" />
          <NavItem href="#" icon={BarChart2} label="Analytics" />
          <NavItem href="#" icon={Layers} label="Strategies" />
          <NavItem href="#" icon={Wallet} label="Wallet" />
          <NavItem href="#" icon={Settings} label="Settings" />
        </nav>
        <div
          className={cn(
            "absolute bottom-0 font-bold left-0 right-0 p-3 text-xs flex items-center gap-2",
            isConnected ? "text-green-500" : "text-muted-foreground"
          )}
        >
          {isConnected ? (
            <>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              Connected
            </>
          ) : (
            <>
              <Wallet className="h-4 w-4 text-muted-foreground" />
              <span>Not Connected</span>
            </>
          )}
        </div>
      </aside>
    </>
  );
}

function NavItem({
  href,
  icon: Icon,
  label,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
}) {
  const pathname = usePathname();

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-muted",
        pathname === "/" && label === "Dashboard" ? "bg-muted" : ""
      )}
    >
      <Icon className="h-4 w-4 text-muted-foreground" />
      <span>{label}</span>
    </Link>
  );
}
