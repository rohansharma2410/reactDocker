import React, { useEffect, useState } from "react";
import { useLocation } from 'react-router-dom';
import { Modal, Button, Table } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { getLogs } from "./apifile"; // Ensure that `getLogs` accepts filtering params
import Navbar from './navbar';

const LogDetails = () => {
  const [logs, setLogs] = useState([]);
  const location = useLocation();
  const [selectedLog, setSelectedLog] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedSuccess, setSelectedSuccess] = useState(''); 
  const [selectedApiName, setSelectedApiName] = useState('');
  const { ApiName, user_id, startDate, endDate } = location.state || {}; // Extract startDate and endDate
  const [apiNames, setApiNames] = useState([]); 

  useEffect(() => {
    fetchLogs();
  }, [selectedApiName, selectedSuccess]);

  // Fetch logs from the API with filters
  const fetchLogs = async () => {
    try {
      const userId = localStorage.getItem('userId');
      if (userId) {
        console.log('Filters applied:', { user_id, ApiName, selectedApiName, selectedSuccess, startDate, endDate });

        // Fetch logs using the user_id, ApiName, selectedSuccess, startDate, and endDate as filters
        const data = await getLogs(user_id, ApiName || selectedApiName, startDate, endDate, selectedSuccess);

        // Log the returned data to check for issues
        console.log('API response data:', data);

        setLogs(data || []); // Update logs state

        // Extract unique API names from logs for the dropdown filter
        const uniqueApiNames = [...new Set(data.map(log => log.api_name))];
        setApiNames(uniqueApiNames);

      } else {
        console.error('User ID not found in local storage');
      }
    } catch (error) {
      console.error('Error fetching logs:', error);
    }
  };

  const handleViewData = (log) => {
    setSelectedLog(log);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedLog(null);
  };

  return (
    <div>
      <Navbar />
      <div>
        <h1 className="heading">Logs Details</h1>

        {/* Filter Section */}
        <div className="filter-container">
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

          <div className="filter-item-Drpdwn">
            <label>Status:</label>
            <select 
              className="drpdwnList"
              value={selectedSuccess}
              onChange={(e) => setSelectedSuccess(e.target.value)}
            >
              <option value="">All</option>
              <option value="Success">Success</option>
              <option value="Fail">Failed</option>
            </select>
          </div>

          <Button onClick={fetchLogs} style={{ width: '150px', background: '#223329',color:'white',marginBottom:'3px',paddingBottom:'9px',marginLeft:'auto'}}>
            Search
          </Button>
        </div>

        {/* Logs Table */}
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>S.NO.</th>
              <th>Timestamp</th>
              <th>User</th>
              <th>API</th>
              <th>Module Name</th>
              <th>Source</th>
              <th>Status</th>
              <th>Execution Time</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, index) => {
              // Parse responseTime to remove 'ms' and convert it into a number
              const responseTimeInMs = parseInt(log.responseTime, 10);
              const minutes = Math.floor(responseTimeInMs / 60000);
              const seconds = ((responseTimeInMs % 60000) / 1000).toFixed(2);

              return (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{new Date(log.timestamp).toLocaleString()}</td>
                  <td>{log.user}</td>
                  <td>{log.api_name}</td>
                  <td>{log.module_name}</td>
                  <td>{log.Source}</td>
                  <td>{log.Status}</td>
                  <td>{seconds}s</td>
                  <td>
                    <Button variant="primary" onClick={() => handleViewData(log)}>
                      View Details
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>

        {/* Log Details Modal */}
        {selectedLog && (
          <Modal show={showModal} onHide={handleCloseModal}>
            <Modal.Header closeButton>
              <Modal.Title>Log Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <h5>Input Data:</h5>
              <pre>{selectedLog.input_data}</pre>
              <h5>Output Data:</h5>
              <pre>{selectedLog.api_response}</pre>
              <h5>Reference Data:</h5>
              <pre>{selectedLog.Reference}</pre>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseModal}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        )}
      </div>
    </div>
  );
};

export default LogDetails;
