import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import cartService from '../../services/cartService';

const initialState = {
  items: [],
  itemCount: 0,
  subtotal: 0,
  isLoading: false,
  isUpdating: false,
  error: null,
};

// Get cart - fetches full cart data
export const getCart = createAsyncThunk(
  'cart/getCart',
  async (_, thunkAPI) => {
    try {
      const response = await cartService.getCart();
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Add to cart - adds item or increases quantity
export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({ productId, quantity = 1 }, thunkAPI) => {
    try {
      const response = await cartService.addToCart(productId, quantity);
      // After adding, fetch updated cart to get full data
      const cartResponse = await cartService.getCart();
      return { 
        ...response.data, 
        cart: cartResponse.data 
      };
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update cart item quantity
export const updateCartItem = createAsyncThunk(
  'cart/updateCartItem',
  async ({ cartItemId, quantity }, thunkAPI) => {
    try {
      await cartService.updateCartItem(cartItemId, quantity);
      // Fetch updated cart
      const response = await cartService.getCart();
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Remove item from cart
export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async (cartItemId, thunkAPI) => {
    try {
      await cartService.removeFromCart(cartItemId);
      // Fetch updated cart
      const response = await cartService.getCart();
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Clear entire cart
export const clearCart = createAsyncThunk(
  'cart/clearCart',
  async (_, thunkAPI) => {
    try {
      await cartService.clearCart();
      return { items: [], itemCount: 0, subtotal: 0 };
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Reset cart state (on logout)
    resetCart: (state) => {
      state.items = [];
      state.itemCount = 0;
      state.subtotal = 0;
      state.error = null;
      state.isLoading = false;
      state.isUpdating = false;
    },
    // Clear any cart errors
    clearCartError: (state) => {
      state.error = null;
    },
    // Optimistic update for quantity change
    optimisticUpdateQuantity: (state, action) => {
      const { cartItemId, quantity } = action.payload;
      const item = state.items.find(i => i.id === cartItemId);
      if (item) {
        const priceDiff = item.product.price * (quantity - item.quantity);
        item.quantity = quantity;
        item.itemTotal = item.product.price * quantity;
        state.subtotal += priceDiff;
      }
    },
    // Optimistic remove item
    optimisticRemoveItem: (state, action) => {
      const cartItemId = action.payload;
      const item = state.items.find(i => i.id === cartItemId);
      if (item) {
        state.subtotal -= item.itemTotal;
        state.items = state.items.filter(i => i.id !== cartItemId);
        state.itemCount = state.items.length;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Cart
      .addCase(getCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.items || [];
        state.itemCount = action.payload.itemCount || 0;
        state.subtotal = action.payload.subtotal || 0;
      })
      .addCase(getCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Add to Cart
      .addCase(addToCart.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.isUpdating = false;
        // Update with full cart data
        if (action.payload.cart) {
          state.items = action.payload.cart.items || [];
          state.itemCount = action.payload.cart.itemCount || 0;
          state.subtotal = action.payload.cart.subtotal || 0;
        } else {
          state.itemCount = action.payload.cartCount || state.itemCount;
        }
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload;
      })
      // Update Cart Item
      .addCase(updateCartItem.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.isUpdating = false;
        state.items = action.payload.items || [];
        state.itemCount = action.payload.itemCount || 0;
        state.subtotal = action.payload.subtotal || 0;
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload;
      })
      // Remove from Cart
      .addCase(removeFromCart.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.isUpdating = false;
        state.items = action.payload.items || [];
        state.itemCount = action.payload.itemCount || 0;
        state.subtotal = action.payload.subtotal || 0;
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload;
      })
      // Clear Cart
      .addCase(clearCart.pending, (state) => {
        state.isUpdating = true;
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.isUpdating = false;
        state.items = [];
        state.itemCount = 0;
        state.subtotal = 0;
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload;
      });
  },
});

export const { 
  resetCart, 
  clearCartError, 
  optimisticUpdateQuantity, 
  optimisticRemoveItem 
} = cartSlice.actions;

export default cartSlice.reducer;
