import React, { useEffect, useState } from "react";
import { api_names, get_api_cost_data, user_names } from "./apifile";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./style.css";
import { Button, Table } from "react-bootstrap";
import Navbar from "./navbar";

const CostReport = () => {
  const [costdata, setcostdata] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedApiName, setSelectedApiName] = useState('');
  
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [apiNames, setApiNames] = useState([]);
  const [users, setUsers] = useState([]);
  
  const [selectedClient, setSelectedClient] = useState("");
  const [selectedUser, setSelectedUser] = useState('');
  const [clients, setClients] = useState([]);

  useEffect(() => {
    fetchApiNames();
    fetchUsers();
    const getcost = async () => {
      setLoading(true);
      setError(null);
      try {
        const formattedStartDate = startDate
          ? startDate.toISOString().split("T")[0]
          : null;
        const formattedEndDate = endDate
          ? endDate.toISOString().split("T")[0]
          : null;
        const data = await get_api_cost_data(
          formattedStartDate,
          formattedEndDate
        );
        console.log("Fetched cost data:", data);

        const filteredData = data.api_cost_data.filter((cost) => !cost.enddate);
        setcostdata(filteredData || []);

        const uniqueClients = [
          ...new Set(filteredData.map((cost) => cost.username)),
        ];
        setClients(uniqueClients);
      } catch (error) {
        console.error("Error fetching API cost data:", error);
        setError("Failed to load cost data.");
      } finally {
        setLoading(false);
      }
    };

    getcost();
  }, [startDate, endDate]);

  const formatDate = (dateString) => {
    const options = { day: "2-digit", month: "2-digit", year: "numeric" };
    return new Date(dateString).toLocaleDateString("en-GB", options);
  };

  const fetchApiNames = async () => {
    try {
      const data = await api_names();
      console.log('Fetched API Names:', data);
      setApiNames(data.api_names || []);
    } catch (error) {
      console.error('Error fetching API names:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const data = await user_names();
      console.log('Fetched Users:', data);
      setUsers(data.user_names || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleExport = () => {
    const ws = XLSX.utils.json_to_sheet(
      costdata.map((cost) => ({
        ...cost,
        total_price: cost.price * cost.api_usage_count, 
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Cost Data");
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(
      new Blob([wbout], { type: "application/octet-stream" }),
      "cost_data.xlsx"
    );
  };

  const filteredCostData = costdata.filter((cost) => {
    return (
      (selectedUser ? cost.username === selectedUser : true) &&
      (selectedApiName ? cost.api_name === selectedApiName : true)
    );
  });

  return (
    <div>
            <Navbar />

    
      <h1 className="heading">Cost Report</h1>

      <div className="filter-container">
        <div className="filter-item">
          <label>From Date:</label>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            dateFormat="dd/MM/yyyy"
            placeholderText="Select From Date"
          />
        </div>
        <div className="filter-item">
          <label>To Date:</label>
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            dateFormat="dd/MM/yyyy"
            placeholderText="Select To Date"
          />
        </div>
        <div className="filter-item-Drpdwn">
          <label>API Name:</label>
          <select 
            className="drpdwnList"
            value={selectedApiName}
            onChange={(e) => setSelectedApiName(e.target.value)}
          >
            <option value="">All</option>
            {apiNames.map((apiName, index) => (
              <option key={index} value={apiName}>{apiName}</option>
            ))}
          </select>
        </div>
        <div 
          className="filter-item-Drpdwn"
        >
          <label>Client:</label>
          <select 
            className="drpdwnList"
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
          >
            <option value="">All</option>
            {users.map((userName, index) => (
              <option key={index} value={userName}>{userName}</option>
            ))}
          </select>
        </div>
        <Button
          // onClick={handleSearch}
          style={{ width: '150px', background: '#223329',color:'white',marginBottom:'3px',paddingBottom:'9px',marginLeft:'auto'}}
        >
          Search
        </Button>
      </div>

      {loading ? (
        <div><p>Loading data...</p> </div>
      ) : error ? (
        <div> <p className="error">{error}</p> </div>
      ) : (
        <div>
          <div className="btnCostReport">
            <button onClick={handleExport}>Download as Excel</button>
          </div>

          <div className="table-container">
            {filteredCostData.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <th>API Name</th>
                    <th>Client</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Unit Price</th>
                    <th>Count</th>
                    <th>Total Price</th>
                  </tr> 
                </thead>
                <tbody>
                  {filteredCostData.map((cost, index) => (
                    <tr key={index}>
                      <td>{cost.api_name}</td>
                      <td>{cost.username}</td>
                      <td>{formatDate(cost.startdate)}</td>
                      <td>{cost.enddate ? formatDate(cost.enddate) : "N/A"}</td>
                      <td>₹{cost.price}</td>
                      <td>{cost.api_usage_count}</td>
                      <td>₹{(cost.price * cost.api_usage_count).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No cost data available</p>
            )}
          </div>
        </div>
      )}
    </div>
    
  );
};

export default CostReport;
