import React, { useState } from 'react';
import './MonopolyLandmarkLegends.css';

const MonopolyLandmarkLegends = () => {
    const [gameOption, setGameOption] = useState('');
    const [numPlayers, setNumPlayers] = useState(2);
    const [tier, setTier] = useState(1);
    const [availableGames, setAvailableGames] = useState([]);

    const handleGameOptionChange = option => {
        setGameOption(option);
        setNumPlayers(2);
        setTier(1);
    };

    const handleNumPlayersChange = event => {
        setNumPlayers(parseInt(event.target.value));
    };

    const handleTierChange = event => {
        setTier(parseInt(event.target.value));
    };

    const handleGameCreation = () => {
        console.log(`Creating game with ${numPlayers} players in Tier ${tier}`);
    };

    const handleJoinGame = () => {
        console.log(`Joining game with ${numPlayers} players in Tier ${tier}`);
    };

    const renderBoardSquares = () => {
        const squares = new Array(40).fill(null).map((_, index) => {
            return (
                <div key={index} className={`square ${determineSquareClass(index)}`} style={{ '--square-index': index + 1 }}>
                    {/* Placeholder for square content */}
                </div>
            );
        });
        return squares;
    };
    

    const determineSquareClass = index => {
        if ([0, 10, 20, 30].includes(index)) return 'corner-square';
        if ([2, 17, 33].includes(index)) return 'chance-square';
        if ([7, 22, 36].includes(index)) return 'community-chest-square';
        return 'property-square';
    };

    return (
        <div className="monopoly-landmark-legends">
            <h1>Monopoly: Landmark Legends</h1>

            <div className="game-options">
                <button onClick={() => handleGameOptionChange('create')}>Create Game</button>
                <button onClick={() => handleGameOptionChange('join')}>Join Game</button>
            </div>

            {gameOption && (
                <div className="game-selection">
                    <label>
                        Number of Players:
                        <select value={numPlayers} onChange={handleNumPlayersChange}>
                            {[2, 3, 4].map(num => (
                                <option key={num} value={num}>{num}</option>
                            ))}
                        </select>
                    </label>

                    {gameOption === 'create' && (
                        <div className="tier-selection">
                            <label>
                                Select Tier:
                                <select value={tier} onChange={handleTierChange}>
                                    {[1, 2, 3, 4, 5].map(tierNum => (
                                        <option key={tierNum} value={tierNum}>Tier {tierNum}</option>
                                    ))}
                                </select>
                            </label>
                            <button onClick={handleGameCreation}>Create Game</button>
                        </div>
                    )}

                    {gameOption === 'join' && (
                        <div className="available-games">
                            <button onClick={handleJoinGame}>Show Available Games</button>
                            {availableGames.length > 0 && (
                                <ul>
                                    {availableGames.map((game, index) => (
                                        <li key={index}>Game {index + 1} - {game.details}</li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    )}
                </div>
            )}

            <div className="game-container">
                <div className="board">
                    {renderBoardSquares()}
                    <div className="board-center">
                        {/* Center content like the image */}
                    </div>
                </div>

                <div className="dashboards">
                    <div className="player-info-dashboard">Player Information</div>
                    <div className="bank-info-dashboard">Bank Information</div>
                    <div className="game-history-dashboard">Game History</div>
                </div>
            </div>
        </div>
    );
};

export default MonopolyLandmarkLegends;
