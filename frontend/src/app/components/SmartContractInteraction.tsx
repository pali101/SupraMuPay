'use client';
import React, { useState } from 'react';
import { createChannel } from '../functions/createChannel';
import { redeemChannel } from '../functions/redeemChannel';
import { getProvider } from '../page';

type PageProps = {
  account: string | null;
};

const Micropayement: React.FC<PageProps> = ({ account }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);

  const [isCreateMode, setIsCreateMode] = useState(true); // Toggle between Create and Redeem views

  // Form fields for Create Channel
  const [merchantAddress, setMerchantAddress] = useState('');
  const [amount, setAmount] = useState<number | string>('');
  const [totalChannelAmount, setTotalChannelAmount] = useState<number | string>('');
  const [trustAnchor, setTrustAnchor] = useState('');

  // Form fields for Redeem Channel
  const [redeemHex, setRedeemHex] = useState('');
  const [redeemHexHeight, setRedeemHexHeight] = useState<number | string>('');

  const handleCreateChannel = async () => {
    setLoading(true);
    setError(null);

    // Validate input fields
    if (!merchantAddress || !amount || !totalChannelAmount || !trustAnchor) {
      setError('Please fill in all fields for creating a channel.');
      setLoading(false);
      return;
    }
   const supraProvider = await getProvider();
    try {
      const txHash = await createChannel(
        supraProvider,
        merchantAddress,
        Number(amount),
        Number(totalChannelAmount),
        trustAnchor
      );
      setTxHash(txHash);
      setError(null);
    } catch (err) {
      console.error('Error creating channel:', err);
      setError(err instanceof Error ? err.message : 'Failed to create channel');
    } finally {
      setLoading(false);
    }
  };

  const handleRedeemChannel = async () => {
    setLoading(true);
    setError(null);

    // Validate input fields
    if (!redeemHex || !redeemHexHeight) {
      setError('Please fill in all fields for redeeming a channel.');
      setLoading(false);
      return;
    }
    const supraProvider = await getProvider();
    try {
      const txHash = await redeemChannel(supraProvider, redeemHex, Number(redeemHexHeight));
      setTxHash(txHash);
      setError(null);
    } catch (err) {
      console.error('Error redeeming channel:', err);
      setError(err instanceof Error ? err.message : 'Failed to redeem channel');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: '500px',
        margin: '0 auto',
        fontFamily: 'Arial, sans-serif',
        textAlign: 'center',
        padding: '20px',
        backgroundColor: '#f5f5f5',
        color: '#333',
        borderRadius: '10px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      }}
    >
      <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>
        Supra Channel Operations
      </h2>

      {account ? (
        <>
          {/* Switch between Create and Redeem */}
          <div style={{ marginBottom: '20px' }}>
            <button
              onClick={() => setIsCreateMode(true)}
              style={{
                padding: '10px 20px',
                marginRight: '10px',
                backgroundColor: isCreateMode ? '#007BFF' : '#E0E0E0',
                color: isCreateMode ? 'white' : '#333',
                borderRadius: '5px',
                cursor: 'pointer',
                border: 'none',
              }}
            >
              Create Channel
            </button>
            <button
              onClick={() => setIsCreateMode(false)}
              style={{
                padding: '10px 20px',
                backgroundColor: !isCreateMode ? '#28A745' : '#E0E0E0',
                color: !isCreateMode ? 'white' : '#333',
                borderRadius: '5px',
                cursor: 'pointer',
                border: 'none',
              }}
            >
              Redeem Channel
            </button>
          </div>

          {isCreateMode ? (
            <div>
              <h3 style={{ marginBottom: '10px' }}>Create Channel</h3>
              <input
                type="text"
                placeholder="Merchant Address"
                value={merchantAddress}
                onChange={(e) => setMerchantAddress(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  marginBottom: '10px',
                  borderRadius: '5px',
                  border: '1px solid #ccc',
                }}
              />
              <input
                type="number"
                placeholder="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  marginBottom: '10px',
                  borderRadius: '5px',
                  border: '1px solid #ccc',
                }}
              />
              <input
                type="number"
                placeholder="Total Channel Amount"
                value={totalChannelAmount}
                onChange={(e) => setTotalChannelAmount(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  marginBottom: '10px',
                  borderRadius: '5px',
                  border: '1px solid #ccc',
                }}
              />
              <input
                type="text"
                placeholder="Trust Anchor"
                value={trustAnchor}
                onChange={(e) => setTrustAnchor(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  marginBottom: '10px',
                  borderRadius: '5px',
                  border: '1px solid #ccc',
                }}
              />
              <button
                onClick={handleCreateChannel}
                disabled={loading }
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#007BFF',
                  color: 'white',
                  borderRadius: '5px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.6 : 1,
                  border: 'none',
                }}
              >
                {loading ? 'Creating Channel...' : 'Create Channel'}
              </button>
            </div>
          ) : (
            <div>
              <h3 style={{ marginBottom: '10px' }}>Redeem Channel</h3>
              <input
                type="text"
                placeholder="Redeem Hex"
                value={redeemHex}
                onChange={(e) => setRedeemHex(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  marginBottom: '10px',
                  borderRadius: '5px',
                  border: '1px solid #ccc',
                }}
              />
              <input
                type="number"
                placeholder="Redeem Hex Height"
                value={redeemHexHeight}
                onChange={(e) => setRedeemHexHeight(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  marginBottom: '10px',
                  borderRadius: '5px',
                  border: '1px solid #ccc',
                }}
              />
              <button
                onClick={handleRedeemChannel}
                disabled={loading }
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#28A745',
                  color: 'white',
                  borderRadius: '5px',
                  cursor: loading  ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.6 : 1,
                  border: 'none',
                }}
              >
                {loading ? 'Redeeming Channel...' : 'Redeem Channel'}
              </button>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div
              style={{
                padding: '10px',
                backgroundColor: '#F8D7DA',
                color: '#721C24',
                borderRadius: '5px',
                marginTop: '10px',
              }}
            >
              {error}
            </div>
          )}

          {/* Transaction Hash Display */}
          {txHash && (
            <div
              style={{
                padding: '10px',
                backgroundColor: '#D4EDDA',
                color: '#155724',
                borderRadius: '5px',
                marginTop: '10px',
              }}
            >
              Transaction Hash:{' '}
              <a
                href={`https://explorer.supra.com/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#007BFF', textDecoration: 'underline' }}
              >
                {txHash}
              </a>
            </div>
          )}
        </>
      ) : (
        // If no account is available, ask to connect
        <div>
          <p style={{ color: '#FF6347' }}>Please connect your wallet to proceed.</p>
        </div>
      )}
    </div>
  );
};

export default Micropayement;
