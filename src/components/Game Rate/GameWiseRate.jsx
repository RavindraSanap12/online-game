import React from "react";
import "./GameWiseRate.css";

const gameTypes = [
  { name: "Single Digits", rate: 9 },
  { name: "Jodi Digit", rate: 45 },
  { name: "Single Panna", rate: 150 },
  { name: "Double Panna", rate: 300 },
  { name: "Triple Panna", rate: 900 },
  { name: "CP", rate: 300 },
  { name: "Sangam", rate: 20000 },
  { name: "SP Motor", rate: 250 },
  { name: "DP Motor", rate: 300 },
];

const markets = ["Lucky Draw", "Time bazar", "Star klyan", "Sridevi",];

const GameWiseRate = () => {
  return (
    <div className="game-rate-list">
      <div className="game-rate-list-header">Main Bazar</div>
      <div className="game-rate-list-content">
        {markets.map((market, idx) => (
          <div className="game-rate-list-section" key={idx}>
            <div className="game-rate-list-title">{market}</div>
            <table className="game-rate-list-table">
              <thead>
                <tr>
                  <th>Game Type</th>
                  <th>Game Rate</th>
                  <th>Min Bid</th>
                  <th>Max Bid</th>
                </tr>
              </thead>
              <tbody>
                {gameTypes.map((type, i) => (
                  <tr key={i}>
                    <td>{type.name}</td>
                    <td>{type.rate}</td>
                    <td>
                      <input type="number" value={5} readOnly />
                    </td>
                    <td>
                      <input
                        type="number"
                        value={
                          type.name.includes("Triple") ||
                          type.name.includes("Half") ||
                          type.name.includes("Full")
                            ? 1000
                            : 1000000
                        }
                        readOnly
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameWiseRate;
