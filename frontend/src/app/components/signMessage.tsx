'use client';
import React, { useState } from 'react';

type StarkeyProvider = {
  signMessage: (message: string) => Promise<string>;
  sendSignedMessage?: (signedMessage: string) => Promise<string>;
};

const getProvider = (): StarkeyProvider | null => {
  if (typeof window !== 'undefined' && 'starkey' in window) {
    const provider = (window.starkey as { supra: StarkeyProvider })?.supra;
    return provider || null;
  }
  return null;
};

const SignMessage: React.FC = () => {
  const [message, setMessage] = useState('');
  const [signedMessage, setSignedMessage] = useState<string | null>(null);
  const [broadcastHash, setBroadcastHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSignMessage = async () => {
    const provider = getProvider();
    if (!provider) {
      setError('Provider not found. Make sure the wallet is connected.');
      return;
    }

    try {
      const signature = await provider.signMessage(message);
      setSignedMessage(signature);
      setError(null);
      console.log('Signed Message:', signature);
    } catch (err) {
      console.error('Error signing message:', err);
      setError('Failed to sign message.');
    }
  };

  const handleBroadcastMessage = async () => {
    const provider = getProvider();
    if (!provider || !provider.sendSignedMessage) {
      setError('Broadcasting is not supported by this provider.');
      return;
    }

    try {
      const txHash = await provider.sendSignedMessage(signedMessage!);
      setBroadcastHash(txHash);
      setError(null);
      console.log('Broadcasted Message, txHash:', txHash);
    } catch (err) {
      console.error('Error broadcasting message:', err);
      setError('Failed to broadcast message.');
    }
  };

  return (
    <div className="p-6 bg-white rounded shadow-md max-w-md mx-auto mt-8">
      <h2 className="text-2xl font-semibold mb-4">Sign and Broadcast Message</h2>

      {/* Input Message */}
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Enter your message to sign"
        className="w-full p-2 border rounded mb-4"
        rows={4}
      />

      {/* Sign Message Button */}
      <button
        onClick={handleSignMessage}
        className="px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700"
      >
        Sign Message
      </button>

      {/* Signed Message */}
      {signedMessage && (
        <div className="mt-4">
          <p className="text-green-600">Signed Message:</p>
          <p className="break-all bg-gray-100 p-2 rounded">{signedMessage}</p>

          {/* Broadcast Message Button */}
          <button
            onClick={handleBroadcastMessage}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded shadow hover:bg-indigo-700"
          >
            Broadcast Message
          </button>
        </div>
      )}

      {/* Broadcast Hash */}
      {broadcastHash && (
        <div className="mt-4">
          <p className="text-green-600">Broadcast Successful!</p>
          <p className="break-all bg-gray-100 p-2 rounded">Transaction Hash: {broadcastHash}</p>
        </div>
      )}

      {/* Error Message */}
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
};

export default SignMessage;
