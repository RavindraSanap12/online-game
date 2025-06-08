import React, { useState, useEffect } from "react";
import "./BidAnalysis.css";
import { API_BASE_URL, API_BASE_URL2 } from "../api";

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
  const [marketType, setMarketType] = useState("Main Bazar");
  const [game, setGame] = useState("Single Ank");
  const [users, setUsers] = useState([]); // Store all users
  const [selectedUser, setSelectedUser] = useState("All Users"); // Selected user filter
  const [allData, setAllData] = useState([]); // Store all fetched data
  const [filteredData, setFilteredData] = useState([]); // Data filtered by date and user
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const getEndpoint = () => {
    switch (game) {
      case "Jodi":
        return "jodis";
      case "Single Patti":
        return "single-patti";
      case "Double Patti":
        return "double-patti";
      case "Triple Patti":
        return "tripple-patti";
      case "Sangam":
        return "full-sangam";
      case "SP DP TP":
        return "spdptp";
      case "SP Motor":
        return "spmotor";
      case "DP Motor":
        return "dpmotor";
      default:
        return "single-ank";
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/users`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const result = await response.json();
      setUsers(result);
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsers([]);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const endpoint = getEndpoint();
      const response = await fetch(`${API_BASE_URL2}/${endpoint}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const result = await response.json();
      setAllData(result);
      filterDataByDateAndUser(result, date, selectedUser);
    } catch (error) {
      console.error("Error fetching data:", error);
      setAllData([]);
      setFilteredData([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  const filterDataByDateAndUser = (data, selectedDate, userFilter) => {
    let filtered = data.filter((item) => item.date === selectedDate);

    if (userFilter !== "All Users") {
      filtered = filtered.filter(
        (item) => item.addUserDTO?.name === userFilter
      );
    }

    setFilteredData(filtered);
    setTotal(
      filtered.reduce(
        (sum, item) => sum + (item.totalBidAmount || item.points || 0),
        0
      )
    );
  };

  useEffect(() => {
    fetchUsers();
    fetchData();
  }, []); // Initial fetch

  useEffect(() => {
    fetchData();
  }, [game]); // Refetch when game changes

  useEffect(() => {
    if (allData.length > 0) {
      filterDataByDateAndUser(allData, date, selectedUser);
    }
  }, [date, allData, selectedUser]);

  const handleSearch = () => {
    filterDataByDateAndUser(allData, date, selectedUser);
  };

  const renderTableHeaders = () => {
    if (game === "Jodi") {
      return (
        <thead>
          <tr>
            <th>Username</th>
            {Array.from({ length: 10 }, (_, i) => (
              <th key={`header-${i}`}>{i}</th>
            ))}
            <th>Type</th>
            <th>Date</th>
            <th>Total Bids</th>
            <th>Total Amount</th>
          </tr>
        </thead>
      );
    } else if (game === "Single Patti" || game === "Double Patti") {
      return (
        <thead>
          <tr>
            <th>Username</th>
            {Array.from({ length: 10 }, (_, i) => (
              <th key={`header-${i}`}>Digit {i}</th>
            ))}
            <th>Type</th>
            <th>Date</th>
            <th>Total Bids</th>
            <th>Total Amount</th>
          </tr>
        </thead>
      );
    } else if (game === "Sangam") {
      return (
        <thead>
          <tr>
            <th>Username</th>
            <th>Open Panna</th>
            <th>Close Digit</th>
            <th>Points</th>
            <th>Type</th>
            <th>Date</th>
          </tr>
        </thead>
      );
    } else if (game === "SP DP TP") {
      return (
        <thead>
          <tr>
            <th>Username</th>
            <th>Digit</th>
            <th>Points</th>
            <th>Game Type</th>
            <th>Date</th>
          </tr>
        </thead>
      );
    } else if (game === "SP Motor" || game === "DP Motor") {
      return (
        <thead>
          <tr>
            <th>Username</th>
            <th>Market</th>
            <th>Digit</th>
            <th>Points</th>
            <th>Session</th>
            <th>Date</th>
          </tr>
        </thead>
      );
    } else {
      return (
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
      );
    }
  };

  const renderTableBody = () => {
    if (game === "Jodi") {
      return (
        <tbody>
          {filteredData.map((item) => {
            const digitValues = item.digitValues || {};
            return (
              <tr key={item.id}>
                <td>{item.addUserDTO?.name || "N/A"}</td>
                {Array.from({ length: 10 }, (_, i) => (
                  <td key={`digit-${i}`}>
                    {Object.entries(digitValues)
                      .filter(([key]) => key.startsWith(i.toString()))
                      .map(([key, value]) => (
                        <div key={key}>
                          {key}: {value}
                        </div>
                      ))}
                  </td>
                ))}
                <td>{item.type}</td>
                <td>{item.date}</td>
                <td>{item.totalBids}</td>
                <td>{item.totalBidAmount}</td>
              </tr>
            );
          })}
        </tbody>
      );
    } else if (game === "Single Patti" || game === "Double Patti") {
      return (
        <tbody>
          {filteredData.map((item) => {
            const digitValues = item.digitValues || {};
            return (
              <tr key={item.id}>
                <td>{item.addUserDTO?.name || "N/A"}</td>
                {Array.from({ length: 10 }, (_, i) => (
                  <td key={`digit-${i}`}>
                    {digitValues[`single digit ${i}`] &&
                      Object.entries(digitValues[`single digit ${i}`]).map(
                        ([key, value]) => (
                          <div key={key}>
                            {key}: {value}
                          </div>
                        )
                      )}
                  </td>
                ))}
                <td>{item.type}</td>
                <td>{item.date}</td>
                <td>{item.totalBids}</td>
                <td>{item.totalBidAmount}</td>
              </tr>
            );
          })}
        </tbody>
      );
    } else if (game === "Triple Patti") {
      return (
        <tbody>
          {filteredData.map((item) => (
            <tr key={item.id}>
              <td>{item.addUserDTO?.name || "N/A"}</td>
              <td>{item.zero3 || ""}</td>
              <td>{item.one3 || ""}</td>
              <td>{item.two3 || ""}</td>
              <td>{item.three3 || ""}</td>
              <td>{item.four3 || ""}</td>
              <td>{item.five3 || ""}</td>
              <td>{item.six3 || ""}</td>
              <td>{item.seven3 || ""}</td>
              <td>{item.eight3 || ""}</td>
              <td>{item.nine3 || ""}</td>
              <td>{item.type}</td>
              <td>{item.date}</td>
              <td>{item.totalBids}</td>
              <td>{item.totalBidAmount}</td>
            </tr>
          ))}
        </tbody>
      );
    } else if (game === "Sangam") {
      return (
        <tbody>
          {filteredData.map((item) => (
            <tr key={item.id}>
              <td>{item.addUserDTO?.name || "N/A"}</td>
              <td>{item.openPanna || ""}</td>
              <td>{item.closeDigit || ""}</td>
              <td>{item.points || ""}</td>
              <td>{item.type}</td>
              <td>{item.date}</td>
            </tr>
          ))}
        </tbody>
      );
    } else if (game === "SP DP TP") {
      return (
        <tbody>
          {filteredData.map((item) => (
            <tr key={item.id}>
              <td>{item.addUserDTO?.name || "N/A"}</td>
              <td>{item.digit || ""}</td>
              <td>{item.points || ""}</td>
              <td>
                {item.gameType === "1"
                  ? "Single Patti"
                  : item.gameType === "2"
                  ? "Double Patti"
                  : item.gameType === "3"
                  ? "Triple Patti"
                  : ""}
              </td>
              <td>{item.date || ""}</td>
            </tr>
          ))}
        </tbody>
      );
    } else if (game === "SP Motor" || game === "DP Motor") {
      return (
        <tbody>
          {filteredData.map((item) => (
            <tr key={item.id}>
              <td>{item.addUserDTO?.name || "N/A"}</td>
              <td>
                {item.mainMarketDTO?.title ||
                  item.delhiMarketDTO?.title ||
                  item.starlineMarketDTO?.title ||
                  "N/A"}
              </td>
              <td>{item.digit || ""}</td>
              <td>{item.points || ""}</td>
              <td>{item.gameType === "open" ? "Open" : "Close"}</td>
              <td>{item.date || ""}</td>
            </tr>
          ))}
        </tbody>
      );
    } else {
      return (
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
      );
    }
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
          <label className="bid-analysis-label">Game *</label>
          <select
            className="bid-analysis-select"
            value={game}
            onChange={(e) => setGame(e.target.value)}
          >
            <option>Single Ank</option>
            <option>Jodi</option>
            <option>Single Patti</option>
            <option>Double Patti</option>
            <option>Triple Patti</option>
            <option>Sangam</option>
            <option>SP DP TP</option>
            <option>SP Motor</option>
            <option>DP Motor</option>
          </select>
        </div>

        <div className="bid-analysis-group">
          <label className="bid-analysis-label">User</label>
          <select
            className="bid-analysis-select"
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
          >
            <option>All Users</option>
            {users.map((user) => (
              <option key={user.id} value={user.name}>
                {user.name}
              </option>
            ))}
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
            {renderTableHeaders()}
            {renderTableBody()}
          </table>
        </div>
      ) : (
        <div className="bid-analysis-no-data">
          No data available for selected{" "}
          {selectedUser !== "All Users" ? "user and " : ""}date
        </div>
      )}
    </div>
  );
};

export default BidAnalysis;
