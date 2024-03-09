import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { passResetAsync } from './loginSlice';

const PasswordResetForm = () => {
    const [email, setEmail] = useState('');
    const dispatch = useDispatch();
    const loading = useSelector((state) => state.login.loading);
    const message = useSelector((state) => state.login.message);

    const handlePassReset = () => {
        dispatch(passResetAsync(email));
    };

    return (
        <div>
            <form>
                <label htmlFor="email">Email:</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <button type="button" onClick={handlePassReset} disabled={loading}>Reset Password</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default PasswordResetForm;
