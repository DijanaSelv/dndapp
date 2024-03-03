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
    changeTitleOfShop(state, action) {
      state.shops[action.payload.shopId].title = action.payload.title;
    },
    changeDescriptionOfShop(state, action) {
      state.shops[action.payload.shopId].description =
        action.payload.description;
    },
    changeImageOfShop(state, action) {
      state.shops[action.payload.shopId].image = action.payload.image;
    },
    removeItemFromShop(state, action) {
      const { shopId, itemId } = action.payload;

      delete state.shops[shopId].items[itemId];
    },
    clearItemsFromShop(state, action) {
      state.shops[action.payload].items = {};
    },
  },
});

export const shopsSliceActions = shopsSlice.actions;

export default shopsSlice.reducer;
