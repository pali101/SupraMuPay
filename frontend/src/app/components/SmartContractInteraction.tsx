'use client';
import React, { useState } from 'react';

type SmartContractInteractionProps = {
  account: string | null;
};

const getProvider = () => {
  if ('starkey' in window) {
    const provider = (window.starkey as { supra: any })?.supra;
    return provider;
  }
  return null;
};

const SmartContractInteraction: React.FC<SmartContractInteractionProps> = ({ account }) => {
  const [contractAddress, setContractAddress] = useState('');
  const [methodName, setMethodName] = useState('');
  const [args, setArgs] = useState('');
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const interactWithContract = async () => {
    const provider = getProvider();
    if (!provider || !account) {
      setError('Please connect your wallet first.');
      return;
    }

    if (!contractAddress || !methodName || !args) {
      setError('Please provide contract address, method name, and arguments.');
      return;
    }

    try {
      const contract = new provider.Contract(contractAddress, /* ABI here */);
      const result = await contract.methods[methodName](...JSON.parse(args)).send({ from: account });
      setTxHash(result.transactionHash);
      console.log('Transaction sent, txHash:', result.transactionHash);
    } catch (err) {
      console.error('Error interacting with contract:', err);
      setError('Transaction failed. Please try again.');
    }
  };

  return (
    <div className="container p-6 bg-white shadow-lg rounded-lg w-full sm:w-3/4 md:w-1/2 mx-auto my-8">
      <h1 className="text-2xl font-semibold mb-4 text-gray-800">Interact with Smart Contract</h1>

      {/* Input Fields for Contract Interaction */}
      <div className="mb-4">
        <label htmlFor="contractAddress" className="block text-sm text-gray-700">Contract Address:</label>
        <input
          id="contractAddress"
          type="text"
          value={contractAddress}
          onChange={(e) => setContractAddress(e.target.value)}
          placeholder="Enter contract address"
          className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="methodName" className="block text-sm text-gray-700">Method Name:</label>
        <input
          id="methodName"
          type="text"
          value={methodName}
          onChange={(e) => setMethodName(e.target.value)}
          placeholder="Enter method name"
          className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="mb-6">
        <label htmlFor="args" className="block text-sm text-gray-700">Arguments (JSON):</label>
        <input
          id="args"
          type="text"
          value={args}
          onChange={(e) => setArgs(e.target.value)}
          placeholder='["arg1", "arg2"]'
          className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button
        onClick={interactWithContract}
        className="w-full bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700 focus:outline-none"
      >
        Interact with Contract
      </button>

      {/* Display error or success message */}
      {error && <p className="text-red-500 mt-4">{error}</p>}
      {txHash && (
        <div className="mt-6">
          <p className="text-lg text-green-600">Transaction successful!</p>
          <p>
            Transaction Hash: 
            <a 
              href={`https://explorer.starkey.app/tx/${txHash}`} 
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

export default SmartContractInteraction;
