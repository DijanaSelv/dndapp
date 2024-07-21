import React, { useEffect, useState } from "react";
import { Form, Checkbox, Progress, Collapse } from "antd";
import cssClasses from "../pages/newcharacterpage/NewCharacterPage.module.css";
import SpellCard from "./SpellCard";
import {
  SPELL_SLOTS,
  SPELLS_AVAILABLE,
  SPELLS_INSTRUCTION,
} from "../app/STATIC_SPELL_LEVELS";

const SpellsFormData = ({
  spellsData,
  classInput,
  levelInput,
  getFieldValue,
  wisdomInput,
  charismaInput,
}) => {
  const [spellsAllowed, setSpellsAllowed] = useState(0);
  const [canSelectMoreSpells, setCanSelectMoreSpells] = useState(true);
  const [selectedSpells, setSelectedSpells] = useState([]);

  const [cantripsAllowed, setCantripsAllowed] = useState(0);
  const [canSelectMoreCantrips, setCanSelectMoreCantrips] = useState(true);
  const [selectedCantrips, setSelectedCantrips] = useState([]);
  const [content, setContent] = useState(
    <p className={cssClasses.messageWrapper}>
      Please select a class for your character.
    </p>
  );

  /* ~~~~~~~~~~~~~~~~~~~~~~~~change content according to what has been selected */
  useEffect(() => {
    // 1. there is a selected class that is a spellcaster
    if (
      classInput &&
      !["barbarian", "fighter", "monk", "rogue"].includes(classInput) &&
      spellsData.length > 0
    ) {
      //filter them by whether they apply for the selected class.

      const validSpellsArray = spellsData.filter((spell) => {
        const classesList = spell.classes.map((cls) => cls.index);
        return classesList.includes(classInput);
      });

      const classInstructions = SPELLS_INSTRUCTION[classInput];
      //get spell slots for that class
      const classSpellSlots = SPELL_SLOTS[classInput];

      //se what the max level of spells is for this class and selected level (-1 because cantrip is first in the array) for warlock is stored differently
      const spellLevelsAvailable =
        classInput === "warlock"
          ? classSpellSlots[levelInput][3]
          : classSpellSlots[levelInput].length - 1;

      //create 9 new arrays for each spell lvl
      const leveledArray = validSpellsArray.reduce((acc, current) => {
        const spellLevel = current.level || 0;
        if (!acc[spellLevel] && spellLevel <= spellLevelsAvailable) {
          acc[spellLevel] = [];
        }
        if (acc[spellLevel]) {
          acc[spellLevel].push(current);
        }
        return acc;
      }, {});

      //update state with sorted spells

      const collapseItems = Object.keys(leveledArray).map((lvl) => ({
        key: `${lvl}`,
        label: `${lvl == 0 ? `Cantrips` : `Level ${lvl}`}`,
        children: leveledArray[lvl] && (
          <Form.Item name={`spells${lvl}`}>
            <Checkbox.Group
              className={cssClasses.spellsGroupContainer}
              options={leveledArray[lvl].map((spell) => ({
                label: <SpellCard spell={spell} />,
                value: spell.index,
                disabled:
                  lvl == 0
                    ? !selectedCantrips.includes(spell.index) &&
                      !canSelectMoreCantrips
                    : !selectedSpells.includes(spell.index) &&
                      !canSelectMoreSpells,
              }))}
              onChange={(values) =>
                onValuesChangeHandler(values, lvl, leveledArray)
              }
            />
          </Form.Item>
        ),
      }));

      setContent(
        <>
          <div className={cssClasses.messageWrapper}>
            <h3 className={cssClasses.messageSubtitle}>
              Selected class: {classInput.toUpperCase()}
            </h3>
            <div className={cssClasses.messageContent}>{classInstructions}</div>
            <div className={cssClasses.messageContent}>
              You have a certain amount of cantrips and spells you can set for
              your character. As you level up you will be able to add more.
            </div>
          </div>
          <div className={cssClasses.spellCountInfoWrapper}>
            <div className={cssClasses.spellCountContent}>
              <div
                className={`${
                  selectedCantrips.length == cantripsAllowed &&
                  cssClasses.spellsFull
                }`}
              >
                {selectedCantrips.length == cantripsAllowed
                  ? "Cantrips full:"
                  : "Cantrips selected:"}
              </div>
              <div
                className={`${cssClasses.countNumbers} ${
                  selectedCantrips.length == cantripsAllowed &&
                  cssClasses.spellsFull
                }`}
              >{`${selectedCantrips.length} / ${cantripsAllowed}`}</div>
              <div
                className={` ${
                  selectedSpells.length == spellsAllowed &&
                  cssClasses.spellsFull
                }`}
              >
                {selectedSpells.length == spellsAllowed
                  ? "Spells full:"
                  : "Spells selected:"}
              </div>
              <div
                className={`${cssClasses.countNumbers} ${
                  selectedSpells.length == spellsAllowed &&
                  cssClasses.spellsFull
                }`}
              >{`${selectedSpells.length} / ${spellsAllowed}`}</div>
            </div>
          </div>
          <Collapse
            items={collapseItems}
            className={cssClasses.spellCollapseComponent}
          />
        </>
      );
    }

    //2. the class is not a spellcaster.
    else if (
      classInput &&
      ["barbarian", "fighter", "monk", "rogue"].includes(classInput)
    ) {
      setContent(
        <p className={cssClasses.messageWrapper}>
          The class you selected is not a spellcaster.
        </p>
      );
    }
  }, [
    classInput,
    levelInput,
    spellsData,
    wisdomInput,
    charismaInput,
    selectedSpells,
    canSelectMoreSpells,
    selectedCantrips,
    canSelectMoreCantrips,
    spellsAllowed,
  ]);

  useEffect(() => {
    if (classInput) {
      if (!["barbarian", "fighter", "monk", "rogue"].includes(classInput)) {
        if (["bard", "sorcerer", "ranger", "wizard"].includes(classInput)) {
          setSpellsAllowed(SPELLS_AVAILABLE[classInput][levelInput - 1]);
        } else if (["druid", "cleric", " bard"].includes(classInput)) {
          const wisMod = Math.floor((wisdomInput - 10) / 2);

          setSpellsAllowed(levelInput + wisMod);
        } else if (classInput === "paladin") {
          const charMod = Math.floor((+charismaInput - 10) / 2);
          setSpellsAllowed(charMod + Math.floor(levelInput / 2) || 1);
        } else if (classInput === "warlock") {
          setSpellsAllowed(SPELL_SLOTS["warlock"][levelInput][1]);
        }
        setCantripsAllowed(SPELL_SLOTS[classInput][levelInput][0]);
        setCanSelectMoreSpells(true);
      }
    }
  }, [classInput, wisdomInput, charismaInput, levelInput]);

  //LIMIT number of spells that can be selected
  const onValuesChangeHandler = (values, lvl, leveledSpells) => {
    //leveled spells are passed because fetchedSpells are not updated here the first click (this function is technically asynch finction and uses previous render before fetched spells was updated i zato e ova problem.)
    if (lvl == 0) {
      setSelectedCantrips(values);
      setCanSelectMoreCantrips(values.length < cantripsAllowed);
    } else {
      const spellsList = Object.keys(leveledSpells)
        .slice(1)
        .map((level) => getFieldValue(`spells${level}`))
        .flat()
        .filter((spell) => spell !== undefined);

      const selectedSpellsCount = spellsList.length;
      setSelectedSpells(spellsList);

      setCanSelectMoreSpells(selectedSpellsCount < spellsAllowed);
    }
  };

  return (
    <>
      {classInput &&
      !["barbarian", "fighter", "monk", "rogue"].includes(classInput) &&
      spellsData.length === 0 ? (
        <>
          <p className={cssClasses.pageInfo}>Loading spells...</p>
          <Progress
            percent={100}
            status="active"
            showInfo={false}
            size="small"
            strokeColor={{ from: "#108ee9", to: "#87d068" }}
          />
        </>
      ) : (
        content
      )}
    </>
  );
};

export default SpellsFormData;
