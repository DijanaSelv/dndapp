import { ref, onValue } from "firebase/database";
import { db } from "../../app/actions/base";
import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { CombatRollWrapper } from "../../components/CombatRollWrapper";
import { Button } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { addRolltoCombat } from "../../app/actions/databaseActions";

import classes from "./CombatPage.module.css";
import { AddCharacterToCampaignModal } from "../../components/AddCharacterToCampaignModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import TextArea from "antd/es/input/TextArea";

const CombatPage = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const campaignId = params.campaignId;
  const uid = params.uid;
  const [combatData, setCombatData] = useState({});
  const [showModal, setShowModal] = useState(false);

  const isLoading = useSelector((state) => state.uiSlice.isLoading);
  const characterId = useSelector(
    (state) =>
      state.campaignSlice?.currentCampaign?.members[uid]?.character || ""
  );

  const characterName = useSelector(
    (state) =>
      (characterId && state.userSlice?.user.characters[characterId]?.name) || ""
  );

  const addCharacterHandler = () => {
    setShowModal(true);
  };

  const rollDiceHandler = () => {
    const randomd20 = Math.floor(Math.random() * (20 - 1) + 1);
    const character = characterName;
    const type = "d20";
    const content = randomd20;
    dispatch(addRolltoCombat(campaignId, type, character, content, uid));
  };

  //get value on change
  useEffect(() => {
    const combatDataRef = ref(
      db,
      "campaigns/" + campaignId + "/combat/messages"
    );

    const unsubscribe = onValue(combatDataRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setCombatData(data);

        //cleanup function that is called when the component unmounts and useEffect triggers again. To prevent multiple subscriptions and rerenders.
        return () => unsubscribe();
      }
    });
  }, [campaignId]);

  return (
    <div className={classes.combatContent}>
      <header>Combat rolls</header>
      <div className={classes.chatWrapper}>
        <div className={classes.chatBarLeft}>
          <h4>Initiative</h4>
          <div>Ratka</div>
          <div>Pande</div>
          <div>Kire</div>
          <div>Slafka</div>
        </div>
        {/*      <div className={classes.mapWrapper}></div> */}
        {/*  <img
          src="https://cdn.pixabay.com/photo/2016/12/13/16/42/treasure-map-1904546_1280.jpg"
          className={classes.mapWrapper}
        ></img> */}
        <div className={classes.chatBarRight}>
          <div className={classes.messagesWrapper}>
            {combatData &&
              Object.values(combatData).map((roll, i) => (
                <CombatRollWrapper
                  key={i}
                  character={roll.character}
                  type={roll.type}
                  content={roll.content}
                  uid={roll.uid}
                />
              ))}
          </div>
          <div className={classes.textInputWrapper}>
            <TextArea
              showCount
              maxLength={100}
              style={{
                resize: "none",
              }}
            />
          </div>
        </div>
      </div>
      {characterId && <Button onClick={rollDiceHandler}>Roll Dice</Button>}
      {!isLoading && !characterId && (
        <div className={classes.messageWrapper}>
          Please add a character to the campaign to join combat. You can still
          spectate but you won't be able to roll without a joined character.
          <AddCharacterToCampaignModal
            showModal={showModal}
            setShowModal={setShowModal}
          >
            <Button onClick={addCharacterHandler}>
              {" "}
              <FontAwesomeIcon icon={faPlus} /> Add Character
            </Button>
          </AddCharacterToCampaignModal>
        </div>
      )}
    </div>
  );
};

export default CombatPage;
