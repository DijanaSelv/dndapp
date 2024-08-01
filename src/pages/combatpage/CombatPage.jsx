import { ref, onValue } from "firebase/database";
import { db } from "../../app/actions/base";
import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { CombatRollWrapper } from "../../components/CombatRollWrapper";
import { Button } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { addRolltoCombat } from "../../app/actions/databaseActions";

const CombatPage = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const campaignId = params.campaignId;
  const uid = params.uid;
  const [combatData, setCombatData] = useState({});

  //TODO: refactor this, put some of the info in the params url primer userId in play, and character if there is one. Ako params nema character togash render neshto ko: please addd a character to hte campaign to join combat.
  /*   const characterId = useSelector(
    (state) => state.campaignSlice.currentCampaign.members[uid].character
  );
  const characterName = useSelector(
    (state) => state.userSlice.characters[characterId].name
  ); */

  //if there is not character for this member do not render buttons to roll, instead a button to add a character. They can still view the rolls and combat.

  const rollDiceHandler = () => {
    const randomd20 = Math.floor(Math.random() * (20 - 1) + 1);
    console.log(randomd20);
    const character = "djane";
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
      <Button onClick={rollDiceHandler}> Roll Dice </Button>
    </div>
  );
};

export default CombatPage;
