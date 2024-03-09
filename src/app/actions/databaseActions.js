import { ref, onValue, set, push, get, child, update } from "firebase/database";
import { userSliceActions } from "../userSlice";
import { db } from "./base";
import { uiSliceActions } from "../uiSlice";
import { campaignSliceActions } from "../campaignSlice";
import { shopsSliceActions } from "../shopsSlice";
import { rolesSliceActions } from "../rolesSlice";

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

export const getRoles = (uid, campaignId) => {
  return async (dispatch) => {
    const userRef = ref(
      db,
      "campaigns/" + campaignId + "/members/" + uid + "/roles"
    );
    onValue(userRef, (snapshot) => {
      const data = snapshot.val();
      dispatch(rolesSliceActions.setRoles(data));
    });
  };
};

// ------------------CAMPAIGNS
//create a new campaign
export const createNewCampaign = (uid, newCampaignData) => {
  return async (dispatch) => {
    dispatch(uiSliceActions.changeLoading(true));
    try {
      //new campaign info
      const id = newCampaignData.id;
      await set(ref(db, "campaigns/" + newCampaignData.id), newCampaignData);
      //store the id in the user who created it
      await set(
        ref(db, "users/" + uid + "/campaigns/created/" + newCampaignData.id),
        true
      );
      dispatch(uiSliceActions.requestSuccessIsTrue());
      dispatch(
        uiSliceActions.showNotification({
          type: "success",
          code: "new campaign created",
        })
      );
    } catch (error) {
      console.error(error);
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
      createdCampaignsIds.length === 1 &&
        dispatch(campaignSliceActions.addCreatedCampaign(campaignsDataList));
      createdCampaignsIds.length > 1 &&
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

//delete campaign from the user and from the campaign

export const deleteCampaign = (campaignId, uid) => {
  return async (dispatch, getState) => {
    const newPostKey = push(child(ref(db), "campaigns")).key;
    const updates = {};
    updates["users/" + uid + "/campaigns/created/" + campaignId] = null;
    updates["campaigns/" + campaignId] = null;

    update(ref(db), updates);
    dispatch(
      uiSliceActions.showNotification({
        type: "info",
        code: "campaign deleted",
      })
    );
  };
};

//--------------------SHOPS
export const createShopsData = (campaignId, shopData) => {
  return async (dispatch) => {
    dispatch(uiSliceActions.changeLoading(true));
    try {
      const shopRef = ref(db, "campaigns/" + campaignId + "/shops/");
      await update(shopRef, { [shopData.id]: { ...shopData } });
      dispatch(uiSliceActions.requestSuccessIsTrue());
      dispatch(
        uiSliceActions.showNotification({
          type: "success",
          code: "new shop created",
        })
      );
      dispatch(getShopsData(campaignId));
    } catch (error) {
      console.error(error);
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

export const getShopsData = (campaignId) => {
  return async (dispatch) => {
    const shopsDataList = {};
    dispatch(uiSliceActions.changeLoading(true));
    try {
      const shopsRef = ref(db, "campaigns/" + campaignId + "/shops");
      const snapshot = await get(shopsRef);
      if (snapshot.exists()) {
        const shopsData = snapshot.val();
        dispatch(shopsSliceActions.setShopsData(shopsData));
      } else {
        dispatch(shopsSliceActions.setShopsData(""));
      }
    } catch (error) {
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

//update shop items
export const updateShopItems = (newShopData, campaignId, shopId) => {
  return async (dispatch) => {
    dispatch(uiSliceActions.changeLoading(true));
    try {
      const shopRef = ref(db, "campaigns/" + campaignId + "/shops/" + shopId);
      await update(shopRef, newShopData);
      dispatch(uiSliceActions.requestSuccessIsTrue());
      dispatch(
        uiSliceActions.showNotification({
          type: "success",
          code: "shop updated",
        })
      );
      dispatch(getShopsData(campaignId));
    } catch (error) {
      console.error(error);
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

//delete shop
export const deleteShop = (campaignId, shopId) => {
  return async (dispatch) => {
    dispatch(uiSliceActions.changeLoading(true));
    try {
      const shopRef = ref(db, "campaigns/" + campaignId + "/shops/");
      console.log(shopRef);
      await update(shopRef, { [shopId]: null });
      dispatch(uiSliceActions.requestSuccessIsTrue());
      dispatch(
        uiSliceActions.showNotification({
          type: "info",
          code: "shop deleted",
        })
      );
      dispatch(getShopsData(campaignId));
    } catch (error) {
      console.error(error);
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
