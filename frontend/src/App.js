import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Adduser from './components/Adduser';
import Admindashboard from './components/Admindashboard';
import Userdashboard from './components/Userdashboard';
import ResetPassword from './components/Resetpassword';
import Resourceallocation from './components/Resourceallocation';
import Addproject from './components/Addproject';
import Feedback from './components/Feedback';
import Feedbackhistory from './components/Feedbackhistory';
import Timesheet from './components/Timesheet';
import Projectstatus from './components/Projectstatus';
import Admindata from './components/Admindata';
import 'bootstrap/dist/js/bootstrap.bundle.min';
function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Login />} />
        <Route path="/admin/:userID" element={<Admindashboard />} />
        <Route path="/addUser/:userID" element={<Adduser />} />
        <Route path="/user/:userID" element={<Userdashboard />}/>
        <Route path="/resetPassword/:userID" element={<ResetPassword />}/>
        <Route path="/resourceAllocation/:userID" element={<Resourceallocation />}/>
        <Route path="/addProject/:userID" element={<Addproject />}/>
        <Route path='/timesheet/:userID' element={<Timesheet />}/>
        <Route path='/feedback/:userID' element={<Feedback />}/>
        <Route path='/feedbackHistory/:userID' element={<Feedbackhistory />}/>
        <Route path='/projectStatus/:userID' element={<Projectstatus />}/>
        <Route path='/adminDashboard/:userID' element={<Admindata/>} />
      </Routes>
    </Router>
  );
}

export default App;
