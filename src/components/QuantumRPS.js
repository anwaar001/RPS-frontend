import React, { useState, useEffect } from 'react';
import './QuantumRPS.css';
import { connection } from '../program/environment';
import { useAnchorWallet, useWallet } from '@solana/wallet-adapter-react';
import { initializeGame, program, joinGame, playGameCtx, getErrorMessageFromFormattedString} from '../program/game-func';
import * as anchor from "@project-serum/anchor"

import base58 from 'bs58';
import { toast } from 'react-toastify';


const QuantumRPS = () => {
  const [playerChoice, setPlayerChoice] = useState(null);
  const [opponentChoice, setOpponentChoice] = useState(null);
  const [gameState, setGameState] = useState('awaiting');
  const [gameMode, setGameMode] = useState(null); // 'join' or 'create'
  const [selectedStake, setSelectedStake] = useState(null);
  const [play, setPlay] = useState(false)
  const [currGame, setCurrGame] = useState(null)
  const [gamesToPlay, setGamesToPlay] = useState([])
  const { publicKey } = useWallet()
  const wallet = useAnchorWallet()

  const stakes = [10, 100, 1000, 10000, 100000, 1000000, 10000000, 100000000, 1000000000]; // Defined stakes

  const handleGameModeSelection = (mode) => {
    if (!wallet) {
      toast.error("Please Connect Wallet!!!");
                return
            }
    setGameMode(mode);
    // Additional logic for joining or creating a game
  };

  const handleStakeSelection = (stake) => {
    setSelectedStake(stake);
    // Additional logic for stake selection
  };
  const determineOutcome = () => {
    if (playerChoice === opponentChoice) return { result: 'Draw', image: 'draw.png' };

    const winScenarios = {
      rock: { beats: 'scissors', image: 'rock-wins.png' },
      paper: { beats: 'rock', image: 'paper-wins.png' },
      scissors: { beats: 'paper', image: 'scissors-wins.png' },
    };

    if (winScenarios[playerChoice]?.beats === opponentChoice) {
      return { result: 'Win', image: winScenarios[playerChoice].image };
    } else {
      return { result: 'Lose', image: 'loss.png' };
    }
  };


const initGame = async (selectedSide) => {
    try {
        if (publicKey && wallet) {
            if (!wallet) {
      toast.error("Please Connect Wallet!!!");
                return
            }

            const allTx = [];
                const tx = await initializeGame(wallet, selectedStake, selectedSide)
                if (!tx) {
                    return
                }
                tx.feePayer = publicKey
                tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash
                allTx.push(tx)

            const signedTxs = await wallet.signAllTransactions(allTx)

            for (let tx of signedTxs) {
                await connection.sendRawTransaction(
                    tx.serialize(),
                    {
                        skipPreflight: true
                    }
                )
            }
        }
        setGameMode(null)
        setSelectedStake(null)
    } catch (e) {
      let error = getErrorMessageFromFormattedString(e.message)
      toast.error(error)
      console.log(e)
    }

}

const joinRpsGame = async (stake) => {
  try {
      if (publicKey && wallet) {
          if (!wallet) {
            toast.error("Please Connect Wallet!!!");
              return
          }

          const allTx = [];
              const tx = await joinGame(wallet, stake)
              if (!tx) {
                  return
              }
              tx.feePayer = publicKey
              tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash
              allTx.push(tx)

          const signedTxs = await wallet.signAllTransactions(allTx)

          for (let tx of signedTxs) {
              await connection.sendRawTransaction(
                  tx.serialize(),
                  {
                      skipPreflight: false
                  }
              )
          }
      }
      setPlay(true)
      setCurrGame(stake)
  } catch (e) {
    let error = getErrorMessageFromFormattedString(e.message)
      toast.error(error)
      console.log(e)
      setPlay(false)
  }

}

const playRpsGame = async (selectedSide) => {
  try {
      if (publicKey && wallet) {
          if (!wallet) {
      toast.error("Please Connect Wallet!!!");
              return
          }

          const allTx = [];
              const tx = await playGameCtx(wallet, selectedSide, currGame)
              if (!tx) {
                  return
              }
              tx.feePayer = publicKey
              tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash
              allTx.push(tx)

          const signedTxs = await wallet.signAllTransactions(allTx)

          for (let tx of signedTxs) {
              await connection.sendRawTransaction(
                  tx.serialize(),
                  {
                      skipPreflight: false
                  }
              )
          }
      }
      setPlayerChoice(selectedSide);
      setOpponentChoice(currGame?.account?.selectedSide)
      setGameMode("completed")
      setGameState('completed')
      setCurrGame(null)
      setPlay(false)
  } catch (e) {
    let error = getErrorMessageFromFormattedString(e.message)
      toast.error(error)
      console.log(e)
  }

}



  const handleNewRound = () => {
    setPlayerChoice(null);
    setOpponentChoice(null);
    setGameMode(null)
    setCurrGame(null)
    setPlay(false)
    setGameState('awaiting');
  };

  const renderOutcome = () => {
    const { result, image } = determineOutcome();
    const outcomeImageSrc = `/assets/${image}`;
    return (
      <div className="outcome">
        <img src={outcomeImageSrc} alt={result} className="outcome-image" />
        <p className={`outcome-text ${result.toLowerCase()}`}>
          {result === 'Win' ? 'Congratulations! You won!' : result}
        </p>
        {/* <button onClick={handleNewRound} className="play-again-btn">Play Again</button> */}
      </div>
    );
  };


  useEffect(()=>{
    (async()=>{
      if(wallet){
        const pg = program(wallet)
        const games = await pg.account.game.all(
          // [
          //     {
          //       dataSize: 178,
          //     },
          //   {
          //     memcmp: {
          //       offset: 81, 
          //       bytes: base58.encode(Buffer.from([true])), 
          //     },
          //   },
          // ]
        );

        const filteredGames = games.sort((a, b) => a?.account?.stakeAmount?.toNumber() - b?.account?.stakeAmount?.toNumber());
        setGamesToPlay(filteredGames)

      }
    })();
  },[wallet,selectedStake, gameMode])

  
  // console.log(gameMode, selectedStake,play)

  return (
    <div className="game-container">
      {/* Game mode selection (Join or Create) */}
      {(!gameMode) && (
        <div className="game-mode-selection">
          <button onClick={() => handleGameModeSelection('join')}>Join a Game</button>
          <button onClick={() => handleGameModeSelection('create')}>Create a Game</button>
        </div>
      )}

      {/* Stake selection */}
      {(gameMode === 'create' && !selectedStake) && (
        <div className="stake-selection">
          {stakes.map((stake, index) => (
            <button
              key={index}
              className={`stake-button ${selectedStake === stake ? 'selected' : ''}`}
              onClick={() => handleStakeSelection(stake)}
            >
              {stake} QGEM
            </button>
          ))}
        </div>
      )}
{/* 
      {(gameMode==='join' && !play) && (
        <div className="stake-selection">
          {stakes.map((stake, index) => (
            <button
              key={index}
              className={`stake-button ${selectedStake === stake ? 'selected' : ''}`}
              onClick={() => joinRpsGame(stake)}
            >
              {stake} QGEM
            </button>
          ))}
        </div>
      )} */}

      {(gameMode==='join' && !play) && (
              gamesToPlay.length > 0 ? <div className="stake-selection">
                {gamesToPlay.map((stake, index) => (
                  <button
                    key={index}
                    className={`stake-button ${selectedStake === stake ? 'selected' : ''} ${!stake?.account?.isActive ? 'played-game' : ''}`}
                    onClick={() => joinRpsGame(stake)}
                  >
                    {stake?.account?.stakeAmount.toNumber() / 1000000} QGEM
                  </button>
                ))}
              </div> : <p>No Games Available to join</p>
            )}
      
      {/* Choices (Rock, Paper, Scissors) */}
      {(gameMode === 'create' && selectedStake) && (
        <div className="choices">
          <button className="button" onClick={() => initGame('rock')}>Rock</button>
          <button className="button" onClick={() => initGame('paper')}>Paper</button>
          <button className="button" onClick={() => initGame('scissors')}>Scissors</button>
        </div>
      )}

      {(gameMode === "join" && play) && (
        <div className="choices">
          <button className="button" onClick={() => playRpsGame('rock')}>Rock</button>
          <button className="button" onClick={() => playRpsGame('paper')}>Paper</button>
          <button className="button" onClick={() => playRpsGame('scissors')}>Scissors</button>
        </div>
      )}

      {/* Waiting Indicator and Game Outcome */}
      {gameState === 'selected' && <p className="waiting-indicator">Waiting for opponent...</p>}
      {gameState === 'completed' && renderOutcome()}

      {/* Action Confirmation (Play Again) */}
      {gameState === 'completed' && (
        <div className="action-confirmation">
          <button className="button" onClick={handleNewRound}>Play Again</button>
        </div>
      )}
    </div>
  );
};

export default QuantumRPS;
