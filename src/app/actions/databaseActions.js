import {
  ref,
  onValue,
  set,
  push,
  get,
  child,
  update,
  orderByChild,
  equalTo,
  on,
  query,
} from "firebase/database";
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
      data && dispatch(rolesSliceActions.setRoles(data));
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
export const getCampaignsData = (campaignsIds, type) => {
  return async (dispatch) => {
    const campaignsDataList = [];
    dispatch(uiSliceActions.changeLoading(true));

    try {
      let campaignId;
      for (campaignId of campaignsIds) {
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
      campaignsIds.length === 1 &&
        dispatch(campaignSliceActions.addCreatedCampaign(campaignsDataList));
      campaignsIds.length > 1 &&
        dispatch(campaignSliceActions.setCreatedCampaigns(campaignsDataList));
    }
    if (type === "joined") {
      dispatch(campaignSliceActions.setJoinedCampaigns(campaignsDataList));
    }
    dispatch(uiSliceActions.changeLoading(false));
    dispatch(uiSliceActions.changeFetchedCampaigns(true));
  };
};

//get one campaign (i might not need this)

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

//join Campaign
export const joinCampaign = (joinCode, uid) => {
  return async (dispatch) => {
    dispatch(uiSliceActions.changeLoading(true));
    let campaignKey;
    try {
      const campaignsRef = ref(db, "campaigns/");
      const joinCodeQuery = query(
        campaignsRef,
        orderByChild("joinCode"),
        equalTo(joinCode)
      );
      const snapshot = await get(joinCodeQuery);

      if (snapshot.exists()) {
        campaignKey = Object.keys(snapshot.val())[0];
        //add the campagin to the user joined campaigns
        const joinedCampaignsRef = ref(
          db,
          "users/" + uid + "/campaigns/" + "joined/"
        );
        const joinedMemberRef = ref(
          db,
          "campaigns/" + campaignKey + "/members/" + uid
        );
        const roles = {
          player: true,
        };
        await update(joinedCampaignsRef, { [campaignKey]: true });
        await update(joinedMemberRef, { roles });

        dispatch(
          uiSliceActions.showNotification({
            type: "success",
            code: "campaign joined",
          })
        );
      } else {
        dispatch(
          uiSliceActions.showNotification({
            type: "error",
            code: "no join campaign",
          })
        );
      }
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
    return campaignKey;
  };
};

//get the players in the campaign
export const getMembers = (campaignId, type) => {
  return async (dispatch) => {
    let members = [];
    try {
      const campaignMembersRef = ref(
        db,
        "campaigns/" + campaignId + "/members"
      );

      const membersQuery = query(
        campaignMembersRef,
        orderByChild(`roles/${type}`),
        equalTo(true)
      );
      const snapshot = await get(membersQuery);

      if (snapshot.exists()) {
        const membersId = Object.keys(snapshot.val());

        for (const playerId of membersId) {
          const playerDataRef = ref(db, "users/" + playerId + "/firstName");
          const snapshot = await get(playerDataRef);
          if (snapshot.exists()) {
            const playerData = snapshot.val();
            members.push(playerData);
          } else {
          }
        }
      }
    } catch (error) {
      console.error(error);
    }

    return members;
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
