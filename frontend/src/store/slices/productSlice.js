import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import productService from '../../services/productService';

const initialState = {
  products: [],
  featuredProducts: [],
  currentProduct: null,
  categories: [],
  pagination: null,
  isLoading: false,
  isProductLoading: false,
  error: null,
};

// Get products with filters and pagination
export const getProducts = createAsyncThunk(
  'products/getProducts',
  async (params, thunkAPI) => {
    try {
      const response = await productService.getProducts(params);
      return response;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get single product by ID
export const getProduct = createAsyncThunk(
  'products/getProduct',
  async (id, thunkAPI) => {
    try {
      const response = await productService.getProduct(id);
      return response; // productService already extracts the data
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get single product by slug (for ProductDetail page)
export const getProductBySlug = createAsyncThunk(
  'products/getProductBySlug',
  async (slug, thunkAPI) => {
    try {
      const response = await productService.getProduct(slug);
      return response; // productService already extracts the data
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get featured products for homepage
export const getFeaturedProducts = createAsyncThunk(
  'products/getFeaturedProducts',
  async (_, thunkAPI) => {
    try {
      const response = await productService.getFeaturedProducts();
      return response; // productService already extracts the data array
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get all categories
export const getCategories = createAsyncThunk(
  'products/getCategories',
  async (_, thunkAPI) => {
    try {
      const response = await productService.getCategories();
      return Array.isArray(response) ? response : [];
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Products
      .addCase(getProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(getProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Get Single Product by ID
      .addCase(getProduct.pending, (state) => {
        state.isProductLoading = true;
        state.error = null;
      })
      .addCase(getProduct.fulfilled, (state, action) => {
        state.isProductLoading = false;
        state.currentProduct = action.payload;
      })
      .addCase(getProduct.rejected, (state, action) => {
        state.isProductLoading = false;
        state.error = action.payload;
      })
      // Get Single Product by Slug
      .addCase(getProductBySlug.pending, (state) => {
        state.isProductLoading = true;
        state.error = null;
      })
      .addCase(getProductBySlug.fulfilled, (state, action) => {
        state.isProductLoading = false;
        state.currentProduct = action.payload;
      })
      .addCase(getProductBySlug.rejected, (state, action) => {
        state.isProductLoading = false;
        state.error = action.payload;
        state.currentProduct = null;
      })
      // Get Featured Products
      .addCase(getFeaturedProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getFeaturedProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.featuredProducts = action.payload;
      })
      .addCase(getFeaturedProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Get Categories
      .addCase(getCategories.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categories = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(getCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.categories = [];
        state.error = action.payload;
      });
  },
});

export const { clearCurrentProduct, clearError } = productSlice.actions;
export default productSlice.reducer;
