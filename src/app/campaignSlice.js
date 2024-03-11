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
    members: {
      memberId: {
        memberName: null,
        characterId: null,
        roles: null,
      },
    },
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
    resetCampaignSlice(state, action) {
      return initialState;
    },
  },
});

export const campaignSliceActions = campaignSlice.actions;
export default campaignSlice.reducer;
