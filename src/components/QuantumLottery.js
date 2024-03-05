import React, { useState } from 'react';
import './QuantumLottery.css';

const QuantumLottery = () => {
    const [potAmount, setPotAmount] = useState(1000);
    const [participants, setParticipants] = useState(2);
    const [availableLotteries, setAvailableLotteries] = useState([]);
    const [selectedLottery, setSelectedLottery] = useState(null);

    const potOptions = [1000, 10000, 100000, 1000000, 10000000, 100000000, 1000000000];

    // Ensure entry fee is calculated only if participants are more than 0
    const entryFee = participants > 0 ? potAmount / participants : 0;

    const createLottery = () => {
        // Check for valid number of participants
        if (participants < 2 || participants > 100) {
            alert("Number of participants should be between 2 and 100.");
            return;
        }

        const newLottery = {
            potAmount,
            entryFee,
            participants,
            id: Date.now() // A simple way to generate unique IDs for demo purposes
        };

        setAvailableLotteries([...availableLotteries, newLottery]);
        // TODO: Deduct entry fee from creator's wallet
    };

    const joinLottery = (lotteryId) => {
        const selected = availableLotteries.find(lottery => lottery.id === lotteryId);
        if (!selected) {
            alert("Lottery not found.");
            return;
        }

        setSelectedLottery(selected);
        // TODO: Deduct entry fee from participant's wallet
    };

    return (
        <div className="quantum-lottery">
            <h2>Quantum Lottery</h2>

            <div className="create-lottery-section">
                <h3>Create a Lottery</h3>
                <select value={potAmount} onChange={e => setPotAmount(Number(e.target.value))}>
                    {potOptions.map(amount => (
                        <option key={amount} value={amount}>{amount} QGEM</option>
                    ))}
                </select>
                <input 
                    type="number" 
                    min="2" 
                    max="100" 
                    value={participants} 
                    onChange={e => setParticipants(Number(e.target.value))}
                />
                <button onClick={createLottery}>Create Lottery</button>
                <p>Entry Fee: {entryFee.toFixed(2)} QGEM</p>
            </div>

            <div className="join-lottery-section">
                <h3>Join a Lottery</h3>
                {availableLotteries.length === 0 ? (
                    <p>No available lotteries at the moment.</p>
                ) : (
                    availableLotteries.map(lottery => (
                        <div key={lottery.id} className="lottery-item">
                            <p>Pot: {lottery.potAmount} QGEM</p>
                            <p>Entry Fee: {lottery.entryFee.toFixed(2)} QGEM</p>
                            <button onClick={() => joinLottery(lottery.id)}>Join</button>
                        </div>
                    ))
                )}
            </div>

            {selectedLottery && (
                <div className="selected-lottery-details">
                    <h4>Selected Lottery</h4>
                    <p>Pot: {selectedLottery.potAmount} QGEM</p>
                    <p>Participants: {selectedLottery.participants}</p>
                </div>
            )}
        </div>
    );
};

export default QuantumLottery;
