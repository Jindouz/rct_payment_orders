import React from 'react'
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { clearItems, selectShoppingData, sendOrderAsync } from '../cart/cartSlice';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { selectUserId } from '../login/loginSlice';

const Paypal = () => {

  const shoppingData = useSelector(selectShoppingData);
  const user_ID = useSelector(selectUserId);
  const totalAmount = shoppingData.reduce((acc, curr) => acc + curr.price * curr.amount, 0);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  

    const paypalOptions = {
        'client-id': "test", // Replace with your actual PayPal client ID
        currency: 'USD',
      };
    
    
      const createOrder = (data, actions) => {
        return actions.order.create({
          purchase_units: [
            {
              amount: {
                value: totalAmount, // The amount you want to charge
              },
            },
          ],
        });
      };
    
    
      const onApprove = async (data, actions) => {
        return actions.order.capture().then(function (details) {
          const paypal_ID = details.id
          // console.log('dispatching order async', user_ID, paypal_ID, totalAmount);
          try
          {
            dispatch(sendOrderAsync({ user_ID, paypal_ID , totalAmount }));
          }catch(error){
            console.log(error);
          }
           
          toast.success('Payment successful!');
          dispatch(clearItems());
          navigate('/');
        });
      };
    
      const onError = (err) => {
        // Handle errors
        toast.error('Payment failed!');
        console.error(err);
      };
    
    
      return (
        <div>
        <PayPalScriptProvider options={paypalOptions}>
          <PayPalButtons
            createOrder={createOrder}
            onApprove={onApprove}
            onError={onError}
          />
        </PayPalScriptProvider>
        </div>
      );
    };
    
    
    
export default Paypal