'use client';
import React, { useState } from 'react';

type StarkeyProvider = {
  balance: () => Promise<{
    balance: string;
    formattedBalance: string;
    decimal: number;
    displayUnit: string;
  }>;
};

const getProvider = (): StarkeyProvider | null => {
  if (typeof window !== 'undefined' && 'starkey' in window) {
    const provider = (window.starkey as { supra: StarkeyProvider })?.supra;
    return provider || null;
  }
  return null;
};

const TestBalance: React.FC = () => {
  const [balance, setBalance] = useState<{
    balance: string;
    formattedBalance: string;
    decimal: number;
    displayUnit: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchBalance = async () => {
    const provider = getProvider();
    if (!provider) {
      setError('Provider not found. Make sure the wallet is connected.');
      return;
    }

    try {
      const walletBalance = await provider.balance();
      setBalance(walletBalance);
      setError(null);
    } catch (err) {
      console.error('Error fetching balance:', err);
      setError('Failed to fetch balance.');
    }
  };

  return (
    <div className="p-6 bg-white rounded shadow-md max-w-md mx-auto mt-8">
      <h2 className="text-2xl font-semibold mb-4">Test Wallet Balance</h2>

      <button
        onClick={fetchBalance}
        className="px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700"
      >
        Fetch Balance
      </button>

      {balance && (
        <div className="text-green-600 mt-4">
          <p>Raw Balance: {balance.balance}</p>
          <p>Formatted Balance: {balance.formattedBalance}</p>
          <p>Decimal Places: {balance.decimal}</p>
          <p>Unit: {balance.displayUnit}</p>
        </div>
      )}

      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
};

export default TestBalance;
