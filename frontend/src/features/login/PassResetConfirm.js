import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom'; // Assuming you're using React Router for navigation
import { passResetConfirmAsync } from './loginSlice'; // adjust this import based on your Redux setup

const PassResetConfirm = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate(); // Get the navigate function from React Router
    const { uid, token } = useParams();

    const handlePasswordReset = async () => {
        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);
        try {
            // Dispatch the passResetConfirmAsync action with uid, token, and new password
            await dispatch(passResetConfirmAsync({ uid, token, new_password: newPassword }));
            // Navigate to login page after successful password reset
            navigate('/login');
        } catch (error) {
            setError('An error occurred. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2>Reset Password</h2>
            <input type="password" placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
            <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
            {error && <p>{error}</p>}
            <button onClick={handlePasswordReset} disabled={loading}>Reset Password</button>
        </div>
    );
};

export default PassResetConfirm;
