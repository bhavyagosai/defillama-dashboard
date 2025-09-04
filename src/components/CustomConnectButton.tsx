"use client";

import { ConnectButton as RainbowConnectButton } from "@rainbow-me/rainbowkit";
import { Button } from "@/components/ui/button";
import { User, Wallet } from "lucide-react";

export function CustomConnectButton() {
  return (
    <RainbowConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        const ready = mounted && authenticationStatus !== "loading";
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === "authenticated");

        return (
          <div
            {...(!ready && {
              "aria-hidden": "true",
              style: {
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <Button
                    onClick={openConnectModal}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer"
                  >
                    <span className="hidden md:block">Connect Wallet</span>
                    <span className="md:hidden block">
                      <Wallet />
                    </span>
                  </Button>
                );
              }

              if (chain.unsupported) {
                return (
                  <Button onClick={openChainModal} variant="destructive">
                    Wrong network
                  </Button>
                );
              }

              return (
                <div className="flex items-center gap-2">
                  <Button
                    onClick={openChainModal}
                    variant="outline"
                    className="flex items-center gap-2 cursor-pointer p-2 md:px-3 md:py-2"
                    aria-label="Change network"
                  >
                    {chain.hasIcon && (
                      <div
                        style={{
                          background: chain.iconBackground,
                          width: 16,
                          height: 16,
                          borderRadius: 999,
                          overflow: "hidden",
                        }}
                      >
                        {chain.iconUrl && (
                          <img
                            alt={chain.name ?? "Chain icon"}
                            src={chain.iconUrl}
                            style={{ width: 16, height: 16 }}
                          />
                        )}
                      </div>
                    )}
                    <span className="hidden md:inline">{chain.name}</span>
                  </Button>

                  <Button
                    onClick={openAccountModal}
                    variant="outline"
                    className="flex items-center gap-2 cursor-pointer p-2 md:px-3 md:py-2"
                    aria-label="Account"
                  >
                    <span className="md:hidden">
                      <User width={16} height={16} />
                    </span>
                    <span className="hidden md:inline">
                      {account.displayName}
                    </span>
                    {account.displayBalance && (
                      <span className="hidden md:inline">
                        {" "}
                        ({account.displayBalance})
                      </span>
                    )}
                  </Button>
                </div>
              );
            })()}
          </div>
        );
      }}
    </RainbowConnectButton.Custom>
  );
}
