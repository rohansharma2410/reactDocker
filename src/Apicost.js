import React, { useEffect, useState } from "react";
import { addCost, apicost } from "./apifile";
import Navbar from "./navbar";
import "bootstrap/dist/css/bootstrap.min.css"; // Optional if you want to use Bootstrap

const AddCostForm = ({ userRole }) => {
  const [formData, setFormData] = useState({
    client_name: "",
    api_name: "",
    module_name: "",
    active: "",
    startdate: "",
    enddate: "",
    price: "",
  });
  const [role, setRole] = useState("");
  const [apiCosts, setApiCosts] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    apicostdata();
    const savedRole = localStorage.getItem("role"); // Fetch role from localStorage
    setRole(savedRole);
  }, []);

  const apicostdata = async () => {
    try {
      const data = await apicost();
      console.log("API cost data: ", data.api_cost_data);
      setApiCosts(data.api_cost_data || []);
    } catch (error) {
      console.error("Error fetching API costs:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await addCost(formData);
      alert("Cost added successfully");
      apicostdata(); // Refresh the table after adding the cost
    } catch (error) {
      alert("Error adding cost");
    }
  };

  const handleEdit = (cost) => {
    setIsEditMode(true);
    setFormData({
      client_name: cost.client_name,
      api_name: cost.api_name,
      module_name: cost.module_name,
      active: cost.active,
      startdate: cost.startdate,
      enddate: cost.enddate,
      price: cost.price,
    });
  };

  return (
    <div>
      <Navbar/>

  
      <div >
      <h1 className="heading">API Cost Details</h1>
        <table className="table table-bordered table-hover">
          <thead className="thead-dark">
            <tr>
              <th>API Name</th>
              <th>Price</th>
              <th>Start Date</th>
              {role === "Admin" && <th>Edit</th>} {/* Show Edit column if admin */}
            </tr>
          </thead>
          <tbody>
            {apiCosts.length > 0 ? (
              apiCosts.map((cost, index) => (
                <tr key={index}>
                  <td>{cost.api_name}</td>
                  <td>₹{cost.price}</td>
                  <td>{cost.startdate}</td> {/* Show Start Date */}
                  {role === "Admin" && (
                    <td>
                      <button
                       style={{ width: '150px', background: '#223329',color:'white',marginBottom:'3px',paddingBottom:'9px',marginLeft:'auto'}}
                        onClick={() => handleEdit(cost)}
                      >
                        Edit
                      </button>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td>No data available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isEditMode && (
        <div className="container mt-4">
          <h3>{isEditMode ? "Edit Cost" : "Add Cost"}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Client Name:</label>
              <input
                type="text"
                className="form-control"
                name="client_name"
                value={formData.client_name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>API Name:</label>
              <input
                type="text"
                className="form-control"
                name="api_name"
                value={formData.api_name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Module Name:</label>
              <input
                type="text"
                className="form-control"
                name="module_name"
                value={formData.module_name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Active:</label>
              <input
                type="text"
                className="form-control"
                name="active"
                value={formData.active}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Start Date:</label>
              <input
                type="date"
                className="form-control"
                name="startdate"
                value={formData.startdate}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>End Date:</label>
              <input
                type="date"
                className="form-control"
                name="enddate"
                value={formData.enddate}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Price:</label>
              <input
                type="number"
                className="form-control"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">
              {isEditMode ? "Update Cost" : "Add Cost"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AddCostForm;
