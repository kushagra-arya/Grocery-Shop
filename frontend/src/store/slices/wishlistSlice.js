import { createSlice } from '@reduxjs/toolkit';

// Get the current user ID from localStorage for namespacing
const getCurrentUserId = () => {
  try {
    const user = localStorage.getItem('user');
    if (user) {
      const parsed = JSON.parse(user);
      return parsed.id || parsed.userId || null;
    }
  } catch {}
  return null;
};

const getWishlistKey = (userId) => userId ? `wishlist_${userId}` : 'wishlist_guest';

// Load wishlist from localStorage
const loadWishlist = (userId) => {
  try {
    const key = getWishlistKey(userId);
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const saveWishlist = (items) => {
  try {
    const userId = getCurrentUserId();
    const key = getWishlistKey(userId);
    localStorage.setItem(key, JSON.stringify(items));
  } catch {
    // Ignore storage errors
  }
};

const initialState = {
  items: loadWishlist(getCurrentUserId()),
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    addToWishlist: (state, action) => {
      const product = action.payload;
      const exists = state.items.find((item) => item.id === product.id);
      if (!exists) {
        state.items.push({
          id: product.id,
          name: product.name,
          slug: product.slug,
          price: product.price,
          comparePrice: product.comparePrice,
          primaryImage: product.primaryImage || product.images?.[0]?.imageUrl || null,
          category: product.category,
          avgRating: product.avgRating || 0,
          reviewCount: product.reviewCount || 0,
          stockQuantity: product.stockQuantity,
          unit: product.unit,
          isFeatured: product.isFeatured,
          addedAt: new Date().toISOString(),
        });
        saveWishlist(state.items);
      }
    },
    removeFromWishlist: (state, action) => {
      const productId = action.payload;
      state.items = state.items.filter((item) => item.id !== productId);
      saveWishlist(state.items);
    },
    toggleWishlistItem: (state, action) => {
      const product = action.payload;
      const index = state.items.findIndex((item) => item.id === product.id);
      if (index >= 0) {
        state.items.splice(index, 1);
      } else {
        state.items.push({
          id: product.id,
          name: product.name,
          slug: product.slug,
          price: product.price,
          comparePrice: product.comparePrice,
          primaryImage: product.primaryImage || product.images?.[0]?.imageUrl || null,
          category: product.category,
          avgRating: product.avgRating || 0,
          reviewCount: product.reviewCount || 0,
          stockQuantity: product.stockQuantity,
          unit: product.unit,
          isFeatured: product.isFeatured,
          addedAt: new Date().toISOString(),
        });
      }
      saveWishlist(state.items);
    },
    clearWishlist: (state) => {
      state.items = [];
      saveWishlist(state.items);
    },
    loadUserWishlist: (state) => {
      const userId = getCurrentUserId();
      state.items = loadWishlist(userId);
    },
  },
});

export const { addToWishlist, removeFromWishlist, toggleWishlistItem, clearWishlist, loadUserWishlist } = wishlistSlice.actions;

// Selectors
export const selectWishlistItems = (state) => state.wishlist.items;
export const selectIsWishlisted = (productId) => (state) =>
  state.wishlist.items.some((item) => item.id === productId);
export const selectWishlistCount = (state) => state.wishlist.items.length;

export default wishlistSlice.reducer;
