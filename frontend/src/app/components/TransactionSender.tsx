'use client';
import React, { useState } from 'react';
import { getProvider } from '../page';

type StarkeyProvider = {
  account: () => Promise<string[]>;
  sendTransaction: (transaction: { from: string; to: string; value: string }) => Promise<string>;
};

type PageProps = {
  account: string | null;
};

const TransactionPage: React.FC<PageProps> = ({ account }) => {
  const [toAddress, setToAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleTransaction = async () => {
    const provider = getProvider();
    if (!provider || !account) {
      setError('Please connect your wallet first.');
      return;
    }

    if (!toAddress || !amount) {
      setError('Please fill in both "To Address" and "Amount".');
      return;
    }

    try {
      const transaction = {
        from: account,
        to: toAddress,
        value: amount,
      };
      const txHash = await provider.sendTransaction(transaction);
      setTxHash(txHash);
      console.log('Transaction sent, txHash:', txHash);
    } catch (err) {
      console.error('Error sending transaction:', err);
      setError('Transaction failed. Please try again.');
    }
  };

  const copyToClipboard = () => {
    if (account) {
      navigator.clipboard.writeText(account);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // reset after 2 seconds
    }
  };

  return (
    <div className="container p-6 bg-white shadow-lg rounded-lg w-full sm:w-3/4 md:w-1/2 mx-auto my-8">
      <h1 className="text-2xl font-semibold mb-4 text-gray-800">Send a Transaction</h1>

      {/* Display wallet connection status */}
      {account ? (
        <div className="flex items-center justify-between mb-6">
          <p className="text-lg text-gray-700">Connected Account: {account}</p>
          <button
            onClick={copyToClipboard}
            className="bg-green-500 text-white px-4 py-2 rounded-md text-sm hover:bg-green-600"
          >
            {copied ? 'Copied!' : 'Copy Address'}
          </button>
        </div>
      ) : (
        <p className="text-lg text-gray-600 mb-6">Please connect your wallet to send a transaction.</p>
      )}

      {/* Transaction Form */}
      {account && (
        <div>
          <div className="mb-4">
            <label htmlFor="toAddress" className="block text-sm text-gray-700">To Address:</label>
            <input
              id="toAddress"
              type="text"
              value={toAddress}
              onChange={(e) => setToAddress(e.target.value)}
              placeholder="Enter recipient address"
              className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="amount" className="block text-sm text-gray-700">Amount:</label>
            <input
              id="amount"
              type="text"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            onClick={handleTransaction}
            className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 focus:outline-none"
            disabled={!toAddress || !amount}
          >
            Send Transaction
          </button>
        </div>
      )}

      {/* Display error or success message */}
      {error && <p className="text-red-500 mt-4">{error}</p>}
      {txHash && (
        <div className="mt-6">
          <p className="text-lg text-green-600">Transaction successful!</p>
          <p>
            Transaction Hash: 
            <a 
              href={`https://testnet.suprascan.io/tx/${txHash}`} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-blue-500 underline"
            >
              {txHash}
            </a>
          </p>
        </div>
      )}
    </div>
  );
};

export default TransactionPage;
