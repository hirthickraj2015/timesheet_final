import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Addproject.css';

function AddProject() {
  const [formData, setFormData] = useState({
    projectName: '',
    projectId: '',
    category: '',
    startDate: '',
    endDate: '',
    tasks: []
  });
  const [newTask, setNewTask] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage('');
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleTaskInputChange = (e) => {
    setNewTask(e.target.value);
  };

  const addTask = () => {
    if (newTask.trim() !== '') {
      setFormData({
        ...formData,
        tasks: [...formData.tasks, newTask.trim()]
      });
      setNewTask('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.startDate > formData.endDate) {
      setErrorMessage('End date should not be less than start date');
      setTimeout(() => {
        setErrorMessage('');
      }, 3000);
      return;
    }

    try {
      const response = await fetch('http://localhost:4000/add-project', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
        })
      });

      if (!response.ok) {
        throw new Error('Project already exists');
      }

      const data = await response.json();
      console.log(data);

      setSuccessMessage('Project added successfully');
      setFormData({
        projectName: '',
        projectId: '',
        category: '',
        startDate: '',
        endDate: '',
        tasks: []
      });
    } catch (error) {
      console.error('Error adding project:', error.message);
      setErrorMessage(error.message);
      setTimeout(() => {
        setErrorMessage('');
      }, 3000);
    }
  };

  return (
    <div className="container">
      <h1 >Add Project</h1>
      <form onSubmit={handleSubmit} className="form">
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}
        <div className="form-group">
          <label htmlFor="projectName">Project Name:</label>
          <input type="text" id="projectName" name="projectName" value={formData.projectName} onChange={handleInputChange} className="form-control" required />
        </div>
        <div className="form-group">
          <label htmlFor="projectId">Project ID:</label>
          <input type="text" id="projectId" name="projectId" value={formData.projectId} onChange={handleInputChange} className="form-control" required />
        </div>
        <div className="form-group">
          <label htmlFor="category">Category:</label>
          <select id="category" name="category" value={formData.category} onChange={handleInputChange} className="form-control" required>
            <option value="">Select Category</option>
            <option value="Client Project">Client Project</option>
            <option value="Sales Activity">Sales Activity</option>
            <option value="BAU Activity">BAU Activity</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="startDate">Start Date:</label>
          <input type="date" id="startDate" name="startDate" value={formData.startDate} onChange={handleInputChange} className="form-control" required />
        </div>
        <div className="form-group">
          <label htmlFor="endDate">End Date:</label>
          <input type="date" id="endDate" name="endDate" value={formData.endDate} onChange={handleInputChange} className="form-control" required />
        </div>
        <div className="form-group">
          <label htmlFor="task">Task:</label>
          <input type="text" id="task" value={newTask} onChange={handleTaskInputChange} className="form-control" />
          <button type="button" onClick={addTask} className="btn btn-primary mt-2 btnda">Add Task</button>
        </div>
        {formData.tasks.length > 0 && (
          <div className="form-group">
            <label>Added Task</label>
            <ul>
              {formData.tasks.map((task, index) => (
                <li key={index}>{task}</li>
              ))}
            </ul>
          </div>
        )}
        
        <button type="submit" className="btn btn-primary">Add Project</button>
      </form>
    </div>
  );
}

export default AddProject;
