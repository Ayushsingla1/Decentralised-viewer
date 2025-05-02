import { WagmiProvider, createConfig, http } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import React from "react";
import { type Chain } from "viem";

export const Pharos: Chain = {
  id: 50002,
  name: "Pharos",
  nativeCurrency: {
    decimals: 18,
    name: "Pharos",
    symbol: "PTT",
  },
  rpcUrls: {
    default: { http :  ["https://devnet.dplabs-internal.com"] },
  },
  testnet: true,
};

export const config = createConfig(
  getDefaultConfig({
    chains: [Pharos],
    transports: {
      [Pharos.id]: http("https://devnet.dplabs-internal.com"),
    },
    walletConnectProjectId: "123",
    appName: "StatusDAO",
  }),
);

const queryClient = new QueryClient();

const WalletProvider = ({ children } : {children : React.ReactNode}) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider>{children}</ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default WalletProvider;