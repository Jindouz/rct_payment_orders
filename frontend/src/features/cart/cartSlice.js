import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { addOrder } from './cartAPI';



const initialCartState = {
    cartVisible: false,
    shoppingData: !!localStorage.getItem('shoppingData') ? JSON.parse(localStorage.getItem('shoppingData')) : [],
    totalAmount: 0,
    totalQuantity: 0,
    cartItems: []
};



export const sendOrderAsync = createAsyncThunk(
    'cart/addOrder',
    async ({user_ID, paypal_ID}, thunkAPI) => {
        const state = thunkAPI.getState();
        const sendShoppingData = state.cart.shoppingData;
        const total_price = state.cart.totalAmount;

        // Transform the shopping data into the required format for order details
        const orderDetails = sendShoppingData.map(item => ({
            product: item.id,  // Assuming 'id' is the product ID
            quantity: item.amount,
            price_per: parseFloat(item.price).toFixed(2)
        }));

        // Construct the data to be sent to the backend
        const orderData = {
            "order_details": orderDetails,
            "total_price": total_price,
            "user": user_ID,
            "paypal_order_id": paypal_ID
        };

        try {
            const response = await addOrder(orderData, localStorage.getItem('token'));
            console.log('Order sent successfully:', response.data);
            return response.data;
        } catch (error) {
            // Handle error
            console.error('Failed to send order:', error);
            throw error;
        }
    }
);

const cartSlice = createSlice({
    name: 'cart',
    initialState: initialCartState,
    reducers: {
        toggleCartVisibility: state => {
            state.cartVisible = !state.cartVisible;
        },
        addItem: (state, action) => {
            const newItem = action.payload;
            const existingItem = state.shoppingData.find(item => item.id === newItem.id);
            if (existingItem) {
                existingItem.amount += 1;
            } else {
                state.shoppingData.push({ ...newItem, amount: 1, img: newItem.img === null ? '/media/default.jpg' : newItem.img });
            }
            console.log(newItem.img);
            // Save to local storage
            localStorage.setItem('shoppingData', JSON.stringify(state.shoppingData));
            state.totalAmount = state.shoppingData.reduce((acc, curr) => acc + curr.price * curr.amount, 0);
            state.totalQuantity = state.shoppingData.reduce((acc, curr) => acc + curr.amount, 0);
            state.cartItems = state.shoppingData;
            // console.log(state.shoppingData);
        },
        removeItem: (state, action) => {
            const id = action.payload;
            const itemIndex = state.shoppingData.findIndex(item => item.id === id);
            if (itemIndex !== -1) {
                if (state.shoppingData[itemIndex].amount > 1) {
                    state.shoppingData[itemIndex].amount -= 1; // If quantity is greater than 1, decrement it
                } else {
                    state.shoppingData.splice(itemIndex, 1); // If quantity is 1, remove the item entirely
                }
            }
            // Save to local storage
            localStorage.setItem('shoppingData', JSON.stringify(state.shoppingData));
        },
        clearItems: state => {
            state.shoppingData = [];
            // Save to local storage
            localStorage.setItem('shoppingData', JSON.stringify(state.shoppingData));
        },
        updateItemAmount: (state, action) => {
            const { id, amount } = action.payload;
            const itemToUpdate = state.shoppingData.find(item => item.id === id);
            if (itemToUpdate) {
                itemToUpdate.amount = amount;
                // Save to local storage
                localStorage.setItem('shoppingData', JSON.stringify(state.shoppingData));
                state.totalAmount = state.shoppingData.reduce((acc, curr) => acc + curr.price * curr.amount, 0);
            }
        }
    }
});

export const { toggleCartVisibility, addItem, removeItem, clearItems, updateItemAmount } = cartSlice.actions;
export const selectCartVisibility = state => state.cart.cartVisible;
export const selectShoppingData = state => state.cart.shoppingData;

export default cartSlice.reducer;
