import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  shops: {},
};

const shopsSlice = createSlice({
  name: "shops",
  initialState,
  reducers: {
    setShopsData(state, action) {
      state.shops = action.payload;
    },
    addItemToShop(state, action) {
      const { shopId, item } = action.payload;

      const updatedItems = {
        ...state.shops[shopId].items,
        [item.id]: { ...item },
      };
      state.shops[shopId].items = updatedItems;
    },
    removeItemFromShop(state, action) {
      const { shopId, itemId } = action.payload;

      delete state.shops[shopId].items[itemId];
    },
  },
});

export const shopsSliceActions = shopsSlice.actions;

export default shopsSlice.reducer;
