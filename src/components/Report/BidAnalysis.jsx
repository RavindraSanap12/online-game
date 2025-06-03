import React, { useState, useEffect } from "react";
import "./BidAnalysis.css";
import { API_BASE_URL2 } from "../api";

const BidAnalysis = () => {
  // Get current date in YYYY-MM-DD format
  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const [date, setDate] = useState(getCurrentDate());
  const [marketType, setMarketType] = useState("Main Market");
  const [game, setGame] = useState("Choose Game");
  const [session, setSession] = useState("Choose Session");
  const [allData, setAllData] = useState([]); // Store all fetched data
  const [filteredData, setFilteredData] = useState([]); // Data filtered by date
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL2}/single-ank`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const result = await response.json();
      setAllData(result);
      filterDataByDate(result, date); // Filter initially by current date
    } catch (error) {
      console.error("Error fetching data:", error);
      setAllData([]);
      setFilteredData([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  const filterDataByDate = (data, selectedDate) => {
    const filtered = data.filter((item) => item.date === selectedDate);
    setFilteredData(filtered);
    setTotal(filtered.reduce((sum, item) => sum + item.totalBidAmount, 0));
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (allData.length > 0) {
      filterDataByDate(allData, date);
    }
  }, [date, allData]);

  const handleSearch = () => {
    filterDataByDate(allData, date);
  };

  return (
    <div className="bid-analysis-container">
      <div className="bid-analysis-header">
        <span className="bid-analysis-title">Bid Analysis</span>
        <span className="bid-analysis-total">
          Total : <span className="bid-analysis-total-count">{total}</span>
        </span>
      </div>

      <div className="bid-analysis-filters">
        <div className="bid-analysis-group">
          <label className="bid-analysis-label">Date *</label>
          <input
            type="date"
            className="bid-analysis-input"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <div className="bid-analysis-group">
          <label className="bid-analysis-label">Market Type</label>
          <select
            className="bid-analysis-select"
            value={marketType}
            onChange={(e) => setMarketType(e.target.value)}
          >
            <option>Main Market</option>
            <option>Starline</option>
          </select>
        </div>

        <div className="bid-analysis-group">
          <label className="bid-analysis-label">Game *</label>
          <select
            className="bid-analysis-select"
            value={game}
            onChange={(e) => setGame(e.target.value)}
          >
            <option>Choose Game</option>
            <option>Single Digit</option>
            <option>Jodi</option>
            <option>Patti</option>
          </select>
        </div>

        <div className="bid-analysis-group">
          <label className="bid-analysis-label">Session</label>
          <select
            className="bid-analysis-select"
            value={session}
            onChange={(e) => setSession(e.target.value)}
          >
            <option>Choose Session</option>
            <option>Open</option>
            <option>Close</option>
          </select>
        </div>

        <div className="bid-analysis-group bid-analysis-search-btn-wrapper">
          <button className="bid-analysis-search-btn" onClick={handleSearch}>
            Search
          </button>
        </div>
      </div>

      {loading ? (
        <div className="bid-analysis-loading">Loading...</div>
      ) : filteredData.length > 0 ? (
        <div className="bid-analysis-table-container">
          <table className="bid-analysis-table">
            <thead>
              <tr>
                <th>Username</th>
                <th>0</th>
                <th>1</th>
                <th>2</th>
                <th>3</th>
                <th>4</th>
                <th>5</th>
                <th>6</th>
                <th>7</th>
                <th>8</th>
                <th>9</th>
                <th>Type</th>
                <th>Date</th>
                <th>Total Bids</th>
                <th>Total Amount</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => (
                <tr key={item.id}>
                  <td>{item.addUserDTO?.name || "N/A"}</td>
                  <td>{item.zero || ""}</td>
                  <td>{item.one || ""}</td>
                  <td>{item.two || ""}</td>
                  <td>{item.three || ""}</td>
                  <td>{item.four || ""}</td>
                  <td>{item.five || ""}</td>
                  <td>{item.six || ""}</td>
                  <td>{item.seven || ""}</td>
                  <td>{item.eight || ""}</td>
                  <td>{item.nine || ""}</td>
                  <td>{item.type}</td>
                  <td>{item.date}</td>
                  <td>{item.totalBids}</td>
                  <td>{item.totalBidAmount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bid-analysis-no-data">
          No data available for selected date
        </div>
      )}
    </div>
  );
};

export default BidAnalysis;
