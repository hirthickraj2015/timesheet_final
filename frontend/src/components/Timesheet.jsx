import React, { useState, useEffect } from "react";
import { useNavigate,useParams } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./Timesheet.css";

function Timesheet() {
  const [isCollapsed, setCollapsed] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [rows, setRows] = useState([{ id: 1 }]);
  const [rowCount, setRowCount] = useState(1);
  const [resourceAllocations, setResourceAllocations] = useState([]);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userID } = useParams();
  const [selectedCategories, setSelectedCategories] = useState({});
  const [selectedProjects, setSelectedProjects] = useState({});
  const [taskIds, setTaskIds] = useState({});
  const [comments, setComments] = useState({});
  const [entries, setEnteries] = useState({});
  const navigate = useNavigate();
  useEffect(() => {
    const dateChangeDiv = document.querySelector(".dateChange");

    const fetchData = async () => {
      try {
        const [startDateStr, endDateStr] =
          dateChangeDiv.textContent.split(" - ");
        const startDate = new Date(startDateStr);
        const endDate = new Date(endDateStr);

        const response = await axios.post(
          "http://localhost:4000/timesheets-data",
          {
            userId: userID,
            startDate: startDate.toISOString(), // Convert date to ISO string format
            endDate: endDate.toISOString(), // Convert date to ISO string format
          }
        );

        setEnteries(response.data);
      } catch (error) {
        setRows([{ id: 1 }]);
        setComments({});
        setTaskIds({});
        setSelectedProjects({});
        setSelectedCategories({});
        console.error("Error fetching timesheet data:", error);
      }
    };

    fetchData();
  }, [userID, currentDate]);

  useEffect(() => {
    if (entries && entries.length > 0) {
      const initialSelectedCategories = {};
      const initialSelectedProjects = {};
      const initialTaskIds = {};
      const initialComments = {};
      const initialRows = []; // Initialize initialRows array
      let id = 1;
      entries[0].rows.forEach((row) => {
        const rowIndex = id - 1; // Adjust index to match array index
        initialSelectedCategories[rowIndex] = row.category;
        initialSelectedProjects[rowIndex] = row.projectId;
        initialTaskIds[rowIndex] = row.taskId;
        initialComments[rowIndex] = row.comments;
        // Create an object for the row data
        const rowData = {
          rowId: id++,
          column_0: row.column_0 || 0,
          column_1: row.column_1 || 0,
          column_2: row.column_2 || 0,
          column_3: row.column_3 || 0,
          column_4: row.column_4 || 0,
          column_5: row.column_5 || 0,
          column_6: row.column_6 || 0,
        };

        initialRows.push(rowData);
      });

      setSelectedCategories(initialSelectedCategories);
      setSelectedProjects(initialSelectedProjects);
      setTaskIds(initialTaskIds);
      setComments(initialComments);
      setRows(initialRows); // Set the rows state
    }
  }, [entries]);

  useEffect(() => {
    const fetchResourceAllocationDetails = async () => {
      try {
        const response = await fetch(
          `http://localhost:4000/resource-allocation/${userID}`
        );
        if (response.ok) {
          const data = await response.json();
          if (data && Array.isArray(data)) {
            // Add this check to ensure data is not undefined
            const destructureData = data.map(
              ({ projectId, startDate, endDate }) => ({
                project: projectId,
                resourceStart: startDate,
                resourceEnd: endDate,
              })
            );
            const uniqueProjects = destructureData.filter(
              (project, index, self) =>
                index === self.findIndex((p) => p.project === project.project)
            );
            setResourceAllocations(uniqueProjects);
            await Promise.all(
              uniqueProjects.map(async ({ project }) => {
                try {
                  const projectResponse = await fetch(
                    `http://localhost:4000/projects/${project}`
                  );
                  const tasksResponse = await fetch(
                    `http://localhost:4000/tasks/${project}`
                  );
                  if (projectResponse.ok) {
                    const projectData = await projectResponse.json();
                    setProjects((prevProjectDetails) => ({
                      ...prevProjectDetails,
                      [project]: projectData,
                    }));
                  }
                  if (tasksResponse.ok) {
                    const tasksData = await tasksResponse.json();
                    setTasks((prevTaskDetails) => ({
                      ...prevTaskDetails,
                      [project]: tasksData,
                    }));
                  }
                } catch (error) {
                  console.error(
                    "Error fetching project or task details:",
                    error
                  );
                }
              })
            );
            setLoading(false); // Set loading to false after fetching all projects
          } else {
            console.error("Data is undefined or not an array");
          }
        } else {
          console.error("Failed to fetch resource allocation details");
        }
      } catch (error) {
        console.error("Error fetching resource allocation details:", error);
      }
    };

    fetchResourceAllocationDetails();
  }, [userID]);
  useEffect(() => {
    // Update the current date only once during initial render
    const initialDate = new Date();
    setCurrentDate(initialDate);
  }, []);

  const addRow = () => {
    const newRowId = rowCount + 1;
    setRows([...rows, { id: newRowId }]);
    setRowCount(newRowId);
  };

  const deleteRow = (id) => {
    if (rows.length === 1) {
      // Ensure at least one row is present
      return;
    }
    setRows(rows.filter((row) => row.id !== id));
  };

  const handleToggleCollapse = () => {
    setCollapsed(!isCollapsed);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    const newValue = parseInt(value.replace(/\D/g, ""), 10) || 0; // Parse value as integer, default to 0 if empty or NaN

    // Update the state of the input value
    // Assuming the input fields are indexed starting from 0 for the weekdays, and 5 for the Total column
    const rowIndex = parseInt(name.split("_")[0], 10);
    const columnIndex = parseInt(name.split("_")[1], 10);
    const updatedRows = [...rows];
    updatedRows[rowIndex][`column_${columnIndex}`] = newValue;
    setRows(updatedRows);
  };

  const formattedDate = (date) => {
    const currentDate = new Date(date);
    const currentDay = currentDate.getDay();
    const diff =
      currentDate.getDate() -
      currentDay +
      (currentDay === 1 ? 0 : currentDay === 0 ? -6 : 1);

    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(diff);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    const options = { day: "2-digit", month: "short", year: "numeric" };
    return `${startOfWeek.toLocaleDateString(
      "en-US",
      options
    )} - ${endOfWeek.toLocaleDateString("en-US", options)}`;
  };

  const calculateTotals = () => {
    const totals = Array.from({ length: 8 }, () => 0); // Initialize totals array with zeros for each day plus one for the Total column

    // Calculate totals horizontally (across days)
    rows.forEach((row) => {
      row.total = 0;
      for (let i = 0; i < 7; i++) {
        if (row[`column_${i}`]) {
          totals[i] += row[`column_${i}`];
          row.total += row[`column_${i}`]; // Update row total
          totals[7] += row[`column_${i}`]; // Update Total column
        }
      }
    });

    // Check for conditions and apply styling
    const totalHoursExceeds = totals[7] > 40;

    return { totals, totalHoursExceeds };
  };

  const { totals, totalHoursExceeds } = calculateTotals();
  const generateTableHeader = () => {
    const days = [ "Sun","Mon","Tue", "Wed", "Thu", "Fri", "Sat"];
    const tableHeader = days.map((day, index) => {
      const dayDate = new Date(currentDate);
      const currentDay = dayDate.getDay();
      const diff =
        dayDate.getDate() -
        currentDay +
        (currentDay === 1 ? 0 : currentDay === 0 ? -6 : 1); // Adjust if the current day is Monday or Sunday
      dayDate.setDate(diff + index);
      return (
        <th key={index}>
          <div>{day}</div>
          <div>{dayDate.getDate()}</div>
        </th>
      );
    });
    return tableHeader;
  };

  const handleNextWeek = () => {
    const nextWeek = new Date(currentDate);
    nextWeek.setDate(nextWeek.getDate() + 7); // Move to the next week
    setCurrentDate(nextWeek);
  };

  const handlePreviousWeek = () => {
    const previousWeek = new Date(currentDate);
    previousWeek.setDate(previousWeek.getDate() - 7); // Move to the previous week
    setCurrentDate(previousWeek);
  };
  const handleCategoryChange = (event, rowIndex) => {
    const category = event.target.value;
    setSelectedCategories((prev) => ({ ...prev, [rowIndex]: category }));
  };

  const handleProjectChange = (event, rowIndex) => {
    const projectId = event.target.value; // Assuming the value is the project ID
    setSelectedProjects((prev) => ({ ...prev, [rowIndex]: projectId }));
  };
  const handleTaskChange = (event, rowIndex) => {
    const taskId = event.target.value;
    setTaskIds((prev) => ({ ...prev, [rowIndex]: taskId }));
  };

  const handleCommentsChange = (event, rowIndex) => {
    const comment = event.target.value;
    setComments((prev) => ({ ...prev, [rowIndex]: comment }));
  };
  const prepareTimesheetData = async (status) => {
    // Get the formatted start and end date from the current displayed date
    const dateChangeDiv = document.querySelector(".dateChange");
    const [startDateStr, endDateStr] = dateChangeDiv.textContent.split(" - ");
    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);

    // Create timesheet data object
    const rowsData = rows.map((row, index) => ({
      category: selectedCategories[index] || "",
      projectId: selectedProjects[index] || "",
      taskId: taskIds[index] || "", // Include taskId from state
      comments: comments[index] || "", // Include comments from state
      column_0: row.column_0 || 0,
      column_1: row.column_1 || 0,
      column_2: row.column_2 || 0,
      column_3: row.column_3 || 0,
      column_4: row.column_4 || 0,
      column_5: row.column_5 || 0,
      column_6: row.column_6 || 0,
    }));

    const timesheetData = {
      userId: userID,
      startDate,
      endDate,
      rows: rowsData,
      status: status, // Set status based on the parameter value
    };

    console.log("dataSent", timesheetData);

    try {
      // Make an HTTP request to send the timesheet data to the backend
      const response = await axios.post('http://localhost:4000/submit-timesheet', timesheetData); // Specify the correct port
      console.log('Response from backend:', response.data);
      
      if (status === 'save') {
        toast.success('Timesheet saved successfully!');
      } else if (status === 'submit') {
        toast.success('Timesheet submitted successfully!');
      }
      // Optionally, handle success or error response from the backend
    } catch (error) {
      console.error('Error sending timesheet data:', error);
      if (error.response && error.response.status === 400 && error.response.data.status === 'AlreadySubmitted') {
        toast.error('Timesheet submission failed because it is already submitted.');
      } else {
        toast.error('An error occurred while saving or submitting timesheet.');
      }
      // Optionally, handle the error
    }
    
  };
  const handleSaveButtonClick = () => {
    prepareTimesheetData("save");
  };

  // Button click handler for Submit button
  const handleSubmitButtonClick = () => {
    prepareTimesheetData("submit");
  };
  return (
    <div>
      <ToastContainer />
      <div>
        <div>
          <strong>
            <h2
              style={{
                marginTop: "20px",
                fontWeight: "bold",
                color: "#19105B",
              }}
            >
              Timesheet
            </h2>
          </strong>
        </div>
        <div
          className="dateChange"
          style={{ fontSize: "14px", textAlign: "right", paddingRight: "20px" }}
        >
          <i
            className="fa-solid fa-chevron-left"
            onClick={handlePreviousWeek}
          ></i>
          {formattedDate(currentDate)}
          <i className="fa-solid fa-chevron-right" onClick={handleNextWeek}></i>
        </div>
        <div className="allow row" onClick={handleToggleCollapse}>
          Allocation Extension
          <i
            className="bx bx-chevron-down"
            style={{ color: "white" }}
            onClick={handleToggleCollapse}
          ></i>
        </div>

        <div className={isCollapsed ? "collapse" : ""}>
          <div>
            <table className="tbl">
              <thead>
                <tr className="tblhd tbl">
                  <td>Project Name</td>
                  <td>Project Type</td>
                  <td>Project End Date</td>
                  <td>Allocation End Date</td>
                  <td>Project Allocation Extension</td>
                </tr>
              </thead>
              <tbody>
                {resourceAllocations.map((allocation, index) => {
                  // Assuming each allocation has a projectId that matches the keys in the projects state
                  const project = projects[allocation.project];
                  return (
                    <tr key={index} className="tblno">
                      <td>{project ? project.projectName : "N/A"}</td>
                      <td>{project ? project.category : "N/A"}</td>
                      <td>{project ? project.endDate : "N/A"}</td>
                      <td>{allocation.resourceEnd}</td>
                      <td>-</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div>
        <div className="allow tm">Timesheet</div>
        <div>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <table className="tbl">
              <thead>
                <tr>
                  <th style={{ width: "120px" }}>Project Type</th>
                  <th style={{ width: "90px" }}>Project Name</th>
                  <th style={{ width: "90px" }}>Task</th>
                  <th style={{ width: "150px" }}>Comment</th>
                  {generateTableHeader()}
                  <th>
                    <div>Total</div>
                  </th>
                  <th style={{ width: "75px" }}></th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, index) => (
                  <tr className="tda" key={row.id}>
                    <td style={{ width: "120px" }}>
                      <select
                        onChange={(e) => handleCategoryChange(e, index)}
                        value={selectedCategories[index] || ""}
                      >
                        <option value="">Select Project Type</option>
                        {/* Create a set of unique categories */}
                        {[
                          ...new Set(
                            Object.values(projects).map(
                              (project) => project.category
                            )
                          ),
                        ].map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td style={{ width: "90px" }}>
                      {selectedCategories[index] && (
                        <select
                          onChange={(e) => handleProjectChange(e, index)}
                          value={selectedProjects[index] || ""}
                        >
                          <option value="">Select Project</option>
                          {/* Filter projects based on selected category */}
                          {Object.values(projects)
                            .filter(
                              (project) =>
                                project.category === selectedCategories[index]
                            )
                            .map((project) => (
                              <option
                                key={project._id}
                                value={project.projectId}
                              >
                                {project.projectName}
                              </option>
                            ))}
                        </select>
                      )}
                    </td>
                    <td style={{ width: "90px" }}>
                      {selectedProjects[index] && (
                        <select
                          onChange={(e) => handleTaskChange(e, index)}
                          value={taskIds[index] || ""}
                        >
                          <option value="">Select Task</option>
                          {tasks[selectedProjects[index]] &&
                            tasks[selectedProjects[index]].map((task) => (
                              <option key={task._id} value={task.task}>
                                {task.task}
                              </option>
                            ))}
                        </select>
                      )}
                    </td>
                    <td style={{ width: "150px" }}>
                      <input
                        type="text"
                        onChange={(e) => handleCommentsChange(e, index)}
                        value={comments[index] || ""}
                      />
                    </td>
                    {[...Array(7)].map((_, columnIndex) => (
                      <td key={columnIndex}>
                        <div>
                          <input
                            type="number"
                            name={`${index}_${columnIndex}`}
                            onChange={handleInputChange}
                            value={row[`column_${columnIndex}`] || ""}
                          />
                        </div>
                      </td>
                    ))}
                    {/* Total column */}
                    <td>
                      <input
                        type="text"
                        style={{
                          border: "none",
                          color: totalHoursExceeds ? "red" : "black",
                        }}
                        value={row.total}
                        readOnly
                      />
                    </td>

                    <td style={{ width: "75px" }}>
                      {index === 0 ? (
                        <i className="bx bx-plus" onClick={addRow}></i>
                      ) : (
                        <i
                          className="bx bx-minus"
                          onClick={() => deleteRow(row.id)}
                        ></i>
                      )}
                    </td>
                  </tr>
                ))}
                <tr className="tda">
                  <td>Total Hours</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  {[...Array(8)].map((_, index) => (
                    <td key={index}>
                      <input
                        type="text"
                        style={{
                          border: "none",
                          color:
                            index === totals.length - 1
                              ? parseInt(totals[index], 10) > 40
                                ? "red"
                                : "black"
                              : parseInt(totals[index], 10) > 8
                              ? "red"
                              : "black",
                        }}
                        value={totals[index]}
                        readOnly
                      />
                    </td>
                  ))}

                  <td style={{ width: "75px" }}></td>
                </tr>
              </tbody>
            </table>
          )}
        </div>
        <div className="btd">
          <button
            type="button"
            className="btn btns"
            onClick={handleSaveButtonClick} // Call handleSaveButtonClick function
          >
            Save
          </button>
          <button
            type="button"
            className="btn btns1"
            onClick={handleSubmitButtonClick} // Call handleSubmitButtonClick function
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}

export default Timesheet;
