import React, { useState } from 'react';

interface WalletConnectionProps {
  account: string | null;
  setAccount: React.Dispatch<React.SetStateAction<string | null>>;
}

const getProvider = () => {
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

const WalletConnection: React.FC<WalletConnectionProps> = ({ account, setAccount }) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [balance, setBalance] = useState<{
    balance: string;
    formattedBalance: string;
    decimal: number;
    displayUnit: string;
  } | null>(null);

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

  const connectWallet = async () => {
    const provider = getProvider();
    if (!provider) return;

    setIsConnecting(true);
    try {
      const accounts = await provider.connect();
      setAccount(accounts[0]);
      console.log('Connected account:', accounts[0]);
    } catch (err) {
      console.error('User rejected the connection request', err);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = async () => {
    const provider = getProvider();
    if (!provider) return;

    try {
      await provider.disconnect();
      setAccount(null);
      console.log('Disconnected from wallet');
    } catch (err) {
      console.error('Error disconnecting wallet', err);
    }
  };

  return (
    <div style={{ position: 'relative', padding: '10px' }}>
      {/* Top-right "Connect Wallet" button */}
      <div style={{ position: 'absolute', top: 10, right: 10 }}>
        {account ? (
          <>
            <p>Connected: {account}</p>
            <button
              onClick={disconnectWallet}
              style={{
                padding: '10px 20px',
                backgroundColor: '#FF4B4B',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                marginTop: '10px',
              }}
            >
              Disconnect Wallet
            </button>
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
          </>
        ) : (
          <button
            onClick={connectWallet}
            style={{
              padding: '10px 20px',
              backgroundColor: '#0070f3',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            {isConnecting ? 'Connecting...' : 'Connect Wallet'}
          </button>
        )}
      </div>
    </div>
  );
};

export default WalletConnection;
