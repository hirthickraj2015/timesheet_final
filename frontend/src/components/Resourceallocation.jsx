import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Resourceallocation.css';

function Resourceallocation() {
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    projectId: '',
    userId: '',
    startDate: '',
    endDate: ''
  });
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    // Fetch projects
    axios.get('http://localhost:4000/projects')
      .then(response => {
        setProjects(response.data);
      })
      .catch(error => {
        console.error('Error fetching projects:', error);
      });

    // Fetch users
    axios.get('http://localhost:4000/users')
      .then(response => {
        setUsers(response.data);
      })
      .catch(error => {
        console.error('Error fetching users:', error);
      });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your form submission logic here
    console.log(formData);
  
    // Send the form data to the backend
    axios.post('http://localhost:4000/allocate-resources', formData)
      .then(response => {
        console.log('Resource allocation successful:', response.data);
        setSuccessMessage("Resources allocated successfully!");
        // Reset form data after successful submission
        setFormData({
          projectId: '',
          userId: '',
          startDate: '',
          endDate: ''
        });
        // Hide success message after 3 seconds
        setTimeout(() => {
          setSuccessMessage("");
        }, 3000);
      })
      .catch(error => {
        console.error('Error allocating resources:', error);
        // Handle error if needed
      });
  };

  // Function to set min and max attributes for date inputs based on selected project
  const handleProjectChange = (e) => {
    const selectedProjectId = e.target.value;
    const selectedProject = projects.find(project => project.projectId === selectedProjectId);
    if (selectedProject) {
      setFormData({
        ...formData,
        projectId: selectedProjectId,
        startDate: '',
        endDate: ''
      });
      const minDate = selectedProject.startDate;
      const maxDate = selectedProject.endDate;
      document.getElementById('startDate').min = minDate;
      document.getElementById('startDate').max = maxDate;
      document.getElementById('endDate').min = minDate;
      document.getElementById('endDate').max = maxDate;
    }
  };

  return (
    <div className="resource-allocation-container">
      <h1>Resource Allocation</h1>
      <form onSubmit={handleSubmit} className="resource-allocation-form">
        {successMessage && <p className="success-message">{successMessage}</p>}
        <div className="form-group">
          <label htmlFor="projectId">Project ID:</label>
          <select id="projectId" name="projectId" value={formData.projectId} onChange={handleProjectChange} className="resource-allocation-select" required>
            <option value="">Select Project ID</option>
            {projects.map(project => (
              <option key={project._id} value={project.projectId}>{project.projectId}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="userId">Select User:</label>
          <select id="userId" name="userId" value={formData.userId} onChange={handleInputChange} className="resource-allocation-select" required>
            <option value="">Select User</option>
            {users.map(user => (
              <option key={user._id} value={user.userID}>{user.userID}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="startDate">Start Date:</label>
          <input type="date" id="startDate" name="startDate" value={formData.startDate} onChange={handleInputChange} className="resource-allocation-input" required />
        </div>
        <div className="form-group">
          <label htmlFor="endDate">End Date:</label>
          <input type="date" id="endDate" name="endDate" value={formData.endDate} onChange={handleInputChange} className="resource-allocation-input" required />
        </div>
        <button type="submit" className="resource-allocation-btn">Allocate Resources</button>
      </form>
    </div>
  );
}

export default Resourceallocation;
