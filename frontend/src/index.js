import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './app/store';
import App from './App';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './features/login/Login';
import Prods from './features/prods/Prods';
import Checkout from './features/cart/Checkout';
import Register from './features/login/Register';
import Toastify from './components/Toastify';
import AdminProds from './features/prods/AdminProds';
import PasswordResetForm from './features/login/PasswordResetForm';
import PassResetConfirm from './features/login/PassResetConfirm';
import Paypal from './features/prods/Paypal';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <Toastify />
    <Provider store={store}>
    <BrowserRouter>
            <Routes>
                <Route path="/" element={<App />} >
                    <Route index element={<Prods />} />
                    <Route path='/login' element={<Login />} />
                    <Route path='/register' element={<Register />} />
                    <Route path='/reset' element={<PasswordResetForm />} />
                    <Route path='/resetconfirm/:uid/:token' element={<PassResetConfirm />} />
                    <Route path='/checkout' element={<Checkout />} />
                    <Route path='/adminprods' element={<AdminProds />} />
                    <Route path='/paypal' element={<Paypal />} />
                </Route>
                <Route path="*" element={<h1 style={{ textAlign: 'center' }}>Error: Page not found</h1>}></Route>
            </Routes>
        </BrowserRouter>

    </Provider>
  </React.StrictMode>
);
