import React, { useEffect, useState } from "react";
import { Form, Checkbox, Progress, Collapse, Tooltip } from "antd";
import cssClasses from "../pages/newcharacterpage/NewCharacterPage.module.css";
import SpellCard from "./SpellCard";
import { getItems } from "../app/actions/dndApiActions";
import {
  SPELL_SLOTS,
  SPELLS_AVAILABLE,
  SPELLS_INSTRUCTION,
} from "../app/STATIC_SPELL_LEVELS";
import { useForm } from "antd/es/form/Form";
import { isDifferentPointerPosition } from "@testing-library/user-event/dist/cjs/system/pointer/shared.js";
import { isDisabled } from "@testing-library/user-event/dist/cjs/utils/index.js";

const SpellsFormData = ({
  spells,
  classInput,
  levelInput,
  getFieldValue,
  wisdomInput,
  charismaInput,
}) => {
  const [form] = useForm();
  const [spellsData, setSpellsData] = useState([]);
  const [fetchedSpells, setFetchedSpells] = useState([]);
  const [loading, setLoading] = useState(true);
  const [spellsAllowed, setSpellsAllowed] = useState(0);
  const [canSelectMoreSpells, setCanSelectMoreSpells] = useState(true);
  const [selectedSpells, setSelectedSpells] = useState([]);

  const [content, setContent] = useState(
    <p>Please select a class for your character.</p>
  );

  const getSpellData = async (spell) => {
    try {
      const spellData = await getItems(spell.url);
      return spellData;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  /* ~~~~~~~~~~~~~~fetch spells the first time only */
  useEffect(() => {
    const fetchSpellsData = async () => {
      setLoading(true);
      //deal with all promises as one
      const spellsArray = await Promise.all(
        spells.map((spell) => getSpellData(spell))
      );
      setSpellsData(spellsArray);
      setLoading(false);
    };
    spells.length > 0 && fetchSpellsData();
  }, [spells]);

  /* ~~~~~~~~~~~~~~~~~~~~~~~~change content according to what has been selected */
  useEffect(() => {
    // 1. there is a selected class that is a spellcaster
    if (
      classInput &&
      !["barbarian", "fighter", "monk", "rogue"].includes(classInput) &&
      spellsData.length > 0
    ) {
      //filter them by whether they apply for the selected class.
      setLoading(true);
      const validSpellsArray = spellsData.filter((spell) => {
        const classesList = spell.classes.map((cls) => cls.index);
        return classesList.includes(classInput);
      });

      const classInstructions = SPELLS_INSTRUCTION[classInput];
      //get spell slots for that class
      const classSpellSlots = SPELL_SLOTS[classInput];

      /*       if (["bard", "sorcerer", "ranger", "wizard"].includes(classInput)) {
        numberOfSpellsAllowed = SPELLS_AVAILABLE[classInput][levelInput - 1];
      } else if (["druid", "cleric", " bard"].includes(classInput)) {
        const wisMod = Math.floor((wisdomInput - 10) / 2);
        numberOfSpellsAllowed = levelInput + wisMod;
      } else if (classInput === "paladin") {
        const charMod = Math.floor((charismaInput - 10) / 2);
        numberOfSpellsAllowed = charMod + Math.floor(levelInput / 2) || 1;
      } else if (classInput === "warlock") {
        numberOfSpellsAllowed = SPELL_SLOTS["warlock"].levelInput[1];
      } */

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
      setFetchedSpells(leveledArray);

      //TODO: limit number of selectable spells per level

      setLoading(false);

      const collapseItems = Object.keys(leveledArray).map((lvl) => ({
        key: `${lvl}`,
        label: `${lvl == 0 ? `Cantrips` : `Level ${lvl}`}`,
        children: leveledArray[lvl] && (
          <Form.Item name={`spells${lvl}`} label="Spells:">
            <Checkbox.Group
              className={cssClasses.spellsGroupContainer}
              options={leveledArray[lvl].map((spell) => ({
                label: <SpellCard spell={spell} />,
                value: spell.index,
                disabled:
                  lvl != 0 &&
                  !selectedSpells.includes(spell.index) &&
                  !canSelectMoreSpells,
              }))}
              onClick={(spell) => {
                console.log(selectedSpells);
                console.log(selectedSpells.includes(spell.index));
              }}
              onChange={(values) => onValuesChangeHandler(values, lvl)}
            />
          </Form.Item>
        ),
      }));

      setContent(
        <>
          <p>{classInstructions}</p>
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
      setContent(<p>The class you selected is not a spellcaster.</p>);
    }
  }, [
    classInput,
    levelInput,
    spellsData,
    wisdomInput,
    charismaInput,
    selectedSpells,
  ]);

  useEffect(() => {
    if (classInput) {
      if (["bard", "sorcerer", "ranger", "wizard"].includes(classInput)) {
        setSpellsAllowed(SPELLS_AVAILABLE[classInput][levelInput - 1]);
      } else if (["druid", "cleric", " bard"].includes(classInput)) {
        const wisMod = Math.floor((wisdomInput - 10) / 2);

        setSpellsAllowed(levelInput + wisMod);
      } else if (classInput === "paladin") {
        const charMod = Math.floor((+charismaInput - 10) / 2);
        setSpellsAllowed(charMod + Math.floor(levelInput / 2) || 1);
      } else if (classInput === "warlock") {
        setSpellsAllowed(SPELL_SLOTS["warlock"].levelInput[1]);
      }

      setCanSelectMoreSpells(true);
    }
  }, [classInput, wisdomInput, charismaInput, levelInput]);

  //LIMIT number of spells that can be selected
  const onValuesChangeHandler = (values, lvl) => {
    //find how many spells have been selected (excluding cantrips )

    const selectedSpells = Object.keys(fetchedSpells)
      .slice(1)
      .map((level) => getFieldValue(`spells${level}`))
      .flat();
    setSelectedSpells(selectedSpells);

    const selectedSpellsCount = selectedSpells.length;

    setCanSelectMoreSpells(selectedSpellsCount < spellsAllowed);
  };

  /*   const onClickHandler = (e) => {
    console.log(spellsAllowed, canSelectMoreSpells);
     if (!canSelectMoreSpells) {
      e.preventDefault();
    }
  }; */

  return (
    <>
      {loading &&
      classInput &&
      !["barbarian", "fighter", "monk", "rogue"].includes(classInput) ? (
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
