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
  query,
} from "firebase/database";
import { userSliceActions } from "../userSlice";
import { db } from "./base";
import { uiSliceActions } from "../uiSlice";
import { campaignSliceActions } from "../campaignSlice";
import { shopsSliceActions } from "../shopsSlice";
import { rolesSliceActions } from "../rolesSlice";
import { notesSliceActions } from "../notesSlice";

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

export const getUserCampaigns = (uid) => {
  return async (dispatch) => {
    const userRef = ref(db, "users/" + uid + "/campaigns");
    onValue(userRef, (snapshot) => {
      const data = snapshot.val();

      dispatch(userSliceActions.updateUserCampaigns(data));
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
    dispatch(getUserCampaigns(uid));
    dispatch(uiSliceActions.changeLoading(false));
  };
};

//get list of campaigns
export const getCampaignsData = (campaignsIds, type) => {
  return async (dispatch) => {
    const campaignsDataList = {};
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
            id: data.id,
          };
          campaignsDataList[data.id] = campaign;
        } else {
          console.log(
            "no campaigns in",
            type,
            "campaign probably erased from the creator"
          );
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
  };
};

//get current campaign
export const getCurrentCampaign = (uid, campaignId) => {
  return async (dispatch) => {
    let currentCampaign;
    dispatch(uiSliceActions.changeLoading(true));
    try {
      const campaignsRef = ref(db, "campaigns/" + campaignId);
      const snapshot = await get(campaignsRef);

      if (snapshot.exists() && snapshot.val().members[uid]) {
        const data = snapshot.val();
        currentCampaign = {
          image: data.image,
          description: data.description,
          title: data.title,
          joinCode: data.joinCode,
          location: data.location,
          members: data.members,
          id: data.id,
        };
      } else {
        throw new Error("pageUnavailable");
      }
    } catch (error) {
      console.error(error.message);
    }
    dispatch(campaignSliceActions.setCurrentCampaign(currentCampaign));
    dispatch(getRoles(uid, campaignId));
    dispatch(uiSliceActions.changeLoading(false));
  };
};

//delete campaign from the user and from the campaign

export const deleteCampaign = (campaignId, uid) => {
  return async (dispatch) => {
    const newPostKey = push(child(ref(db), "campaigns")).key; //do i need this? TODO:
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
    dispatch(getUserCampaigns(uid));
    dispatch(uiSliceActions.requestSuccessIsTrue());
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
    dispatch(getUserCampaigns(uid));
    dispatch(uiSliceActions.changeLoading(false));
    return campaignKey;
  };
};

//leave a joined campaign

export const leaveCampaign = (campaignId, uid) => {
  return async (dispatch) => {
    dispatch(uiSliceActions.changeLoading(true));
    const updates = {};
    updates["users/" + uid + "/campaigns/joined/" + campaignId] = null;
    updates["campaigns/" + campaignId + "/members/" + uid] = null;
    update(ref(db), updates);
    dispatch(
      uiSliceActions.showNotification({
        type: "info",
        code: "campaign left",
      })
    );
    dispatch(uiSliceActions.requestSuccessIsTrue());
    dispatch(getUserCampaigns(uid));
    dispatch(uiSliceActions.changeLoading(false));
  };
};

//get the players in the campaign by role
export const getMembers = (campaignId, role) => {
  return async (dispatch) => {
    let members = [];
    try {
      const campaignMembersRef = ref(
        db,
        "campaigns/" + campaignId + "/members"
      );

      const membersQuery = query(
        campaignMembersRef,
        orderByChild(`roles/${role}`),
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

//PRIVATE NOTES

export const createNotes = (campaignId, uid, notesData) => {
  return async (dispatch) => {
    try {
      const notesRef = ref(
        db,
        "campaigns/" + campaignId + "/members/" + uid + "/notes"
      );
      await update(notesRef, { ...notesData });
    } catch (error) {
      console.error(error);
    }
    dispatch(uiSliceActions.requestSuccessIsTrue());
  };
};

export const getNotes = (campaignId, uid) => {
  return async (dispatch) => {
    try {
      const notesRef = ref(
        db,
        "campaigns/" + campaignId + "/members/" + uid + "/notes"
      );
      const snapshot = await get(notesRef);
      if (snapshot.exists()) {
        const notesData = snapshot.val();
        dispatch(notesSliceActions.setNotesData(notesData));
      } else {
        dispatch(notesSliceActions.setNotesData(""));
      }
    } catch (error) {
      console.error(error);
    }
  };
};

export const deleteNotes = (campaignId, uid, noteId) => {
  return async (dispatch) => {
    try {
      const notesRef = ref(
        db,
        "campaigns/" + campaignId + "/members/" + uid + "/notes"
      );
      await update(notesRef, { [noteId]: null });
    } catch (error) {
      console.error(error);
    }
    dispatch(uiSliceActions.requestSuccessIsTrue());
  };
};

export const updateNotes = (campaignId, uid, noteId, newContent) => {
  return async (dispatch) => {
    try {
      const notesRef = ref(
        db,
        "campaigns/" + campaignId + "/members/" + uid + "/notes/" + noteId
      );
      await update(notesRef, { content: newContent });
    } catch (error) {
      console.error(error);
    }
    dispatch(uiSliceActions.requestSuccessIsTrue());
  };
};
