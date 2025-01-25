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

  const trimAddress = (address: string | null) => {
    if (!address) return "";
    return `${address.slice(0, 3)}...${address.slice(-3)}`;
  };

  return (
    <div className="wallet-container">
      {account ? (
        <>
          <p className="wallet-address">Connected: {trimAddress(account)}</p>
          <button onClick={disconnectWallet} className="wallet-button disconnect-wallet">
            Disconnect Wallet
          </button>
        </>
      ) : (
        <button onClick={connectWallet} className="wallet-button connect-wallet">
          {isConnecting ? 'Connecting...' : 'Connect Wallet'}
        </button>
      )}
    </div>
  );  

  // return (
  //   <div style={{ position: 'relative', padding: '5px' }}>
  //     {/* Top-right "Connect Wallet" button */}
  //     <div style={{ position: 'absolute', top: -8, right: 50 }}>
  //       {account ? (
  //         <>
  //           <p>Connected: {account}</p>
  //           <button
  //             onClick={disconnectWallet}
  //             style={{
  //               padding: '8px 15px',
  //               backgroundColor: '#FF4B4B',
  //               color: 'white',
  //               border: 'none',
  //               borderRadius: '3px',
  //               cursor: 'pointer',
  //               marginTop: '5px',
  //             }}
  //           >
  //             Disconnect Wallet
  //           </button>
  //         </>
  //       ) : (
  //         <button
  //           onClick={connectWallet}
  //           style={{
  //             padding: '8px 15px',
  //             backgroundColor: '#216e25',
  //             color: 'white',
  //             border: 'none',
  //             borderRadius: '3px',
  //             cursor: 'pointer',
  //           }}
  //         >
  //           {isConnecting ? 'Connecting...' : 'Connect Wallet'}
  //         </button>
  //       )}
  //     </div>
  //   </div>
  // );
};

export default WalletConnection;
