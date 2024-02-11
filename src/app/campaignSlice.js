import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  createdCampaigns: {},
  joinedCampaigns: {},
  currentCampaign: {
    id: null,
    details: null,
    title: null,
    shop: null,
    joinCode: null,
    members: [
      {
        characterId: null,
        roles: null,
      },
    ],
    logs: null,
    info: null,
    combat: null,
  },
};

const campaignSlice = createSlice({
  name: "campaigns",
  initialState,
  reducers: {
    setCreatedCampaigns(state, action) {
      state.createdCampaigns = action.payload;
    },
    setJoinedCampaigns(state, action) {
      state.joinedCampaigns = action.payload;
    },

    setCurrentCampaign(state, action) {
      state.currentCampaign = action.payload;
    },
    resetCampaignSlice(state, action) {
      state = initialState;
    },
    provideCampaignList(state, action) {
      if (action.payload === "created") {
        return state.createdCampaigns;
      }
      if (action.payload === "joined") {
        return state.joinedCampaigns;
      }
    },
  },
});

export const campaignSliceActions = campaignSlice.actions;
export default campaignSlice.reducer;
