import React, { useState } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import "./Adduser.css";

function Adduser() {
  const { userID } = useParams();
  const [formData, setFormData] = useState({
    userID: "",
    firstName: "",
    lastName: "",
    dob: "", // Remove the initial date of birth
    mailID: "",
    gender: "",
    role: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    if (
      !formData.userID ||
      !formData.firstName ||
      !formData.lastName ||
      !formData.dob ||
      !formData.mailID ||
      !formData.gender ||
      !formData.role
    ) {
      setErrorMessage("All fields are required.");
      setTimeout(() => {
        setErrorMessage("");
      }, 3000);
      return false;
    }
    return true;
  };

  const handleAddUser = async () => {
    if (!validateForm()) {
      return;
    }
  
    try {
      const response = await fetch("http://localhost:4000/add-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
  
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to add user");
      }
  
      setSuccessMessage("User added successfully! Please change the password.");
      // Reset form data after success message is displayed
      setFormData({
        userID: "",
        firstName: "",
        lastName: "",
        dob: "",
        mailID: "",
        gender: "",
        role: "",
      });
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (error) {
      console.error("Error adding user:", error.message);
      setErrorMessage(error.message);
      setTimeout(() => {
        setErrorMessage("");
      }, 3000);
    }
  };  

  return (
    <div className="container mt-5">
      <center><h1 style={{marginBottom:"25px",color:"#19105b"}}>Add User</h1></center>
      <div className="card adduser-container">
        <div className="card-body">
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          {successMessage && <p className="success-message">{successMessage}</p>}
          <div className="form-group">
            <label htmlFor="userID" className="form-label">
              UserID
            </label>
            <input
              type="text"
              id="userID"
              name="userID"
              value={formData.userID}
              onChange={handleInputChange}
              className="form-control"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="firstName" className="form-label">
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              className="form-control"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="lastName" className="form-label">
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              className="form-control"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="dob" className="form-label dbo">
              Date of Birth
            </label>
            <input
              type="date"
              id="dob"
              name="dob"
              value={formData.dob}
              onChange={handleInputChange}
              className="form-control"
              max={(new Date()).toISOString().split("T")[0]} // Set max date to today's date
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="mailID" className="form-label">
              Email
            </label>
            <input
              type="email"
              id="mailID"
              name="mailID"
              value={formData.mailID}
              onChange={handleInputChange}
              className="form-control"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="gender" className="form-label">
              Gender
            </label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              className="form-control"
              required
            >
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="role" className="form-label">
              Role
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              className="form-control"
              required
            >
              <option value="">Select</option>
              <option value="admin">Admin</option>
              <option value="software_engineer">Software Engineer</option>
              <option value="sr_software_engineer">
                Sr. Software Engineer
              </option>
              <option value="solution_enabler">Solution Enabler</option>
              <option value="tribe_master">Tribe Master</option>
            </select>
          </div>

          <button onClick={handleAddUser} className="btn btn-primary">
            Add User
          </button>
        </div>
      </div>
    </div>
  );
}

export default Adduser;
