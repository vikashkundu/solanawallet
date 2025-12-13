import { createRouter, RouterProvider } from "@tanstack/react-router";
import { useMemo } from "react";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { clusterApiUrl } from "@solana/web3.js";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { routeTree } from './routeTree.gen'

//creating a new router instance
const router = createRouter({ routeTree });

//registering the router for typesafety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router,
  }
}

const App = () => {
  const endpoint = clusterApiUrl("devnet");
  const wallets = useMemo(() => [], []);
  return (
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={wallets} autoConnect={true}>
          <WalletModalProvider>
            <RouterProvider router={router} />
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
  );
}

export default App;