import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./GameMarketSettings.css";
import { API_BASE_URL } from "../api";

const GameMarketSettings = () => {
  const navigate = useNavigate();
  const [markets, setMarkets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Default market data structure
  const defaultMarkets = [
    {
      name: "Main Bazar",
      gameConfigs: [
        {
          gameType: "Single Digits",
          gameRate: 9,
          minBid: 5,
          maxBid: 1000,
        },
        {
          gameType: "Jodi Digit",
          gameRate: 45,
          minBid: 5,
          maxBid: 1000,
        },
        {
          gameType: "Single Panna",
          gameRate: 150,
          minBid: 5,
          maxBid: 1000,
        },
        {
          gameType: "Double Panna",
          gameRate: 300,
          minBid: 5,
          maxBid: 1000,
        },
        {
          gameType: "Triple Panna",
          gameRate: 900,
          minBid: 5,
          maxBid: 1000,
        },
        {
          gameType: "CP",
          gameRate: 300,
          minBid: 5,
          maxBid: 1000,
        },
        {
          gameType: "Sangam",
          gameRate: 20000,
          minBid: 5,
          maxBid: 1000,
        },
        {
          gameType: "SP Motor",
          gameRate: 250,
          minBid: 5,
          maxBid: 1000,
        },
        {
          gameType: "DP Motor",
          gameRate: 300,
          minBid: 5,
          maxBid: 1000,
        },
      ],
    },
    {
      name: "Delhi Market",
      gameConfigs: [
        {
          gameType: "Single Digits",
          gameRate: 9,
          minBid: 5,
          maxBid: 1000,
        },
        {
          gameType: "Jodi Digit",
          gameRate: 45,
          minBid: 5,
          maxBid: 1000,
        },
        {
          gameType: "Single Panna",
          gameRate: 150,
          minBid: 5,
          maxBid: 1000,
        },
        {
          gameType: "Double Panna",
          gameRate: 300,
          minBid: 5,
          maxBid: 1000,
        },
        {
          gameType: "Triple Panna",
          gameRate: 900,
          minBid: 5,
          maxBid: 1000,
        },
        {
          gameType: "CP",
          gameRate: 300,
          minBid: 5,
          maxBid: 1000,
        },
        {
          gameType: "Sangam",
          gameRate: 20000,
          minBid: 5,
          maxBid: 1000,
        },
        {
          gameType: "SP Motor",
          gameRate: 250,
          minBid: 5,
          maxBid: 1000,
        },
        {
          gameType: "DP Motor",
          gameRate: 300,
          minBid: 5,
          maxBid: 1000,
        },
      ],
    },
    {
      name: "Starline Market",
      gameConfigs: [
        {
          gameType: "Single Digits",
          gameRate: 9,
          minBid: 5,
          maxBid: 1000,
        },
        {
          gameType: "Jodi Digit",
          gameRate: 45,
          minBid: 5,
          maxBid: 1000,
        },
        {
          gameType: "Single Panna",
          gameRate: 150,
          minBid: 5,
          maxBid: 1000,
        },
        {
          gameType: "Double Panna",
          gameRate: 300,
          minBid: 5,
          maxBid: 1000,
        },
        {
          gameType: "Triple Panna",
          gameRate: 900,
          minBid: 5,
          maxBid: 1000,
        },
        {
          gameType: "CP",
          gameRate: 300,
          minBid: 5,
          maxBid: 1000,
        },
        {
          gameType: "Sangam",
          gameRate: 20000,
          minBid: 5,
          maxBid: 1000,
        },
        {
          gameType: "SP Motor",
          gameRate: 250,
          minBid: 5,
          maxBid: 1000,
        },
        {
          gameType: "DP Motor",
          gameRate: 300,
          minBid: 5,
          maxBid: 1000,
        },
      ],
    },
  ];

  // Get authentication headers with token
  const getAuthHeaders = () => {
    const token = localStorage.getItem("authToken");
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  };

  const handleApiError = (error) => {
    throw new Error(error.response?.data?.message || "Request failed");
  };

  useEffect(() => {
    fetchGameRates();
  }, []);

  const fetchGameRates = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/gamerates/all`, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        // If API fails, use default data
        setMarkets(defaultMarkets);
        setLoading(false);
        return;
      }

      const data = await response.json();
      // If API returns empty data, use default data
      setMarkets(data.length > 0 ? data : defaultMarkets);
      setLoading(false);
    } catch (err) {
      // On any error, use default data
      setMarkets(defaultMarkets);
      setLoading(false);
      console.error("Error fetching game rates, using default data:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/gamerates/save`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(markets),
      });

      if (!response.ok) {
        throw new Error("Failed to save game rates");
      }

      alert("Game rates saved successfully!");
      fetchGameRates(); // Refresh the data after saving
    } catch (err) {
      handleApiError(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (marketIndex, configIndex, field, value) => {
    const updatedMarkets = [...markets];
    updatedMarkets[marketIndex].gameConfigs[configIndex][field] = value;
    setMarkets(updatedMarkets);
  };

  const renderRow = (marketIndex, configIndex, config) => (
    <div className="game-market-settings-row" key={configIndex}>
      <div>{config.gameType}</div>
      <input
        type="number"
        value={config.gameRate}
        onChange={(e) =>
          handleInputChange(
            marketIndex,
            configIndex,
            "gameRate",
            e.target.value
          )
        }
      />
      <input
        type="number"
        value={config.minBid}
        onChange={(e) =>
          handleInputChange(marketIndex, configIndex, "minBid", e.target.value)
        }
      />
      <input
        type="number"
        value={config.maxBid}
        onChange={(e) =>
          handleInputChange(marketIndex, configIndex, "maxBid", e.target.value)
        }
      />
    </div>
  );

  if (loading) {
    return <div className="game-market-settings-container">Loading...</div>;
  }

  return (
    <div className="game-market-settings-container">
      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        {markets.map((market, marketIndex) => (
          <div className="game-market-settings-section" key={marketIndex}>
            <h4 className="game-market-settings-title">{market.name}</h4>
            <div className="game-market-settings-header">
              <div>Game Type</div>
              <div>Game Rate</div>
              <div>Min Bid</div>
              <div>Max Bid</div>
            </div>
            {market.gameConfigs.map((config, configIndex) =>
              renderRow(marketIndex, configIndex, config)
            )}
          </div>
        ))}

        <button
          type="submit"
          className="game-market-settings-update-button"
          disabled={loading}
        >
          {loading ? "Processing..." : "Update"}
        </button>
      </form>
    </div>
  );
};

export default GameMarketSettings;
