import {
  ref,
  onValue,
  set,
  //push,
  get,
  //child,
  update,
  orderByChild,
  equalTo,
  query,
  remove,
  onChildAdded,
  onChildRemoved,
} from "firebase/database";
import { userSliceActions } from "../userSlice";
import { db } from "./base";
import { uiSliceActions } from "../uiSlice";
import { campaignSliceActions } from "../campaignSlice";
import { shopsSliceActions } from "../shopsSlice";
import { rolesSliceActions } from "../rolesSlice";
import { notesSliceActions } from "../notesSlice";
import { charactersSliceActions } from "../charactersSlice";
//we need static shops to create a noew campaign with default shops
import STATIC_SHOPS from "../STATIC_SHOPS";
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
      dispatch(uiSliceActions.changeLoading(false));
    });
  };
};

export const subscribeToCharacters = (uid) => {
  return async (dispatch) => {
    const charactersRef = ref(db, "characters/");
    const queryRef = query(
      charactersRef,
      orderByChild("ownerId", equalTo(uid)),
    );
    const unsubscribe = onValue(queryRef, (snapshot) => {
      const data = snapshot.val();
      console.log(data, "charactersData");
      dispatch(charactersSliceActions.setCharactersData(data));
    });

    return () => unsubscribe();
  };
};

export const getUserCharacters = (uid) => {
  return async (dispatch) => {
    const charactersRef = ref(db, "characters/");
    const queryRef = query(
      charactersRef,
      orderByChild("ownerId", equalTo(uid)),
    );
    onValue(queryRef, (snapshot) => {
      const data = snapshot.val();
      console.log(data, "charactersData");
      dispatch(charactersSliceActions.setCharactersData(data));
    });
  };
};

/* export const getUserCampaigns = (uid) => {
  return async (dispatch) => {
    const userRef = ref(db, "users/" + uid + "/campaigns");
    onValue(userRef, (snapshot) => {
      const data = snapshot.val();

      dispatch(userSliceActions.updateUserCampaigns(data));
    });
  };
}; */

export const getRoles = (uid, campaignId) => {
  return async (dispatch) => {
    const userRef = ref(
      db,
      "campaigns/" + campaignId + "/members/" + uid + "/roles",
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
    try {
      //new campaign info
      const id = newCampaignData.id;
      await set(ref(db, "campaigns/" + id), newCampaignData);
      //store the id in the user who created it
      await set(ref(db, "users/" + uid + "/campaigns/created/" + id), true);
      //store the initial shops
      await set(ref(db, "shops/" + id), STATIC_SHOPS);

      dispatch(uiSliceActions.requestSuccessIsTrue());
      dispatch(
        uiSliceActions.showNotification({
          type: "success",
          code: "new campaign created",
        }),
      );
    } catch (error) {
      console.error(error);
      dispatch(uiSliceActions.requestFailedIsTrue());
      dispatch(
        uiSliceActions.showNotification({
          type: "error",
          code: "error",
        }),
      );
    }
  };
};

//realTime CampaignsData
export const subscribeToCampaigns = (campaignIds = [], type) => {
  return (dispatch) => {
    // quick exit for empty input
    if (!Array.isArray(campaignIds) || campaignIds.length === 0) {
      return () => {};
    }

    dispatch(uiSliceActions.changeLoading(true));
    const campaignsDataList = {};
    const unsubscribers = [];

    campaignIds.forEach((id) => {
      const campaignsRef = ref(db, `campaigns/${id}`);

      const unsubscribe = onValue(
        campaignsRef,
        (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.val();

            campaignsDataList[id] = {
              id: data.id,
              title: data.title,
              image: data.image,
              players: data.players || 0,
              joinCode: data.joinCode,
            };
          } else {
            console.log(
              "No campaign found in",
              type,
              ", possibly deleted by creator.",
            );
            delete campaignsDataList[id];
          }

          //Update Redux every time data changes
          const action =
            type === "created"
              ? campaignSliceActions.setCreatedCampaigns
              : campaignSliceActions.setJoinedCampaigns;

          // spread to create a fresh object so Redux detects change
          dispatch(action({ ...campaignsDataList }));
        },
        (error) => {
          dispatch(
            uiSliceActions.showNotification({
              type: "error",
              code: error.code,
            }),
          );
        },
      );

      unsubscribers.push(unsubscribe);
    });

    dispatch(uiSliceActions.changeLoading(false));
    //return a cleanup function to stop listening whn component unmounts
    return () =>
      unsubscribers.forEach((unsubscribe) => {
        try {
          unsubscribe();
        } catch (e) {}
      });
  };
};

//get list of campaigns
/* export const getCampaignsData = (campaignsIds, type) => {
  return async (dispatch) => {
    const campaignsDataList = {};
    

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
            joinCode: data.joinCode,
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
   
  };
}; */

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
  return async (dispatch, getState) => {
    //const newPostKey = push(child(ref(db), "campaigns")).key; //do i need this? TODO:
    const updates = {};
    updates["users/" + uid + "/campaigns/created/" + campaignId] = null;
    updates["campaigns/" + campaignId] = null;
    updates["shops/" + campaignId] = null;

    await update(ref(db), updates);
    dispatch(
      uiSliceActions.showNotification({
        type: "info",
        code: "campaign deleted",
      }),
    );
  };
};

//join Campaign
export const joinCampaign = (joinCode, uid) => {
  return async (dispatch) => {
    /*  dispatch(uiSliceActions.changeLoading(true)); */
    let campaignId;
    try {
      const campaignsRef = ref(db, "campaigns/");
      const joinCodeQuery = query(
        campaignsRef,
        orderByChild("joinCode"),
        equalTo(joinCode),
      );
      const snapshot = await get(joinCodeQuery);

      if (snapshot.exists()) {
        campaignId = Object.keys(snapshot.val())[0];
        //add the campagin to the user joined campaigns
        const joinedCampaignsRef = ref(
          db,
          "users/" + uid + "/campaigns/joined/",
        );
        const joinedMemberRef = ref(
          db,
          "campaigns/" + campaignId + "/members/" + uid,
        );
        const roles = {
          player: true,
        };
        await update(joinedCampaignsRef, { [campaignId]: true });
        await update(joinedMemberRef, { roles });

        dispatch(
          uiSliceActions.showNotification({
            type: "success",
            code: "campaign joined",
          }),
        );
      } else {
        dispatch(
          uiSliceActions.showNotification({
            type: "error",
            code: "no join campaign",
          }),
        );
      }
    } catch (error) {
      console.error(error);
      dispatch(
        uiSliceActions.showNotification({
          type: "error",
          code: "error",
        }),
      );
    }
    /*  dispatch(getUserCampaigns(uid)); */
    /* dispatch(uiSliceActions.changeLoading(false)); */
    return campaignId;
  };
};

//leave a joined campaign

export const leaveCampaign = (campaignId, uid) => {
  return async (dispatch, getState) => {
    const updates = {};
    updates["users/" + uid + "/campaigns/joined/" + campaignId] = null;
    updates["campaigns/" + campaignId + "/members/" + uid] = null;

    await update(ref(db), updates);
    dispatch(
      uiSliceActions.showNotification({
        type: "info",
        code: "campaign left",
      }),
    );
  };
};

//get the players in the campaign by role
export const getMembers = (campaignId, role) => {
  return async (dispatch) => {
    let members = [];
    try {
      const campaignMembersRef = ref(
        db,
        "campaigns/" + campaignId + "/members",
      );

      const membersQuery = query(
        campaignMembersRef,
        orderByChild(`roles/${role}`),
        equalTo(true),
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
      const shopRef = ref(db, "shops/" + campaignId);
      await update(shopRef, { [shopData.id]: { ...shopData } });
      dispatch(uiSliceActions.requestSuccessIsTrue());
      dispatch(
        uiSliceActions.showNotification({
          type: "success",
          code: "new shop created",
        }),
      );
      //dispatch(getShopsData(campaignId));
    } catch (error) {
      console.error(error);
      dispatch(
        uiSliceActions.showNotification({
          type: "error",
          code: "error",
        }),
      );
    }

    dispatch(uiSliceActions.changeLoading(false));
  };
};

export const getShopsData = (campaignId) => {
  console.log("getShopsData called");
  return async (dispatch) => {
    dispatch(shopsSliceActions.setLoading(true));
    const shopsData = {};
    const unsubscribers = [];

    try {
      const allShopsRef = ref(db, "shops/" + campaignId);
      const snapshot = await get(allShopsRef);

      if (snapshot.exists()) {
        const shopIds = Object.keys(snapshot.val());

        let firstDataLoaded = false;

        shopIds.forEach((id) => {
          const shopRef = ref(db, "shops/" + campaignId + "/" + id);

          const unsubscribe = onValue(
            shopRef,
            (snapshot) => {
              if (snapshot.exists()) {
                const data = snapshot.val();
                shopsData[id] = data;
              } else {
                delete shopsData[id];
              }

              dispatch(shopsSliceActions.setShopsData({ ...shopsData }));

              if (!firstDataLoaded) {
                firstDataLoaded = true;
                dispatch(shopsSliceActions.setLoading(false));
              }
            },
            (error) => {
              dispatch(
                uiSliceActions.showNotification({
                  type: "error",
                  code: error.code,
                }),
              );
            },
          );
          unsubscribers.push(unsubscribe);
        });
      } else {
        dispatch(shopsSliceActions.setShopsData({}));
        dispatch(shopsSliceActions.setLoading(false));
      }
    } catch (error) {
      dispatch(
        uiSliceActions.showNotification({
          type: "error",
          code: error.code || "error",
        }),
      );
      dispatch(shopsSliceActions.setLoading(false));
    }

    return () => unsubscribers.forEach((u) => u());
  };
};

/* keep track if something is added or removed */
export const watchShops = (campaignId) => {
  return (dispatch) => {
    const shopsRef = ref(db, `shops/${campaignId}`);

    // When a new shop is added
    const unsubscribeAdded = onChildAdded(shopsRef, (snapshot) => {
      const shopId = snapshot.key;
      const data = snapshot.val();
      console.log("shop added", shopId, data);
      dispatch(shopsSliceActions.addShop({ shopId: shopId, data: data }));
    });

    // When a shop is removed
    const unsubscribeRemoved = onChildRemoved(shopsRef, (snapshot) => {
      const shopId = snapshot.key;
      console.log("shop removed", shopId);
      dispatch(shopsSliceActions.removeShop(shopId));
    });

    // Cleanup function
    return () => {
      unsubscribeAdded();
      unsubscribeRemoved();
    };
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
        }),
      );
      //dispatch(getShopsData(campaignId));
    } catch (error) {
      console.error(error);
      dispatch(
        uiSliceActions.showNotification({
          type: "error",
          code: "error",
        }),
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
      const updates = {};
      updates["shops/" + campaignId + "/" + shopId] = null;

      await update(ref(db), updates);

      dispatch(uiSliceActions.requestSuccessIsTrue());
      dispatch(
        uiSliceActions.showNotification({
          type: "info",
          code: "shop deleted",
        }),
      );
    } catch (error) {
      console.error(error);
      dispatch(
        uiSliceActions.showNotification({
          type: "error",
          code: "error",
        }),
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
        "campaigns/" + campaignId + "/members/" + uid + "/notes",
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
        "campaigns/" + campaignId + "/members/" + uid + "/notes",
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
        "campaigns/" + campaignId + "/members/" + uid + "/notes",
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
        "campaigns/" + campaignId + "/members/" + uid + "/notes/" + noteId,
      );
      await update(notesRef, { content: newContent });
    } catch (error) {
      console.error(error);
    }
    dispatch(uiSliceActions.requestSuccessIsTrue());
  };
};

//CHARACTER

export const createCharacter = (data, uid, cid) => {
  return async (dispatch) => {
    dispatch(uiSliceActions.changeLoading(true));
    try {
      const charRef = ref(db, "characters/" + cid);
      await update(charRef, { ...data });
    } catch (error) {
      console.error(error);
    }
    dispatch(uiSliceActions.changeLoading(false));
    dispatch(uiSliceActions.requestSuccessIsTrue());
  };
};
export const deleteCharacter = (cid) => {
  return async (dispatch) => {
    dispatch(uiSliceActions.changeLoading(true));
    try {
      const charRef = ref(db, "characters/" + cid);
      await remove(charRef);
    } catch (error) {
      console.error(error);
    }
    dispatch(uiSliceActions.changeLoading(false));
    dispatch(uiSliceActions.requestSuccessIsTrue());
  };
};

export const addCharacterToCampaign = (uid, characterId, campaignId) => {
  return async (dispatch) => {
    dispatch(uiSliceActions.changeLoading(true));

    try {
      const campaignRef = ref(
        db,
        "campaigns/" + campaignId + "/members/" + uid,
      );
      await update(campaignRef, { character: characterId });
    } catch (error) {
      console.error(error);
    }
    dispatch(uiSliceActions.changeLoading(false));
    dispatch(uiSliceActions.requestSuccessIsTrue());
    dispatch(
      uiSliceActions.showNotification({
        type: "success",
        code: "added character",
      }),
    );
  };
};

export const removeCharacterFromCampaign = (uid, campaignId) => {
  return async (dispatch) => {
    dispatch(uiSliceActions.changeLoading(true));

    try {
      const characterRef = ref(
        db,
        "campaigns/" + campaignId + "/members/" + uid + "/character/",
      );
      console.log(characterRef);
      await remove(characterRef);
    } catch (error) {
      console.error(error);
    }
    dispatch(uiSliceActions.changeLoading(false));
    dispatch(uiSliceActions.requestSuccessIsTrue());
    dispatch(
      uiSliceActions.showNotification({
        type: "success",
        code: "removed character",
      }),
    );
  };
};

export const updateEquippedItems = (data, uid, characterId, category) => {
  return async (dispatch) => {
    dispatch(uiSliceActions.changeLoading(true));
    try {
      const charRef = ref(
        db,
        "users/" + uid + "/characters/" + characterId + "/equipped/" + category,
      );
      if (data) {
        await update(charRef, { ...data });
      } else {
        await remove(charRef);
      }
    } catch (error) {
      console.error(error);
    }
    dispatch(uiSliceActions.changeLoading(false));
    dispatch(uiSliceActions.requestSuccessIsTrue());
  };
};

//for wizard, they can prepare spells from the learned ones
export const updatePreparedSpells = (data, uid, characterId) => {
  return async (dispatch) => {
    dispatch(uiSliceActions.changeLoading(true));
    try {
      const preparedSpellsRef = ref(
        db,
        "users/" + uid + "/characters/" + characterId + "/preparedSpells/",
      );
      if (!data.length === 0) {
        await remove(preparedSpellsRef);
      } else {
        //set overwrites the whole data (instead of putting remove and update and to not have duplicate spells.)
        await set(preparedSpellsRef, data);
      }
    } catch (error) {
      console.error(error);
    }
    dispatch(uiSliceActions.changeLoading(false));
    dispatch(uiSliceActions.requestSuccessIsTrue());
  };
};

/* COMBAT PAGE */
export const addRolltoCombat = (
  campaignId,
  type,
  character,
  content,
  uid,
  details,
) => {
  return async (dispatch) => {
    try {
      const combatRef = ref(db, "campaigns/" + campaignId + "/combat/messages");
      const timestamp = Date.now();

      const snapshot = await get(combatRef);
      const messages = snapshot.val();

      //remove messages of there's over 50
      const messageKeys = messages ? Object.keys(messages) : [];
      if (messageKeys.length >= 100) {
        messageKeys.sort((a, b) => a - b);
        const messagesToDelete = messageKeys.slice(0, messageKeys.length - 99);
        const deleteUpdates = messagesToDelete.reduce((acc, key) => {
          acc[key] = null;
          return acc;
        }, {});

        await update(combatRef, deleteUpdates);
      }

      await update(combatRef, {
        [timestamp]: { content, type, character, uid, details },
      });
    } catch (error) {
      console.error(error);
    }
  };
};

export const addToInitiative = (name, key, campaignId) => {
  return async (dispatch) => {
    try {
      const initiativeRef = ref(
        db,
        "campaigns/" + campaignId + "/combat/initiative",
      );
      /* const timestamp = Date.now().toString(); */
      await update(initiativeRef, { [key]: name });
    } catch (error) {
      console.error(error);
    }
  };
};

export const removeFromInitiative = (key, campaignId) => {
  return async (dispatch) => {
    try {
      const initiativeRef = ref(
        db,
        "campaigns/" + campaignId + "/combat/initiative/" + key,
      );

      await remove(initiativeRef);
    } catch (error) {
      console.error(error);
    }
  };
};

export const reorderInitiative = (updatedInitiativeOrder, campaignId) => {
  return async (dispatch) => {
    /* console.log(oldKey, newKey); */
    try {
      const initiativeRef = ref(
        db,
        "campaigns/" + campaignId + "/combat/initiative/",
      );

      await set(initiativeRef, updatedInitiativeOrder);
    } catch (error) {
      console.error(error);
    }
  };
};
