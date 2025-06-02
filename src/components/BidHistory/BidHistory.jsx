import React, { useState, useEffect } from "react";
import "./BidHistory.css";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL2 } from "../api";

const BidHistory = () => {
  const [gameData, setGameData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null); // Changed from userData to userId
  const digits = Array.from({ length: 10 }, (_, i) => i);
  const navigate = useNavigate();

  // Validate token and get user ID
  useEffect(() => {
    const validateAndGetUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/");
        return;
      }

      try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          if (parsedUser?.id) {
            // Check for id specifically
            setUserId(parsedUser.id);
          } else {
            throw new Error("User ID not found in user data");
          }
        } else {
          throw new Error("No user data in localStorage");
        }
      } catch (err) {
        console.error("Error getting user data:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    validateAndGetUser();
  }, [navigate]);

  // Fetch game data when userId is available
  useEffect(() => {
    if (!userId) return; // Don't fetch if no userId

    const fetchData = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL2}/single-ank/user/${userId}`
        );
        if (!response.ok) {
          throw new Error("No data available");
        }
        const data = await response.json();
        setGameData(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]); // Add userId as dependency

  if (loading) {
    return <div className="bid-history-container">Loading...</div>;
  }

  if (error) {
    return <div className="bid-history-container">Error: {error}</div>;
  }

  return (
    <div className="bid-history-container">
      <h2 className="bid-history-title">User Game Records</h2>
      {gameData.length === 0 ? (
        <p>No game records found</p>
      ) : (
        <table className="bid-history-table">
          <thead className="bid-history-thead">
            <tr className="bid-history-header-row">
              <th className="bid-history-th">Username</th>
              {digits.map((digit) => (
                <th key={digit} className="bid-history-th">
                  {digit}
                </th>
              ))}
              <th className="bid-history-th">Type</th>
              <th className="bid-history-th">Date</th>
              <th className="bid-history-th">Total Bids</th>
              <th className="bid-history-th">Total Amount</th>
            </tr>
          </thead>
          <tbody className="bid-history-tbody">
            {gameData.map((item, index) => (
              <tr key={index} className="bid-history-row">
                <td className="bid-history-td">{item.addUserDTO.name}</td>
                <td className="bid-history-td">{item.zero || ""}</td>
                <td className="bid-history-td">{item.one || ""}</td>
                <td className="bid-history-td">{item.two || ""}</td>
                <td className="bid-history-td">{item.three || ""}</td>
                <td className="bid-history-td">{item.four || ""}</td>
                <td className="bid-history-td">{item.five || ""}</td>
                <td className="bid-history-td">{item.six || ""}</td>
                <td className="bid-history-td">{item.seven || ""}</td>
                <td className="bid-history-td">{item.eight || ""}</td>
                <td className="bid-history-td">{item.nine || ""}</td>
                <td className="bid-history-td">{item.type}</td>
                <td className="bid-history-td">{item.date}</td>
                <td className="bid-history-td">{item.totalBids}</td>
                <td className="bid-history-td">{item.totalBidAmount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default BidHistory;
