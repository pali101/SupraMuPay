'use client';
import React, { useState } from 'react';
import { getProvider } from '../page'; 
import nacl from "tweetnacl";

interface SignMessageProps {
  account?: string;
}

const remove0xPrefix = (hexString: string) => {
  return hexString.startsWith("0x") ? hexString.slice(2) : hexString;
};

const SignMessage: React.FC<SignMessageProps> = ({ account }) => {
  const [message, setMessage] = useState('');
  const [signedMessage, setSignedMessage] = useState<string | null>(null);
  const [broadcastHash, setBroadcastHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const signMessage = async (message: string): Promise<void> => {
    const provider = await getProvider();
    
    if (!provider) {
      setError('Provider not found. Make sure the wallet is connected.');
      return;
    }

    try {
      const hexMessage = '0x' + Buffer.from(message, 'utf8').toString('hex');
      const response = await provider.signMessage({ message: hexMessage });
      console.log('signMessage response :: ', response);

      if (response) {
        const { publicKey, signature, address } = response;
        const sign = remove0xPrefix(signature);
        const key = remove0xPrefix(publicKey);
        
        // Verifying the signature with nacl
        const verified = nacl.sign.detached.verify(
          new TextEncoder().encode(message),
          Uint8Array.from(Buffer.from(sign, 'hex')),
          Uint8Array.from(Buffer.from(key, 'hex'))
        );
        
        console.log('signature :: ', signature);
        console.log('verified :: ', verified);
        console.log('publicKey :: ', publicKey);
        console.log('address :: ', address);

        if (verified) {
          setSignedMessage(signature);
          setError(null);
        } else {
          throw new Error('Signature verification failed.');
        }
      } else {
        throw new Error('Failed to sign message.');
      }
    } catch (err) {
      console.error('Error signing message:', err);
      setError('Failed to sign message.');
    }
  };

  const handleSignMessage = async () => {
    setError(null);
    await signMessage(message);
  };

  const handleBroadcastMessage = async () => {
    const provider = getProvider();
    if (!provider || !provider.sendSignedMessage) {
      setError('Broadcasting is not supported by this provider.');
      return;
    }

    try {
      if (!signedMessage) {
        setError('No message signed to broadcast.');
        return;
      }

      const txHash = await provider.sendSignedMessage(signedMessage);
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

      {account ? (
        <>
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
        </>
      ) : (
        <p className="text-red-500 mt-4">Please connect your wallet to sign a message.</p>
      )}

      {/* Error Message */}
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
};

export default SignMessage;
