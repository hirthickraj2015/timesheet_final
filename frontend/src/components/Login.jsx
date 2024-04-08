import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import timesheet0 from '../assets/timesheet0.gif';
import timesheet1 from '../assets/timesheet1.gif';
import timesheet2 from '../assets/timesheet2.gif';
import timesheet3 from '../assets/timesheet3.gif';
import timesheet4 from '../assets/timesheet4.gif';
import timesheet5 from '../assets/timesheet5.gif';
import timesheet6 from '../assets/timesheet6.gif';
import timesheet7 from '../assets/timesheet7.gif';

function Login() {
  const [userid, setUserid] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [randomTimesheet, setRandomTimesheet] = useState(null); // Initialize with null
  const navigate = useNavigate();

  // Array containing all timesheet images
  const timesheetImages = [timesheet0, timesheet1, timesheet2, timesheet3, timesheet4, timesheet5, timesheet6, timesheet7];

  // Function to select a random timesheet image
  const getRandomTimesheet = () => {
    const randomIndex = Math.floor(Math.random() * timesheetImages.length);
    return timesheetImages[randomIndex];
  };

  useEffect(() => {
    // Generate random timesheet image only once when the component mounts
    setRandomTimesheet(getRandomTimesheet());
  }, []); // Empty dependency array means this effect runs only once, equivalent to componentDidMount

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      if (password === '0000') {
        // Prompt user to change password
        setErrorMessage('Please change your default password');
        return;
      }
  
      const response = await fetch('http://localhost:4000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userID: userid, password })
      });
  
      if (!response.ok) {
        throw new Error('Invalid username or password');
      }
  
      const data = await response.json();
      if (data.role === 'admin') {
        navigate(`/admin/${userid}`); // Redirect to admin route with userID
      } else {
        navigate(`/user/${userid}`); // Redirect to user route with userID
      } 
    } catch (error) {
      console.error('Error logging in:', error.message);
      setErrorMessage(error.message);
    }
  };
  

  const handleForgotPassword = async () => {
    try {
      const response = await fetch('http://localhost:4000/forgotPassword', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userID: userid })
      });

      if (!response.ok) {
        throw new Error('Failed to send OTP for password reset');
      }

      navigate(`/resetPassword/${userid}`);
    } catch (error) {
      console.error('Error sending OTP for password reset:', error.message);
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="total">
      <div className='total-card'>
        <div className="login-card">
          <div className="login-container ">
            <h2 className="mb-4">Login</h2>
            {errorMessage && <p className="text-danger">{errorMessage}</p>}
            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label htmlFor="userid">User ID:</label>
                <input type="text" id="userid" value={userid} onChange={(e) => setUserid(e.target.value)} className="form-control" required />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password:</label>
                <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} className="form-control" required />
              </div>
              <button type="submit" className="btn btn-primary">Login</button>
              <button type="button" onClick={handleForgotPassword} disabled={!userid.trim()} className="btn btn-secondary">Forgot Password</button>
            </form>
          </div>
        </div>
        <div className="image-container">
          {randomTimesheet && <img src={randomTimesheet} alt="Timesheet" className="login-image img-fluid" />}
        </div>
        </div>
    </div>
  );
}

export default Login;
