import axios from 'axios';
import { toast } from 'react-toastify';

export const BASE_URL = 'http://127.0.0.1:8000';


const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};



export const addOrder = async (orderData, token) => {
  try {
    console.log('Order Data in API:', orderData);
    setAuthToken(token);
    const response = await axios.post(`${BASE_URL}/orders`, orderData);
    toast.success('Order Sent Successfully');
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.detail || 'Error Adding Order');
  }
}
