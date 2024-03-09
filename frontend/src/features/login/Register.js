import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectIsLoading, selectIsRegistered, registerAsync, selectRegError } from './loginSlice';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('')
  const isRegistered = useSelector(selectIsRegistered);
  const isLoading = useSelector(selectIsLoading);
  const error = useSelector(selectRegError);
  const dispatch = useDispatch();

  const handleRegister = async () => {
    if (password === confirmPassword) {
      dispatch(registerAsync({ username, password, email }));
    } else {
      toast.error('Passwords do not match!');
    }
  };

  return (
    <div className='container'>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1vh' }}>
        <div className="col-sm-4  offset-sm-4">
          <h1 className="text-center" style={{ marginTop: "20px" }}>Register</h1>

          <form id="registerForm">
            <div className="mb-3">
              <label htmlFor="username" className="form-label">Username:</label>
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="form-control" required />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email:</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="form-control" required />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password:</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="form-control" required />
            </div>
            <div className="mb-3">
              <label htmlFor="confirmPassword" className="form-label">Confirm Password:</label>
              <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="form-control" required />
            </div>
            <br />
            <button type="button" className="btn btn-primary" onClick={handleRegister} disabled={isLoading}>{isLoading ? 'Registering...' : 'Register'}</button>
          </form>
          
          <br />
          {!isRegistered && <p className="mt-3 text-center">Already have an account? <Link className="btn btn-primary btn-sm" to={'/login'}>Login here</Link></p>}
          <br />
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {isRegistered && <p style={{ color: 'green' }}>Registration successful!</p>}
        </div>
      </div>
    </div>
  );
};

export default Register;
