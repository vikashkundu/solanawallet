import { Outlet, createRootRoute, useNavigate, Link } from '@tanstack/react-router'
import { Button } from "@/components/ui/button";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { useEffect, useState } from "react";
import { createPortal } from 'react-dom'

export const Route = createRootRoute({
  component: RootComponent,
})

const formatAddress = (address: string | null) => {
    if (!address) return 'Connect Wallet';
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
}

const WalletConnectButton: React.FC = () => {
    const { publicKey, connected, disconnect, connecting } = useWallet();
    const { setVisible } = useWalletModal();
    const navigate = useNavigate();

    const [optionsOpen, setOptionsOpen] = useState(false);

    useEffect(() => {
        // Only redirect to dashboard if we're on the home page when connecting
        if (connected && window.location.pathname === '/') {
            navigate({to: "/dashboard"});
        }
        // Only redirect to home when disconnecting
        if (!connected && window.location.pathname !== '/') {
            navigate({to: "/"});
        }
    }, [connected, navigate]);

    useEffect(() => {
        if (optionsOpen) {
            // prevent background scroll while modal is open
            const prev = document.body.style.overflow;
            document.body.style.overflow = 'hidden';
            return () => { document.body.style.overflow = prev; };
        }
    }, [optionsOpen]);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setOptionsOpen(false);
        };
        if (optionsOpen) window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [optionsOpen]);

    // allow other parts of the app to open this modal (e.g. mobile menu)
    useEffect(() => {
        const handler = () => setOptionsOpen(true);
        window.addEventListener('open-wallet-options', handler as EventListener);
        return () => window.removeEventListener('open-wallet-options', handler as EventListener);
    }, []);

    const handleCopyAddress = () => {
        if (publicKey) navigator.clipboard.writeText(publicKey.toBase58());
        setOptionsOpen(false);
    }

    const handleChangeWallet = () => {
        disconnect();
        setVisible(true);
        setOptionsOpen(false);
    }

    const handleDisconnectWallet = () => {
        disconnect();
        navigate({to: "/"});
        setOptionsOpen(false);
    }

    const handleOpenConnectModal = () => setVisible(true);

    if (connecting) return <Button disabled>Connecting...</Button>;

    if (connected && publicKey) {
        return (
            <>
                <Button variant="outline" className="w-32 text-primary-foreground bg-primary" onClick={() => setOptionsOpen(true)}>
                    {formatAddress(publicKey.toBase58())}
                </Button>

                {optionsOpen && createPortal(
                    <div className="fixed inset-0 z-50 flex items-center justify-center">
                        <div className="absolute inset-0 bg-black/50" onClick={() => setOptionsOpen(false)} />

                        <div className="relative w-full max-w-md mx-4 bg-white rounded-lg shadow-xl p-6">
                            <div className="flex justify-between items-start">
                                <h3 className="text-lg font-semibold">Wallet</h3>
                                <button aria-label="Close" onClick={() => setOptionsOpen(false)} className="text-gray-500 hover:text-gray-700">✕</button>
                            </div>

                            <div className="mt-4 flex flex-col gap-3">
                                <div className="text-sm text-gray-600 break-all">{publicKey.toBase58()}</div>
                                <Button onClick={handleCopyAddress} className="w-full bg-slate-100 text-slate-900">Copy Address</Button>
                                <Button onClick={handleChangeWallet} className="w-full bg-slate-100 text-slate-900">Change Wallet</Button>
                                <Button onClick={handleDisconnectWallet} className="w-full bg-red-600 text-white">Disconnect</Button>
                            </div>
                        </div>
                    </div>,
                    document.body
                )}
            </>
        );
    }

    return (
        <Button onClick={handleOpenConnectModal}>
            Connect Wallet
        </Button>
    );
}


const Nav: React.FC = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const { connected, publicKey } = useWallet();
    const { setVisible } = useWalletModal();

    const handleLinkClick = () => setMenuOpen(false);

    const handleConnect = () => {
        setVisible(true);
        setMenuOpen(false);
    }

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-indigo-900 text-white h-16 shadow-lg">
            <div className="container mx-auto h-full px-6 grid grid-cols-3 items-center">
                {/* left: logo */}
                <div className="flex items-center gap-6 col-start-1">
                    <h1 className="text-2xl font-bold text-white tracking-wider leading-none">SolPay</h1>
                </div>

                {/* center: centered links (md+) */}
                <div className="col-start-2 flex justify-center">
                    <div className="hidden md:flex gap-6 items-center">
                        <Link to="/dashboard" className="text-white hover:text-indigo-200">Dashboard</Link>
                        <Link to="/sendmoney" className="text-white hover:text-indigo-200">Send Money</Link>
                    </div>
                </div>

                {/* right: hamburger (mobile) and wallet (md+) */}
                <div className="col-start-3 flex justify-end items-center">
                    {/* hamburger - always visible on mobile */}
                    <button
                        aria-expanded={menuOpen}
                        aria-label="Toggle navigation"
                        onClick={() => setMenuOpen((s) => !s)}
                        className="md:hidden p-2 mr-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>

                    {/* md+ show wallet button on right */}
                    <div className="hidden md:flex">
                        <WalletConnectButton />
                    </div>
                </div>

                {/* Expanded mobile menu (full-width) */}
                {menuOpen && (
                    <div className="fixed top-16 left-0 right-0 bg-indigo-900 text-white p-4 flex flex-col space-y-2 z-40 rounded-none md:hidden">
                        <Link to="/dashboard" onClick={handleLinkClick} className="w-full block py-3 text-center">Dashboard</Link>
                        <Link to="/sendmoney" onClick={handleLinkClick} className="w-full block py-3 text-center">Send Money</Link>

                        <div className="pt-2 border-t border-indigo-800 mt-2">
                            <div className="w-full flex flex-col items-center gap-2">
                                {!connected && (
                                    <Button onClick={handleConnect} className="w-full max-w-xs">Connect Wallet</Button>
                                )}

                                {connected && (
                                    <>
                                        <Button
                                            onClick={() => { window.dispatchEvent(new Event('open-wallet-options')); setMenuOpen(false); }}
                                            className="w-full text-primary-foreground bg-primary"
                                            variant="outline"
                                        >
                                            {formatAddress(publicKey ? publicKey.toBase58() : null)}
                                        </Button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
};

function RootComponent() {
  return (
    <>
        {/* <div className="p-2 flex gap-2">
			<Link to="/" className="[&.active]:font-bold">
				Home
			</Link> {' '}
			<Link to="/about" className="[&.active]:font-bold">
				About
			</Link>
			<Button>Click me</Button>
        </div> */}
		{/* <hr/> */}
		<Nav />
		<Outlet />
    </>
  )
}
