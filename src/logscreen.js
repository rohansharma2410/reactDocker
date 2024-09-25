import React, { useEffect, useState } from "react";
import { Button, Table, Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import DatePicker from "react-datepicker";
import { saveAs } from "file-saver";
import "react-datepicker/dist/react-datepicker.css";
import { getLogsAll, api_names, user_names } from "./apifile";
import Navbar from "./navbar";
import * as XLSX from "xlsx";
import { useNavigate } from "react-router-dom";
import "./style.css";

const Logscreen = () => {
  const [logs, setLogs] = useState([]);
  const [apiNames, setApiNames] = useState([]);
  const [users, setUsers] = useState([]);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [selectedApiName, setSelectedApiName] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedSuccess, setSelectedSuccess] = useState("");
  const [role, setRole] = useState("");
  const [dateFilter, setDateFilter] = useState("Today");
  const [customFromDate, setCustomFromDate] = useState(null);
  const [customToDate, setCustomToDate] = useState(null);
  const [showCustomDateModal, setShowCustomDateModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const defaultFromDate = getDefaultTodayDate();
    const defaultToDate = getDefaultTodayDate();

    setFromDate(defaultFromDate);
    setToDate(defaultToDate);

    fetchLogs(defaultFromDate, defaultToDate);
    fetchUsers();

    const userRole = localStorage.getItem("role");
    setRole(userRole);
  }, []);

  useEffect(() => {
    let startDate, endDate;

    switch (dateFilter) {
      case "Today":
        startDate = new Date();
        endDate = startDate;
        break;

      case "Yesterday":
        startDate = new Date();
        startDate.setDate(startDate.getDate() - 1);
        endDate = startDate;
        break;

      case "This Month":
        startDate = getDefaultFromDate();
        endDate = new Date();
        break;

      case "Custom":
        startDate = customFromDate;
        endDate = customToDate;
        break;

      default:
        startDate = new Date();
        endDate = startDate;
    }

    fetchLogs(startDate, endDate);
  }, [
    dateFilter,
    customFromDate,
    customToDate,
    selectedApiName,
    selectedUser,
    selectedSuccess,
  ]);

  const getDefaultTodayDate = () => {
    return new Date();
  };

  const getDefaultFromDate = () => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  };

  const fetchLogs = async (fromDate, toDate) => {
    console.log("Fetching logs with:", {
      fromDate: formatDateForAPI(fromDate),
      toDate: formatDateForAPI(toDate),
      selectedApiName,
      selectedUser,
      selectedSuccess,
    });

    try {
      const userId = localStorage.getItem("userId");
      if (userId) {
        const adjustedFromDate = new Date(fromDate);
        adjustedFromDate.setDate(adjustedFromDate.getDate());

        const startDate = formatDateForAPI(adjustedFromDate);
        const endDate = formatDateForAPI(toDate || new Date());
        setFromDate(startDate);
    setToDate(endDate);
        const data = await getLogsAll(
          userId,
          startDate,
          endDate,
          selectedApiName,
          role === "Admin" ? selectedUser : "",
          selectedSuccess
        );

        console.log("Logs data:", data);

        setLogs(data.call_logs || []);
        const uniqueApiNames = Array.from(
          new Set(data.call_logs.map((log) => log.api_name))
        );
        setApiNames(uniqueApiNames);
      } else {
        console.error("User ID not found in local storage");
      }
    } catch (error) {
      console.error("Error fetching logs:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const data = await user_names();
      console.log("Fetched Users:", data);
      setUsers(data.user_names || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };
  
  const handleExport = () => {
    const ws = XLSX.utils.json_to_sheet(
      logs.map((log) => ({
     ...log,
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "LOG Data");
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(
      new Blob([wbout], { type: "application/octet-stream" }),
      "Log_Data.xlsx"
    );
  };

  const formatDateForAPI = (date) => {
    const d = new Date(date);
    let month = "" + (d.getMonth() + 1);
    let day = "" + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  };

  const formatDateForDisplay = (dateStr) => {
    const date = new Date(dateStr);
    let day = "" + date.getDate();
    let month = "" + (date.getMonth() + 1);
    const year = date.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [day, month, year].join("/");
  };

  const formatDateForDisplayFromDate = (dateStr) => {
    const date = new Date(dateStr);
    let day = "" + date.getDate();
    let month = "" + (date.getMonth() + 1);
    const year = date.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [day, month, year].join("/");
  };

  const handleRowClick = (log) => {
    navigate("/logdetails", {
      state: {
        ApiName: log.api_name,
        user_id: log.user_id,
        startDate: fromDate,
        endDate: toDate,
      },
    });
  };

  const filteredLogs = logs.filter((log) => {
    return (
      (selectedApiName === "" || log.api_name === selectedApiName) &&
      (selectedUser === "" || log.user === selectedUser) &&
      (selectedSuccess === "" || log.success === selectedSuccess)
    );
  });

  return (
    <div>
      <Navbar />
      <div>
        <h1 className="heading">Logs</h1>
        <div className="filter-container">
          <div className="filter-item-Drpdwn">
            <label style={{ marginRight: "10px", fontFamily: "Poppins" }}>
              Date:
            </label>
            <select
              className="drpdwnList"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            >
              <option value="Today">Today </option>
              <option value="This Month">This Month</option>
              <option value="Yesterday">Yesterday</option>
              <option value="Custom">Custom</option>
            </select>
          </div>
          {dateFilter === "Custom" && (
            <div className="filter-item">
              <label>From Date:</label>
              <DatePicker
                selected={customFromDate}
                onChange={(date) => setCustomFromDate(date)}
                dateFormat="dd/MM/yyyy"
                placeholderText="Select From Date"
              />
            </div>
          )}
          {dateFilter === "Custom" && (
            <div className="filter-item">
              <label>To Date:</label>
              <DatePicker
                selected={customToDate}
                onChange={(date) => setCustomToDate(date)}
                dateFormat="dd/MM/yyyy"
                placeholderText="Select To Date"
              />
            </div>
          )}
          <div className="filter-item-Drpdwn">
            <label
              style={{
                marginRight: "10px",
                paddingLeft: "10px",
                fontFamily: "Poppins",
                fontWeight: "400",
              }}
            >
              API Name:
            </label>
            <select
              className="drpdwnList"
              value={selectedApiName}
              onChange={(e) => setSelectedApiName(e.target.value)}
            >
              <option value="">All</option>
              {apiNames.map((apiName, index) => (
                <option key={index} value={apiName}>
                  {apiName}
                </option>
              ))}
            </select>
          </div>

          {role === "Admin" && (
            <div className="filter-item-Drpdwn">
              <label>Client:</label>
              <select
                className="drpdwnList"
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
              >
                <option value="">All</option>
                {users.map((userName, index) => (
                  <option key={index} value={userName}>
                    {userName}
                  </option>
                ))}
              </select>
            </div>
          )}
          <Button
           onClick={handleExport}
            style={{
              width: "150px",
              background: "#223329",
              color: "white",
              marginBottom: "3px",
              paddingBottom: "9px",
              marginLeft: "auto",
            }}
          >
            Download Excel
          </Button>
          {/* <Button
 onClick={() => fetchLogs(fromDate, toDate)}
            style={{
              width: "150px",
              background: "#223329",
              color: "white",
              marginBottom: "3px",
              paddingBottom: "9px",
              marginLeft: "20px",
            }}
          >
            Search
          </Button> */}
        </div>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th style={{ background: "#C7EAE6" }}>S.NO</th>
              <th style={{ background: "#C7EAE6" }}>Client</th>
              <th style={{ background: "#C7EAE6" }}>API Name</th>
              <th style={{ background: "#C7EAE6" }}>Module Name</th>
              <th style={{ background: "#C7EAE6" }}>From Date</th>
              <th style={{ background: "#C7EAE6" }}>To Date</th>
              <th style={{ background: "#C7EAE6" }}>Failure </th>
              <th style={{ background: "#C7EAE6" }}>Success</th>
              <th style={{ background: "#C7EAE6" }}>Total Count</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.length === 0 ? (
              <tr>
                <td colSpan="10">No logs found</td>
              </tr>
            ) : (
              filteredLogs.map((log, index) => (
                <tr
                  key={index}
                  onClick={() => handleRowClick(log)}
                  style={{ cursor: "pointer" }}
                >
                  <td>{index + 1}</td>
                  <td>{log.user}</td>
                  <td>{log.api_name}</td>
                  <td>{log.module_name}</td>
                  <td>{formatDateForDisplayFromDate(log["From-Date"])}</td>
                  <td>{formatDateForDisplay(log["To-Date"])}</td>
                  <td>{log.failure_count}</td>
                  <td>{log.success_count}</td>
                  <td>{log.total_count}</td>
                </tr>
              ))
            )}
          </tbody>
        </Table>

        {/* Modal for custom date range */}
        <Modal
          show={showCustomDateModal}
          onHide={() => setShowCustomDateModal(false)}
        >
          <Modal.Header closeButton>
            <Modal.Title>Select Date Range</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="filter-item">
              <label>From Date:</label>
              <DatePicker
                selected={customFromDate}
                onChange={(date) => setCustomFromDate(date)}
                dateFormat="dd/MM/yyyy"
                placeholderText="Select From Date"
              />
            </div>
            <div className="filter-item">
              <label>To Date:</label>
              <DatePicker
                selected={customToDate}
                onChange={(date) => setCustomToDate(date)}
                dateFormat="dd/MM/yyyy"
                placeholderText="Select To Date"
              />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowCustomDateModal(false)}
            >
              Close
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                setShowCustomDateModal(false);
                // Trigger search when applying custom date range
                fetchLogs(customFromDate, customToDate);
              }}
            >
              Apply
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default Logscreen;
