import React from 'react'
import './Checkout.css';
import Paypal from '../prods/Paypal';
import { selectShoppingData } from './cartSlice';
import { useSelector } from 'react-redux';

const Checkout = () => {
  const shoppingData = useSelector(selectShoppingData);
  const totalAmount = shoppingData.reduce((acc, curr) => acc + curr.price * curr.amount, 0);

  return (
    <div className="checkout-container">
         <div className="col-75">
          <div className="container">
            <h1>Checkout</h1>
           <h3>Total Amount : ${(totalAmount).toFixed(2)}</h3>
            <Paypal />
          </div>
        </div>
        
    </div>
  )
}


export default Checkout