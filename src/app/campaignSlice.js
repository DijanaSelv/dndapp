import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  createdCampaigns: {},
  joinedCampaigns: {},
  currentCampaign: {
    id: null,
    description: null,
    title: null,
    joinCode: null,
    members: {
      memberId: {
        memberName: null,
        characterId: null,
        roles: null,
      },
    },
  },
};

const campaignSlice = createSlice({
  name: "campaigns",
  initialState,
  reducers: {
    setCreatedCampaigns(state, action) {
      state.createdCampaigns = action.payload;
    },
    addCreatedCampaign(state, action) {
      const newCampaign = action.payload;

      state.createdCampaigns = {
        ...state.createdCampaigns,
        ...newCampaign,
      };
    },
    setJoinedCampaigns(state, action) {
      state.joinedCampaigns = action.payload;
    },

    resetCampaignSlice() {
      return initialState;
    },
    setCurrentCampaign(state, action) {
      state.currentCampaign = action.payload;
    },
  },
});

export const campaignSliceActions = campaignSlice.actions;
export default campaignSlice.reducer;
