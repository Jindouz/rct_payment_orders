import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectError, selectIsLoading, selectIsLoggedIn, loginAsync } from './loginSlice';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const isLoading = useSelector(selectIsLoading);
  const [includeRefreshToken, setIncludeRefreshToken] = useState(false);
  const error = useSelector(selectError);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async () => {
    dispatch(loginAsync({ credentials: { username, password }, includeRefreshToken }));
  };

  // Redirect to home page if user is successfully logged in
  useEffect(() => {
    if (isLoggedIn) {
      navigate('/');
    }
  }, [isLoggedIn, navigate]);

  return (
    <div className='container'>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1vh' }}>
        <div className="col-sm-4  offset-sm-4">
          <h1 className="text-center" style={{ marginTop: "20px" }}>Login</h1>

          <form id="loginForm">
            <div className="mb-3">
              <label htmlFor="username" className="form-label custom-text">Username</label>
              <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} className="form-control" required />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password</label>
              <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="form-control" required />
            </div>
            <div className="mb-3 form-check">
              <label className="mb-3" htmlFor="includeRefreshToken">
                <input type="checkbox" className="form-check-input" id="includeRefreshToken" checked={includeRefreshToken} onChange={() => setIncludeRefreshToken(!includeRefreshToken)} /> Remember Me
              </label>
            </div>
            <br />
            <br />
            <button type="button" className="btn btn-primary" onClick={handleLogin} disabled={isLoading}>{isLoading ? 'Logging in...' : 'Login'}</button>
          </form>

          <br />
          {!isLoggedIn && <p className="mt-3 text-center">Don't have an account? <Link className="btn btn-primary btn-sm" to={'/register'}>Register here</Link></p>}
          {!isLoggedIn && <p className="mt-3 text-center">Can't remember your password? <Link className="btn btn-primary btn-sm" to={'/reset'}>Reset here</Link></p>}
          <br />
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {isLoggedIn && <p style={{ color: 'green' }}>Login successful!</p>}
        </div>
      </div>
    </div>

  );
};

export default Login;
