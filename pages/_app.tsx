import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { Connection, PublicKey } from "@solana/web3.js";
import * as anchor from "@project-serum/anchor";
import React, { FC, useMemo } from 'react';
import { ConnectionProvider, useAnchorWallet, useWallet, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import {
    LedgerWalletAdapter,
    PhantomWalletAdapter,
    SlopeWalletAdapter,
    SolflareWalletAdapter,
    SolletExtensionWalletAdapter,
    SolletWalletAdapter,
    TorusWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import {
    WalletModalProvider,
    WalletDisconnectButton,
    WalletMultiButton
} from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';
import Layout from '../components/layout';
import { ThemeProvider } from 'next-themes'


// Default styles that can be overridden by your app
require('@solana/wallet-adapter-react-ui/styles.css');

const SOLANA_NEWS_PROGRAM = "HsmqAxBShotA5CCn9w6QZn1jZnsKwffkjhuzc4ChvDQE";
// const SOLANA_NEWS_PROGRAM = "DjEMjxwVGj65CF22aS7davstDVbfNfeTDzAYgSk2XMch";
// const SOLANA_NEWS_PROGRAM = "F57bCbfwFApSLvMkZJ63AdSTmzQTq6PU3HrjNy2KU8f5"
// const SOLANA_NEWS_PROGRAM = "BZzabrjKSxajzg345WeiKTBzNFsE4wDMeKMeasZo4WAb";
export const programID = new PublicKey(SOLANA_NEWS_PROGRAM);


// const endpoint = "http://localhost:8899";
const endpoint = "https://api.devnet.solana.com";

export const defaultKey = new PublicKey('11111111111111111111111111111111');


export const connection = new anchor.web3.Connection(endpoint);


// export const wallet: any = useAnchorWallet();

// export const program = useProgram({ connection, wallet });

function MyApp({ Component, pageProps }: AppProps) {
  
  // const network = WalletAdapterNetwork.Devnet;

    // You can also provide a custom RPC endpoint.
    // const endpoint = useMemo(() => clusterApiUrl(network), [network]);

    // @solana/wallet-adapter-wallets includes all the adapters but supports tree shaking and lazy loading --
    // Only the wallets you configure here will be compiled into your application, and only the dependencies
    // of wallets that your users connect to will be loaded.
    const wallets = useMemo(
        () => [
            new PhantomWalletAdapter(),
            new SlopeWalletAdapter(),
            new SolflareWalletAdapter(),
            new TorusWalletAdapter(),
            new LedgerWalletAdapter(),
            new SolletWalletAdapter(),
            new SolletExtensionWalletAdapter(),
        ],
        []
    );


    return (
        <ThemeProvider attribute="class">
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>
                <Layout>
                    <Component {...pageProps} />           
                    </Layout>         
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
        </ThemeProvider>
        
    );
  
}

export default MyApp
