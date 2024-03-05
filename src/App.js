import React, { useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';
import NavBar from './components/NavBar';
import QuantumRPS from './components/QuantumRPS';
import MonopolyLandmarkLegends from './components/MonopolyLandmarkLegends';
import QuantumLottery from './components/QuantumLottery';
import QuantumFootballManager from './components/QuantumFootballManager'; 
import MainContent from './components/MainContent';
import Footer from './components/Footer';
import About from './components/About';
import Contact from './components/Contact';
import Whitepaper from './components/Whitepaper';
import IcoPage from './components/IcoPage';
import './App.css';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import Admin from './components/Admin';
import { ToastContainer } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css';



const App = () => {
  // const network = clusterApiUrl('mainnet-beta'); // Use 'mainnet-beta' for production
  // const wallet = useMemo(() =>[ new PhantomWalletAdapter(),new SolflareWalletAdapter()],  [network]);
  const network = WalletAdapterNetwork.Mainnet;
    const endpoint = useMemo(() => clusterApiUrl(network), [network]);

    const wallets = useMemo(
        () => [
            new PhantomWalletAdapter(),
            new SolflareWalletAdapter(),
        ],
        [network]
    );

  // Define the gamesData array with fullDescription for Quantum RPS
  const gamesData = [
    {
      id: 1,
      name: "Quantum RPS",
      description: "A Quantum twist on the classic Rock, Paper, Scissors game.",
      fullDescription: `
      Quantum RPS revitalizes the game of Rock-Paper-Scissors by integrating it with blockchain.
      Rules:
      Rock beats Scissors: Rock wins because it can break Scissors.
      Scissors beat Paper: Scissors win by cutting Paper.
      Paper beats Rock: Paper wins by covering Rock.
      Gameplay:
      Players stake Quantum Gem Coins (QGEM) at the beginning of each round.
      The winner of the round is determined by the classic RPS rules.
      If both players select the same shape, the round is a tie and replayed.
      The winner takes the entire stake pot of the round.
      Quantum RPS applies a nominal 2% fee on the stake pot, contributing to the game's development and maintenance.
      Smart contracts autonomously execute the game outcomes and payouts, ensuring fairness and eliminating the need for intermediaries.`,
      imageUrl: "QuantumRPS.png" // Ensure this file exists in your public/assets folder
    },
    {
      id: 2,
      name: "Monopoly Landmark Legends",
      description: "Compete to own the world's most famous landmarks in this Monopoly edition.",
      fullDescription: "Monopoly: Landmark Legends reinvents the iconic board game by integrating blockchain technology. This version transports players on a global journey, where they acquire and trade famous landmarks represented as Non-Fungible Tokens (NFTs). Players aim to monopolize landmark collections for additional benefits.",
      imageUrl: "MonopolyLML.png" // Ensure this file exists in your public/assets folder
    },
    {
      id: 3,
      name: "Quantum Lottery",
      description: "Quantum Lottery offers a transparent, secure, and fair chance to win big..",
      fullDescription: "Quantum Lottery empowers you with the ability to set up your lottery pool. Choose your desired pot amount from our diverse range of options to tailor the stakes to your preference. Then, decide on the number of participants to determine the odds - will it be an intimate draw or a grand sweepstake? As lotteries are created, they're open for all to join. Whether you're a high roller or a casual player, there's a place for you. The participation is seamless, and with each entry, the excitement grows until the maximum number of participants is reached. With fairness at its core, Quantum Lottery ensures that the winner is selected through a verifiable random process, free from any interference. The Solana blockchain's inherent transparency guarantees that every draw is as random as it is thrilling.",
      imageUrl: "QuantumLottery.png" // Ensure this file exists in your public/assets folder
    },
    {
      id: 4,
      name: "Quantum Football Manager",
      description: "Compete to own the world's most famous football players in this football manager edition.",
      fullDescription: " Compete to own the world's most famous football players in this football manager, paly against other teams.",
      imageUrl: "QuantumFM.png" // Ensure this file exists in your public/assets folder
    }

    // ... other games if you have them
  ];

  return (
    // <ConnectionProvider endpoint={endpoint}>
    //   <WalletProvider wallets={wallets} autoConnect>
        //{/* <WalletModalProvider> */}

        <Router>
          <div className="App">
          <ToastContainer/>
            <NavBar />
            <Routes>
              <Route path="/" element={<MainContent games={gamesData} />} />
              <Route path="/quantum-rps" element={<QuantumRPS />} />
              <Route path="/monopoly-landmark-legends" element={<MonopolyLandmarkLegends />} />
              <Route path="/quantum-lottery" element={<QuantumLottery />} />
              <Route path="/quantum-football-manager" element={<QuantumFootballManager />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/whitepaper" element={<Whitepaper />} />
              <Route path="/ico" element={<IcoPage />} />
              {/* <Route path="/admin" element={<Admin />} /> */}
              {/* Add more <Route> components here as needed */}
            </Routes>
            <Footer />
          </div>
        </Router>
    //     </WalletModalProvider>
    //   </WalletProvider>
    // </ConnectionProvider>
  );
};

export default App;
