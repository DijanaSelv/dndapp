import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";

import { db } from "../../app/actions/base";
import { ref, onValue } from "firebase/database";
import {
  addRolltoCombat,
  addToInitiative,
  removeFromInitiative,
  reorderInitiative,
} from "../../app/actions/databaseActions";

import { Button, Checkbox, Divider } from "antd";
import classes from "./CombatPage.module.css";
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
  faTrashCan,
} from "@fortawesome/free-regular-svg-icons";

//dice icons for the buttons
import d10 from "../../icons/dice-d10.png";
import d12 from "../../icons/dice-d12.png";
import d8 from "../../icons/dice-d8.png";
import d6 from "../../icons/dice-d6.png";
import d4 from "../../icons/dice-d4.png";

import { CombatRollWrapper } from "../../components/CombatRollWrapper";
import { AddCharacterToCampaignModal } from "../../components/AddCharacterToCampaignModal";

const CombatPage = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const campaignId = params.campaignId;
  const uid = params.uid;

  const chatEndRef = useRef();
  const textInputRef = useRef();
  const initiativeInputRef = useRef("");
  const [dragItemKey, setDragItemKey] = useState();
  const [dragOverItemKey, setDragOverItemKey] = useState();

  const [textInput, setTextInput] = useState();
  const [combatData, setCombatData] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [rollData, setRollData] = useState({
    numberOfDice: 1,
    additionalModifiers: 0,
    guidance: false,
    rollTwoDice: false,
  });
  const [showAddToInitiativeInput, setShowAddToInitiativeInput] =
    useState(false);
  const [addToInitiativeValue, setAddToInitiativeValue] = useState("");

  const isLoading = useSelector((state) => state.uiSlice.isLoading);
  const characterId = useSelector(
    (state) =>
      state.campaignSlice?.currentCampaign?.members[uid]?.character || ""
  );
  let characterName = useSelector(
    (state) =>
      (characterId && state.userSlice?.user.characters[characterId]?.name) || ""
  );
  const { dm, loremaster } = useSelector((state) => state.rolesSlice);

  if (dm && !characterName) {
    characterName = "DM";
  }
  /* ```````````````````HANDLERS   */
  /* drag initiative list items  */
  const handleDragStart = (key) => {
    setDragItemKey(key);
  };
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    //reorder initiative items
    if (dragItemKey && dragOverItemKey) {
      const draggedKey = Number(dragItemKey);
      const targetKey = Number(dragOverItemKey);
      const valuesOrder = Object.values(combatData.initiative);
      const [dragItem] = valuesOrder.splice(draggedKey, 1);

      valuesOrder.splice(targetKey, 0, dragItem);

      const updatedInitiativeOrder = {};
      valuesOrder.forEach(
        (value, index) => (updatedInitiativeOrder[index] = value)
      );
      dispatch(reorderInitiative(updatedInitiativeOrder, campaignId));
    }
  };

  const handleDragEnter = (key) => {
    //new position
    setDragOverItemKey(key);
  };

  const handleDragLeave = (e) => {
    setDragOverItemKey(undefined);
  };

  const handleDragEnd = (e) => {
    setDragItemKey(undefined);
    setDragOverItemKey(undefined);
  };

  const addCharacterHandler = () => {
    setShowModal(true);
  };

  //Add list item to initiative
  const showAddToInitiativeHandler = () => {
    setShowAddToInitiativeInput(true);
    //makes sure the element is added to the dom first
    setTimeout(() => {
      initiativeInputRef.current.focus();
    }, 0);
  };

  const keyDownInitiativeHandler = (e) => {
    if (e.code === "Escape") {
      setShowAddToInitiativeInput(false);
    }
    if ((e.code === "Enter" || e.code === "NumpadEnter") && e.target.value) {
      const key = combatData?.initiative
        ? Object.keys(combatData?.initiative).length
        : 0;
      console.log(key);
      dispatch(addToInitiative(e.target.value, key, campaignId));
      setAddToInitiativeValue("");
      initiativeInputRef.current.focus();
    }
  };

  const addToInitiativeValueHandler = (e) => {
    setAddToInitiativeValue(e.target.value);
  };

  const removeInitiativeInputHandler = (e) => {
    if (e.target !== initiativeInputRef.current) {
      setShowAddToInitiativeInput(false);
      setAddToInitiativeValue("");
    }
  };

  const removeFromInitiativeHandler = (key) => {
    dispatch(removeFromInitiative(key, campaignId));
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

      if (content) {
        dispatch(
          addRolltoCombat(campaignId, type, character, content, uid, null)
        );
      }
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

  /* ``````````````````````````` */

  //performs layout measurements before the browser repaints the screen (scroll to bottom did not include the last message otherwise). Use effect runs acync, this one runs sunch after dom mutations.
  useLayoutEffect(() => {
    scrollToBottom();
  }, [combatData]);

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
    <div className={classes.combatContent}>
      <h2>Combat chat</h2>
      {characterId ||
        (dm && (
          <div className={classes.playingAsDiv}>
            Playing as: <span>{characterName}</span>{" "}
          </div>
        ))}
      {combatData && !isLoading && (
        <div
          className={classes.chatWrapper}
          onMouseDown={removeInitiativeInputHandler}
        >
          <div className={classes.initiativeBar}>
            <h4 className={classes.barTitle}>Initiative</h4>
            <ol>
              {combatData?.initiative &&
                Object.keys(combatData.initiative).map((key) => (
                  <li
                    draggable={dm || loremaster}
                    key={key}
                    onDragStart={(e) =>
                      (dm || loremaster) && handleDragStart(key)
                    }
                    onDragOver={(e) => handleDragOver(e)}
                    onDrop={() => handleDrop(key)}
                    onDragEnter={() => handleDragEnter(key)}
                    onDragLeave={() => handleDragLeave(key)}
                    onDragEnd={handleDragEnd}
                  >
                    {combatData.initiative[key]}{" "}
                    {(dm || loremaster) && (
                      <FontAwesomeIcon
                        icon={faTrashCan}
                        onClick={() => removeFromInitiativeHandler(key)}
                      />
                    )}
                  </li>
                ))}
              {!showAddToInitiativeInput && (dm || loremaster) && (
                <li
                  className={classes.addToInitiative}
                  onClick={showAddToInitiativeHandler}
                >
                  + add
                </li>
              )}
              {showAddToInitiativeInput && (
                <input
                  className={classes.addToInitiativeInput}
                  placeholder="type a name"
                  onKeyDown={keyDownInitiativeHandler}
                  onChange={addToInitiativeValueHandler}
                  ref={initiativeInputRef}
                  value={addToInitiativeValue}
                ></input>
              )}
            </ol>
          </div>

          <div className={classes.messagesBar}>
            <div className={classes.messagesWrapper}>
              {combatData?.messages &&
                Object.values(combatData.messages).map((roll, i) => (
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
          <div className={classes.buttonsBar}>
            <h4 className={classes.barTitle}>Roll Some Dice!</h4>
            {!characterId && !dm && (
              <div className={classes.messageWrapper}>
                <p>Please add a character to this campaign to join combat.</p>
                <Divider />
                <p>
                  You can still spectate and send text messages but you won't be
                  able to roll without a character.
                </p>
                <Divider />
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
            {(characterId || dm || loremaster) && (
              <>
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
                    <Checkbox
                      onClick={guidanceHandler}
                      checked={rollData.guidance}
                    >
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

                  <div
                    className={`${classes.buttonsGroup} ${classes.diceButtons}`}
                  >
                    <Button onClick={() => rollDiceHandler(12)}>
                      <p>
                        <img
                          className={classes.diceIcon}
                          width="26px"
                          src={d12}
                        />
                      </p>
                      <p>d12</p>
                    </Button>
                    <Button onClick={() => rollDiceHandler(10)}>
                      <p>
                        <img
                          className={classes.diceIcon}
                          width="26px"
                          src={d10}
                        />
                      </p>
                      <p>d10</p>
                    </Button>
                    <Button onClick={() => rollDiceHandler(8)}>
                      <p>
                        <img
                          className={classes.diceIcon}
                          width="26px"
                          src={d8}
                        />
                      </p>
                      <p>d8</p>
                    </Button>
                    <Button onClick={() => rollDiceHandler(6)}>
                      <p>
                        <img
                          className={classes.diceIcon}
                          width="26px"
                          src={d6}
                        />
                      </p>
                      <p>d6</p>
                    </Button>
                    <Button onClick={() => rollDiceHandler(4)}>
                      <p>
                        <img
                          className={classes.diceIcon}
                          width="26px"
                          src={d4}
                        />
                      </p>
                      <p>d4</p>
                    </Button>
                    <Button onClick={() => rollDiceHandler(100)}>
                      <p>
                        <img
                          className={classes.diceIcon}
                          width="26px"
                          src={d10}
                        />
                        <img
                          className={classes.diceIcon}
                          width="26px"
                          src={d10}
                        />
                      </p>
                      <p>d100</p>
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CombatPage;
