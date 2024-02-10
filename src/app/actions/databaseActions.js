import { ref, onValue, set, push, get } from "firebase/database";
import { userSliceActions } from "../userSlice";
import { db } from "./base";
import { uiSliceActions } from "../uiSlice";
import { campaignSliceActions } from "../campaignSlice";

//create new user in collection (on sgin up)
export const createNewUserData = (uid, user) => {
  return async (dispatch) => {
    try {
      await set(ref(db, "users/" + uid), user);
    } catch (error) {
      throw error;
    }
  };
};

//get data to display on home page (on login)
export const getUserData = (uid) => {
  return async (dispatch) => {
    const userRef = ref(db, "users/" + uid);
    onValue(userRef, (snapshot) => {
      const data = snapshot.val();
      dispatch(userSliceActions.setUserData(data));
    });
  };
};

//create a new campaign
export const createNewCampaign = (uid, newCampaignData) => {
  return async (dispatch) => {
    dispatch(uiSliceActions.changeLoading(true));
    try {
      //new campaign info
      await set(ref(db, "campaigns/" + newCampaignData.id), newCampaignData);
      //store the id in the user who created it
      await set(
        push(ref(db, "users/" + uid + "/campaigns/created")),
        newCampaignData.id
      );
      dispatch(uiSliceActions.requestSuccessIsTrue());
      dispatch(
        uiSliceActions.showNotification({
          type: "success",
          code: "new campaign created",
        })
      );
      //fetch the updated list of campaigns
      getCampaignsData();
    } catch (error) {
      dispatch(uiSliceActions.requestFailedIsTrue());
      dispatch(
        uiSliceActions.showNotification({
          type: "error",
          code: "error",
        })
      );
    }
    dispatch(uiSliceActions.changeLoading(false));
  };
};

//get list of campaigns
export const getCampaignsData = (createdCampaignsIds, type) => {
  return async (dispatch) => {
    const campaignsDataList = {};
    dispatch(uiSliceActions.changeLoading(true));

    try {
      let campaignId;
      for (campaignId of createdCampaignsIds) {
        const campaignsRef = ref(db, "campaigns/" + campaignId);
        const snapshot = await get(campaignsRef);
        if (snapshot.exists()) {
          const data = snapshot.val();
          const campaign = {
            image: data.image,
            title: data.title,
            players: data.players ? data.players : 0,
            description: data.description,
            joinCode: data.joinCode,
            id: data.id,
            type,
          };
          campaignsDataList[data.id] = campaign;
        } else {
          console.log("snapshot doesnt exist!");
        }
      }
    } catch (error) {
      dispatch(
        uiSliceActions.showNotification({
          type: "error",
          code: "error",
        })
      );
    }
    if (type === "created") {
      dispatch(campaignSliceActions.setCreatedCampaigns(campaignsDataList));
    }
    if (type === "joined") {
      dispatch(campaignSliceActions.setJoinedCampaigns(campaignsDataList));
    }
    dispatch(uiSliceActions.changeLoading(false));
    dispatch(uiSliceActions.changeFetchedCampaigns(true));
  };
};

//get one campaign
/* snapshot) => {
      const data = snapshot.val();
      console.log(data, createdCampaignsIds);
      //dispatch(userSliceActions.setUserCampaigns(data));
     */
