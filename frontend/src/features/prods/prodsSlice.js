import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { deleteProduct, addProduct,updateProduct, fetchcProds } from './prodsAPI';

const initialState = {
  status: 'idle',
  prods: [],
  error: null,
};

export const getDataAsync = createAsyncThunk(
  'prod/fetchProds',
  async () => {
    const response = await fetchcProds();
    
    return response;
  }
);

export const deleteDataAsync = createAsyncThunk(
  'prod/deleteProds',
  async (id) => {
    const response = await deleteProduct(id, localStorage.getItem('token'));
    return response.data;
  }
);

export const addDataAsync = createAsyncThunk(
  'prod/addProds',
  async (product) => {
    const response = await addProduct(product, localStorage.getItem('token'));
    return response.data;
  }
)

export const updateDataAsync = createAsyncThunk(
  'prod/updateProds',
  async (newData) => {
    // console.log('Product object:', newData);
    // for (const [key, value] of newData.entries()) {
    //   console.log(key, value);
    // }
    const id = newData.get('id');
    // console.log('ID:', id);
    const response = await updateProduct(newData, id, localStorage.getItem('token'));
    return response.data;
  }
)






export const prodSlice = createSlice({
  name: 'prod',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getDataAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.prods = action.payload;
        state.error = null;
      })
      .addCase(getDataAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(deleteDataAsync.fulfilled, (state, action) => {
        const deletedProductId = action.payload; // Get the deleted product's ID from the payload
        // console.log("Deleted Product ID:", deletedProductId);
        state.status = 'idle';
        // Remove the deleted product from the prods array
        state.prods = state.prods.filter(prod => prod.id !== deletedProductId);
        state.error = null;
    })
      .addCase(deleteDataAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const selectProds = (state) => state.prod.prods;
export default prodSlice.reducer;
