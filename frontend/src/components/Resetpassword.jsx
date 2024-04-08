import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import  './Resetpassword.css'
function ResetPassword() {
    const { userID } = useParams();
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleResetPassword = async () => {
        try {
            const response = await fetch('http://localhost:4000/resetPassword', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ userID, otp, newPassword }) // Include userID in the request body
            });

            if (!response.ok) {
                throw new Error('Failed to reset password');
            }

            // Set success message
            setSuccessMessage('Password reset successfully!');

            // Redirect to home route after a brief delay
            setTimeout(() => {
                navigate('/');
            }, 2000); // 2000 milliseconds delay

        } catch (error) {
            console.error('Error resetting password:', error.message);
            setErrorMessage(error.message);
        }
    };

    return (
        <div className="container mt-5">
            <div className="card reset-password-container mx-auto">
                <div className="card-body">
                    <h2 className="card-title mb-4">Reset Password</h2>
                    {successMessage && <p className="alert alert-success">{successMessage}</p>}
                    {errorMessage && <p className="alert alert-danger">{errorMessage}</p>}
                    <div className="form-group">
                        <label htmlFor="otp" className="form-label">OTP:</label>
                        <input type="text" id="otp" value={otp} onChange={(e) => setOtp(e.target.value)} className="form-control" required />
                    </div>

                    <div className="form-group">
                        <label htmlFor="newPassword" className="form-label">New Password:</label>
                        <input type="password" id="newPassword" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="form-control" required />
                    </div>

                    <button onClick={handleResetPassword} className="form-button">Reset Password</button>
                </div>
            </div>
        </div>
    );
}

export default ResetPassword;
