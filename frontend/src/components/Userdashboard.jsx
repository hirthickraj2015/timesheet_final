import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './Userdashboard.css';
import timesheeticon from '../assets/timesheeticon.gif';
import feedback from '../assets/feedback.gif';
import feedbackhistory from '../assets/feedbackhistory.gif';
import projectstatus from '../assets/projectstatus.gif';
import logout from "../assets/logout.gif"
import Timesheet from './Timesheet';
import Feedback from './Feedback';
import Feedbackhistory from './Feedbackhistory';
import Projectstatus from './Projectstatus';

function Userdashboard() {
 const [isNavOpen, setIsNavOpen] = useState(true);
 const { userID } = useParams();
 const [selectedComponent, setSelectedComponent] = useState(null);
 const navigate = useNavigate(); // Use the useNavigate hook

 useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 600 && isNavOpen) {
        setIsNavOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
 }, [isNavOpen]);

 const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
 };

 const handleNavigate = (component) => {
    setSelectedComponent(component);
 };

 const handleLogout = () => {
    // Clear user data here if necessary
    // For example, you might clear a token from local storage or cookies

    // Navigate to the home page ("/")
    navigate('/');
 };

 return (
    <div>
      <button className='sidebar-toggle dagg' onClick={toggleNav}>
        <span className="material-symbols-outlined">{isNavOpen ? "toggle_on" : "toggle_off"}</span>
      </button>
      <nav className={`nav ${isNavOpen ? "nav-open" : "nav-close"}`}>
        <div className='logo'>Timesheet</div>
        <ul>
          <li>
            <a className='timesheet links' href="#" onClick={() => handleNavigate(<Timesheet userID={userID} />)}>
              <img src={timesheeticon} alt="Timesheet Icon" className='nav-icons'></img>Timesheet
            </a>
          </li>
          <li>
            <a className='feedback links' href="#" onClick={() => handleNavigate(<Feedback userID={userID} />)}>
              <img src={feedback} alt="Feedback Icon" className='nav-icons'></img>Feedback
            </a>
          </li>
          <li>
            <a className='feedback-history links' href="#" onClick={() => handleNavigate(<Feedbackhistory userID={userID} />)}>
              <img src={feedbackhistory} alt="Feedback History Icon" className='nav-icons'></img>Feedback History
            </a>
          </li>
          <li>
            <a className='project-status links' href="#" onClick={() => handleNavigate(<Projectstatus userID={userID} />)}>
              <img src={projectstatus} alt="Project Status Icon" className='nav-icons'></img>Project Status
            </a>
          </li>
          <li>
            <a className='logout links' href="#" onClick={handleLogout}>
            <img src={logout} alt="Logout Icon" className='nav-icons'></img>Logout
            </a>
          </li>
        </ul>
      </nav>
      <div className='content' style={{ width: isNavOpen ? 'calc(100% - 250px)' : '100%', left: isNavOpen ? '250px' : '0' }}>
        {selectedComponent}
      </div>
    </div>
 );
}

export default Userdashboard;
