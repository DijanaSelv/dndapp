import { ref, onValue } from "firebase/database";
import { db } from "../../app/actions/base";
import { useParams } from "react-router";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { CombatRollWrapper } from "../../components/CombatRollWrapper";
import { Button, Checkbox, Divider, Input, InputNumber } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { addRolltoCombat } from "../../app/actions/databaseActions";

import classes from "./CombatPage.module.css";
import { AddCharacterToCampaignModal } from "../../components/AddCharacterToCampaignModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDiceD20,
  faMinusCircle,
  faPlus,
  faPlusCircle,
} from "@fortawesome/free-solid-svg-icons";
import TextArea from "antd/es/input/TextArea";
import {
  faFaceFrown,
  faFaceSmileBeam,
  faPaperPlane,
} from "@fortawesome/free-regular-svg-icons";

const CombatPage = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const campaignId = params.campaignId;
  const uid = params.uid;

  const chatEndRef = useRef();
  const textInputRef = useRef();
  const [textInput, setTextInput] = useState();
  const [combatData, setCombatData] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [rollData, setRollData] = useState({
    numberOfDice: 1,
    additionalModifiers: 0,
    guidance: false,
    rollTwoDice: false,
  });

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

  const enterHandler = (e) => {
    if (e.code === "Enter") {
      console.log(e.code === "Enter");
      rollDiceHandler("message");
    }
  };

  //manage text input for message
  const textInputHandler = (e) => {
    setTextInput(e.target.value);
  };

  const rollDiceHandler = (rollType) => {
    //send message
    if (rollType === "message") {
      const content = textInputRef.current.resizableTextArea.textArea.value;
      const type = rollType;
      const character = characterName;

      dispatch(
        addRolltoCombat(campaignId, type, character, content, uid, null)
      );
      setTextInput("");
    } else {
      //ROLL DICE
      let guidanceScore = 0;
      let additionalModifiers = Number(rollData.additionalModifiers);
      let rolledDiceScores;
      let diceSum;
      let totalScore;

      // 1 . roll d20 with disadv/adv
      if (rollData.rollTwoDice && rollType === 20) {
        rolledDiceScores = Array.from([
          Math.floor(Math.random() * (rollType - 1) + 1),
          Math.floor(Math.random() * (rollType - 1) + 1),
        ]);
        console.log(rolledDiceScores);
        diceSum =
          rollData.rollTwoDice === "advantage"
            ? Math.max(...rolledDiceScores)
            : Math.min(...rolledDiceScores);
      }

      //2. roll any dice any number of times without adv/disadv
      else {
        rolledDiceScores = Array.from({ length: rollData.numberOfDice }, () =>
          Math.floor(Math.random() * (rollType - 1) + 1)
        );
        diceSum = rolledDiceScores.reduce((acc, value) => acc + value, 0);
      }

      //calculate sum
      if (rollData.guidance) {
        //add guidance if there is one;
        guidanceScore = Math.floor(Math.random() * (4 - 1) + 1);
        diceSum += guidanceScore;
      }
      //add other modifiers
      totalScore = diceSum + additionalModifiers;

      //send data
      const character = characterName;
      const content = totalScore;
      const type = "roll";
      //some description on modifiers and rolls
      const details = `${
        rollData.rollTwoDice && rollType == 20
          ? `${rollData.rollTwoDice} (${rolledDiceScores.join(", ")})`
          : ""
      }  ${
        rollData.numberOfDice > 1
          ? `d${rollType}x${rollData.numberOfDice}(${rolledDiceScores.join(
              ", "
            )})`
          : `d${rollType}`
      }${rollData.guidance ? `, guidance(+${guidanceScore})` : ""}${
        rollData.additionalModifiers > 0 ? `, +${additionalModifiers}` : ""
      } `;

      dispatch(
        addRolltoCombat(campaignId, type, character, content, uid, details)
      );

      //RESET rollData state
      setRollData({
        numberOfDice: 1,
        additionalModifiers: 0,
        guidance: false,
        rollTwoDice: false,
      });
    }
  };

  const rollTwoDiceHandler = (value) => {
    if (rollData.rollTwoDice === value) {
      setRollData((prev) => ({ ...prev, rollTwoDice: false }));
    } else {
      setRollData((prev) => ({ ...prev, rollTwoDice: value }));
    }
  };

  const guidanceHandler = () => {
    if (rollData.guidance === false) {
      setRollData((prev) => ({ ...prev, guidance: true }));
    } else {
      setRollData((prev) => ({ ...prev, guidance: false }));
    }
  };

  const numberOfDiceHandler = (value) => {
    //Math max returns the largest value of both, which means if the first argument is less than one, it will set the value to 1
    const newValue = Math.max(rollData.numberOfDice + Number(value), 1);
    //can't use advantage or disadvantage if you roll more than one die
    const twoDiceCheck = newValue > 1 ? false : rollData.rollTwoDice;

    setRollData((prev) => ({
      ...prev,
      numberOfDice: newValue,
      rollTwoDice: twoDiceCheck,
    }));
  };

  const additionalModifiersHandler = (value) => {
    const newValue = rollData.additionalModifiers + Number(value);
    setRollData((prev) => ({ ...prev, additionalModifiers: newValue }));
  };

  //get all chat messages on change

  //scroll chat to bottom
  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  //performs layout measurements before the browser repaints the screen (scroll to bottom did not include the last message otherwise). Use effect runs acync, this one runs sunch after dom mutations.
  useLayoutEffect(() => {
    scrollToBottom();
  }, [combatData]);

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
        <div className={classes.initiativeBar}>
          <h4 className={classes.barTitle}>Initiative</h4>
          <ol>
            <li draggable>Ratka</li>
            <li>Pande</li>
            <li>Kire</li>
            <li>Slafka</li>
          </ol>
        </div>

        <div className={classes.messagesBar}>
          <div className={classes.messagesWrapper}>
            {combatData &&
              Object.values(combatData).map((roll, i) => (
                <CombatRollWrapper
                  key={i}
                  character={roll.character}
                  type={roll.type}
                  content={roll.content}
                  uid={roll.uid}
                  details={roll.details}
                />
              ))}
            <div ref={chatEndRef}></div>
          </div>
          <div className={classes.textInputWrapper}>
            <TextArea
              onKeyDown={enterHandler}
              maxLength={150}
              style={{
                resize: "none",
              }}
              ref={textInputRef}
              onChange={textInputHandler}
              value={textInput}
            />
            <FontAwesomeIcon
              icon={faPaperPlane}
              onClick={() => rollDiceHandler("message")}
            />
          </div>
        </div>
        {characterId && (
          <div className={classes.buttonsBar}>
            <h4 className={classes.barTitle}>Roll Some Dice!</h4>
            <div className={classes.buttonsGroup}>
              <Button onClick={() => rollDiceHandler(20)}>
                {" "}
                <FontAwesomeIcon icon={faDiceD20} />
                d20
              </Button>

              <div className={classes.checkboxGroup}>
                <Checkbox
                  onClick={() => rollTwoDiceHandler("advantage")}
                  checked={rollData.rollTwoDice === "advantage"}
                  disabled={rollData.numberOfDice > 1}
                >
                  Advantage <FontAwesomeIcon icon={faFaceSmileBeam} />
                </Checkbox>
                <Checkbox
                  onClick={() => rollTwoDiceHandler("disadvantage")}
                  checked={rollData.rollTwoDice === "disadvantage"}
                  disabled={rollData.numberOfDice > 1}
                >
                  Disadvantage <FontAwesomeIcon icon={faFaceFrown} />
                </Checkbox>
              </div>
            </div>

            <Divider />
            <div className={classes.buttonsGroup}>
              <p>Additional Modifiers</p>
              <div className={classes.modifiersGroup}>
                <FontAwesomeIcon
                  icon={faMinusCircle}
                  onClick={() => additionalModifiersHandler("-1")}
                />
                <div className={classes.numberInput}>
                  {rollData.additionalModifiers}
                </div>
                <FontAwesomeIcon
                  icon={faPlusCircle}
                  onClick={() => additionalModifiersHandler("+1")}
                />
              </div>
              <div className={classes.buttonsGroups}>
                <Checkbox onClick={guidanceHandler} checked={rollData.guidance}>
                  Guidance (+1d4)
                </Checkbox>
              </div>
            </div>
            <Divider />

            <div className={classes.allButtonsGroups}>
              <div className={classes.buttonsGroup}>
                <p>Number of Dice</p>
                <div className={classes.modifiersGroup}>
                  <FontAwesomeIcon
                    icon={faMinusCircle}
                    onClick={() => numberOfDiceHandler("-1")}
                  />
                  <div className={classes.numberInput}>
                    {rollData.numberOfDice}
                  </div>
                  <FontAwesomeIcon
                    icon={faPlusCircle}
                    onClick={() => numberOfDiceHandler("+1")}
                  />
                </div>
              </div>
              <Divider />

              <div className={`${classes.buttonsGroup} ${classes.diceButtons}`}>
                {" "}
                <Button onClick={() => rollDiceHandler(12)}> d12</Button>
                <Button onClick={() => rollDiceHandler(10)}> d10</Button>
                <Button onClick={() => rollDiceHandler(8)}> d8</Button>
                <Button onClick={() => rollDiceHandler(6)}> d6</Button>
                <Button onClick={() => rollDiceHandler(4)}> d4</Button>
                <Button onClick={() => rollDiceHandler(100)}> d100</Button>
              </div>
            </div>
          </div>
        )}
      </div>

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
