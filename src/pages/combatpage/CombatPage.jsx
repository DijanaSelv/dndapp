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
    console.log(randomd20);
    const character = characterName;
    const type = "d20";
    const content = randomd20;
    dispatch(addRolltoCombat(campaignId, type, character, content));
  };

  //get value on change
  useEffect(() => {
    const combatDataRef = ref(db, "campaigns/" + campaignId + "/combat");

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
    <div>
      <header>Combat rolls</header>
      <div>
        {combatData &&
          Object.values(combatData).map((roll, i) => (
            <CombatRollWrapper
              key={i}
              character={roll.character}
              type={roll.type}
              content={roll.content}
            />
          ))}
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
