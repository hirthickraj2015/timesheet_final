import React, { useState, useEffect } from 'react';
import "./Admindata.css"
function Admindata() {
 const [projects, setProjects] = useState([]);
 const [users, setUsers] = useState([]);
 const [isLoading, setIsLoading] = useState(true);
 const [isDataLoaded, setIsDataLoaded] = useState(false);
 const [isModalOpen, setIsModalOpen] = useState(false);
 const [modalContent, setModalContent] = useState([]);

 useEffect(() => {
    const fetchData = async () => {
      try {
        const projectResponse = await fetch('http://localhost:4000/projects');
        const userResponse = await fetch('http://localhost:4000/users');

        if (!projectResponse.ok || !userResponse.ok) {
          throw new Error('Failed to fetch data');
        }

        const projectsData = await projectResponse.json();
        const usersData = await userResponse.json();

        setProjects(projectsData);
        setUsers(usersData);
        setIsDataLoaded(true);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
 }, []);
 function Modal({ isOpen, onClose, content }) {
    if (!isOpen) return null;
   
    // Dynamically add the 'show' class based on the isOpen prop
    const modalClass = isOpen ? 'modal show' : 'modal';
   
    return (
       <div className={modalClass}>
         <div className="modal-content">
           <button onClick={onClose}>Close</button>
           <ul>
             {content.map((item, index) => (
               <li key={index}>{item}</li>
             ))}
           </ul>
         </div>
       </div>
    );
   }
   
 return (
    <div>
      {isLoading ? (
        <p>Loading...</p>
      ) : isDataLoaded ? (
        <div>
           <center><h1>Dashboard</h1></center> 
          <div className="card" onClick={() => {
            setIsModalOpen(true);
            setModalContent(projects.map(project => project.projectName));
          }}>
            <h2>Total Projects</h2>
            <p>{projects.length}</p>
          </div>
          <div className="card" onClick={() => {
            setIsModalOpen(true);
            setModalContent(users.map(user => user.firstName));
          }}>
            <h2>Total Users</h2>
            <p>{users.length}</p>
          </div>
          <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            content={modalContent}
          />
        </div>
      ) : (
        <p>Failed to fetch data</p>
      )}
    </div>
 );
}

function Modal({ isOpen, onClose, content }) {
 if (!isOpen) return null;

 return (
    <div className="modal">
      <div className="modal-content">
        <button onClick={onClose}>Close</button>
        <ul>
          {content.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
 );
}

export default Admindata;
