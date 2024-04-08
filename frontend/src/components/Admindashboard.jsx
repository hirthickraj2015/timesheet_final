import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import projectstatus from '../assets/projectstatus.gif';
import logout from "../assets/logout.gif"
import adduser from '../assets/adduser.gif';
import Adduser from './Adduser';
import AddProject from './Addproject';
import Resourceallocation from './Resourceallocation';
import Admindata from './Admindata';
import resourceallocation from '../assets/resourceallocation.gif';
import dashboard from '../assets/dashboard.gif'
import addproject from '../assets/addproject.gif'
import './Admindashboard.css'

function Admindashboard() {
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
     navigate('/');
  };
 
  return (
     <div>
       <button className='sidebar-toggle dagg' onClick={toggleNav}>
         <span className="material-symbols-outlined">{isNavOpen ? "toggle_on" : "toggle_off"}</span>
       </button>
       <nav className={`nav ${isNavOpen ? "nav-open" : "nav-close"}`}>
         <div className='logo'>Admin Login</div>
         <ul>
           <li>
             <a className='timesheet links' href="#" onClick={() => handleNavigate( <Admindata userID={userID} />)}>
               <img src={dashboard} alt="Timesheet Icon" className='nav-icons'></img>Dashboard
             </a>
           </li>
           <li>
             <a className='feedback links' href="#" onClick={() => handleNavigate( <Adduser userID={userID} />)}>
               <img src={adduser} alt="Feedback Icon" className='nav-icons'></img>Add User
             </a>
           </li>
           <li>
             <a className='feedback-history links' href="#" onClick={() => handleNavigate(<Resourceallocation userID={userID} />)}>
               <img src={resourceallocation} alt="Feedback History Icon" className='nav-icons'></img>Allocate Resource
             </a>
           </li>
           <li>
             <a className='project-status links' href="#" onClick={() => handleNavigate(<AddProject userID={userID} />)}>
               <img src={addproject} alt="Project Status Icon" className='nav-icons'></img>Add Project
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

export default Admindashboard;
