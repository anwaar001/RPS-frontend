import React, { useState } from 'react';
import './PhantomWalletButton.css'; 

const PhantomWalletButton = () => {
  const [walletAddress, setWalletAddress] = useState(null);

  const connectWallet = async () => {
    try {
      const { solana } = window;
      if (solana && solana.isPhantom) {
        console.log('Phantom wallet found!');
        
        // Connect to the wallet
        const response = await solana.connect();
        console.log('Connected with Public Key:', response.publicKey.toString());
        setWalletAddress(response.publicKey.toString());
      } else {
        alert('Solana object not found! Get a Phantom Wallet 👻');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="connect-wallet">
      {!walletAddress ? (
        <button onClick={connectWallet} className="wallet-button">
          Connect Phantom Wallet
        </button>
      ) : (
        <p>Wallet Address: {walletAddress}</p>
      )}
    </div>
  );
};

export default PhantomWalletButton;
