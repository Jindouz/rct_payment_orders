import axios from 'axios';

export const BASE_URL = 'http://127.0.0.1:8000';


export const login = async (credentials) => {
  try {
    const response = await axios.post(`${BASE_URL}/login`, credentials);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.detail || 'Login failed');
  }
};

export const register = async (credentials) => {
  try {
    const response = await axios.post(`${BASE_URL}/register`, credentials);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.detail || 'Registration failed');
  }
}

export const refreshToken = async () => {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    const response = await axios.post(`${BASE_URL}/refresh-token`, { refreshToken });
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.detail || 'Error refreshing token');
  }
};


export const passReset = async (email) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/password-reset/`, { email });
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.detail || 'Error resetting password');
  }
}

export const passResetConfirm = async (uid, token, new_password) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/password-reset/confirm/${uid}/${token}/`, { uid, token, new_password });
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.detail || 'Error resetting password');
  }
}