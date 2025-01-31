'use client';
import React, { useState } from 'react';
import WalletConnection from './components/walletConnect';
import Micropayement from './components/SmartContractInteraction';
import TransactionPage from './components/TransactionSender';
import SignMessage from './components/signMessage';


export const getProvider = () => {
  if ('starkey' in window) {
    const provider = (window.starkey as { supra: any })?.supra;
    if (provider) {
      return provider;
    }
  }

  // Redirect to the official StarKey wallet website if not installed
  window.open('https://starkey.app/', '_blank');
  return null;
};

export default function Home() {
  const [account, setAccount] = useState<string | null>(null);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-gradient-to-r from-blue-500 to-indigo-500">
      <header className="flex justify-between items-center w-full mb-8">
        <div className="text-white text-3xl font-semibold">
          <span>mPay</span> DApp
        </div>
        <div className="flex items-center gap-4">
          <WalletConnection {...{ account, setAccount }} />
        </div>
      </header>

      <main className="w-full max-w-3xl p-8 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome to mPay DApp</h1>
          <p className="text-lg text-gray-600 mb-6">
            Connect your wallet to interact with the decentralized app.
          </p>
        </div>

        <section className="space-y-10">
          {/* Transaction Section */}
          <div className="bg-gray-50 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Send a Transaction</h2>
            <TransactionPage account={account} />
          </div>

          {/* Smart Contract Interaction Section */}
          <div className="bg-gray-50 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Interact with Smart Contract</h2>
            <Micropayement account={account ?? ''} />
          </div>
          <div className="bg-gray-50 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Sign a Message</h2>
            <SignMessage account={account ?? ''} />
          </div>
        </section>
      </main>

      <footer className="mt-12 text-center text-gray-600 text-sm">
        <p>
          Made with ❤️ by mPay Team |{' '}
          <a href="https://starkey.app" className="text-indigo-600 hover:underline">
            Powered by StarKey Wallet
          </a>
        </p>
      </footer>
    </div>
  );
}


