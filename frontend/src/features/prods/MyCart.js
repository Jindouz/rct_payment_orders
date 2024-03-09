import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import {
    selectShoppingData,
    clearItems,
    updateItemAmount,
    removeItem,
    toggleCartVisibility,
} from '../cart/cartSlice';
import './MyCart.css';
import { toast } from 'react-toastify';
import { BASE_URL } from './prodsAPI';

function MyCart() {
    const shoppingData = useSelector(selectShoppingData);
    const dispatch = useDispatch();
    const navigate = useNavigate();


    const Remove = (id) => {
        dispatch(removeItem(id));
    };

    const clearCart = () => {
        dispatch(clearItems());
        console.log('Cart cleared');
        toast.success('Cart cleared successfully!');
    };

    const updateQuantity = (id, amount) => {
        if (amount <= 0) {
            dispatch(removeItem(id));
        }
        dispatch(updateItemAmount({ id, amount }));
    };

    const handleCheckout = () => {
        dispatch(toggleCartVisibility());
        navigate('/checkout'); // Navigate to /checkout
    };

    const totalAmount = shoppingData.reduce((acc, curr) => acc + curr.price * curr.amount, 0);
    const totalQuantity = shoppingData.reduce((acc, curr) => acc + curr.amount, 0);
    
    return (
        <div
            className="container cart-container"
            style={{
                position: 'absolute',
                top: 60,
                right: 5,
                width: 500,
                padding: '5px 20px 15px 20px',
            }}
        >
            <div className="row g-5 " style={{ backgroundColor: '#ccc', padding: '5px 5px 50px 5px' }}>
                <div>
                    <h4 className="d-flex justify-content-between align-items-center mb-3">
                        <span className="text-primary">
                            Your cart <i className="fa fa-shopping-cart"></i>
                        </span>
                        <> </>
                        {/* <span className="badge bg-primary rounded-pill">{shoppingData.length}</span> */}
                        <span className="badge bg-primary rounded-pill">{totalQuantity}</span>
                    </h4>
                    <ul className="list-group mb-3">
                        {shoppingData.length === 0 && <p style={{ textAlign: 'center' }}>Cart is empty</p>}
                        {shoppingData.map((item) => (
                            <li className="list-group-item d-flex justify-content-between lh-sm" key={item.id}>
                                <img
                                    src={`${BASE_URL}${item.img}`}
                                    alt={item.name}
                                    style={{ width: '50px', height: '50px', marginLeft: '10px' }}
                                />
                                <div>
                                    <h6 className="my-0">{item.name}</h6>
                                    <small className="text-body-secondary">Quantity: {item.amount}</small>
                                    <small className="text-body-secondary"> (${item.price} each)</small>
                                </div>
                                <span className="text-body-secondary">${(item.price * item.amount).toFixed(2)}</span>
                                <button
                                    onClick={() => updateQuantity(item.id, item.amount - 1)}
                                    className="btn btn-outline-danger rounded-pill px-2"
                                >
                                    -
                                </button>
                                <button
                                    onClick={() => updateQuantity(item.id, item.amount + 1)}
                                    className="btn btn-outline-success rounded-pill px-2"
                                >
                                    +
                                </button>
                                <button onClick={() => Remove(item.id)} className="btn btn-outline-danger rounded-pill px-2">
                                    Remove
                                </button>
                            </li>
                        ))}
                        {shoppingData.length > 0 && (
                            <li className="list-group-item d-flex justify-content-between">
                                <span>Total (USD)</span>
                                <strong>${parseFloat(totalAmount).toFixed(2)}</strong>
                            </li>
                        )}
                    </ul>
                    <div>
                        {shoppingData.length > 0 && (
                            <button onClick={clearCart} className="btn btn-danger" style={{ position: 'absolute', left: 130 }}>
                                Clear Cart
                            </button>
                        )}
                        {shoppingData.length > 0 && (
                            <button onClick={handleCheckout} className="btn btn-primary" style={{ position: 'absolute', right: 130 }}>
                            Checkout
                        </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MyCart;
