import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import moment from "moment"; // Import moment for date manipulation
import "./Projectstatus.css"; // Import CSS file for styling

function ProjectStatus() {
  const { userID } = useParams();
  const [allocations, setAllocations] = useState([]);
  const [projectDetails, setProjectDetails] = useState([]);

  useEffect(() => {
    // Fetch resource allocations by user ID
    axios
      .get(`http://localhost:4000/resource-allocation/${userID}`)
      .then((response) => {
        setAllocations(response.data);
      })
      .catch((error) => {
        console.error("Error fetching resource allocations:", error);
      });
  }, [userID]);

  useEffect(() => {
    if (allocations.length > 0) {
      Promise.all(
        allocations.map((allocation) =>
          axios.get(`http://localhost:4000/projects/${allocation.projectId}`)
        )
      )
        .then((projectResponses) => {
          const projects = projectResponses.map((response) => response.data);
          setProjectDetails(projects);
        })
        .catch((error) => {
          console.error("Error fetching project details:", error);
        });
    }
  }, [allocations]);

  // Function to calculate project status based on start and end dates
  const calculateStatus = (startDate, endDate) => {
    const currentDate = moment();
    const projectStartDate = moment(startDate);
    const projectEndDate = moment(endDate);
    if (currentDate.isBefore(projectStartDate)) {
      return "Future";
    } else if (currentDate.isBetween(projectStartDate, projectEndDate)) {
      return "In Progress";
    } else {
      return "Completed";
    }
  };

  return (
    <div>
      <center><h1 className="title-status">Project Status</h1></center>
      <div className="project-cards">
        {projectDetails.map((project, index) => (
          <div key={project.projectId} className="project-card">
            <div className="row">
              <div className="col-sm-6">
                <h5 className="card-heading">Project Name:</h5>
                <p className="card-value">{project.projectName}</p>
              </div>
              <div className="col-sm-6">
                <h5 className="card-heading">Project ID:</h5>
                <p className="card-value">{project.projectId}</p>
              </div>
            </div>
            <div className="row">
              <div className="col-sm-6">
                <h5 className="card-heading">Category:</h5>
                <p className="card-value">{project.category}</p>
              </div>
              <div className="col-sm-6">
                <h5 className="card-heading">Total Days:</h5>
                <p className="card-value">
                  {moment(project.endDate).diff(
                    moment(project.startDate),
                    "days"
                  )}
                </p>
              </div>
            </div>
            <div className="row">
              <div className="col-sm-6">
                <h5 className="card-heading">Status:</h5>
                <p className="card-value">
                  {calculateStatus(project.startDate, project.endDate)}
                </p>
              </div>
              {allocations[index] && (
                <div className="col-sm-6">
                  <h5 className="card-heading">Allocation Total Days:</h5>
                  <p className="card-value">
                    {moment(allocations[index].endDate).diff(
                      moment(allocations[index].startDate),
                      "days"
                    )}
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProjectStatus;
