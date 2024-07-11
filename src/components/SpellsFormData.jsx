import React, { useEffect, useState } from "react";
import { Form, Checkbox, Progress, Collapse } from "antd";
import cssClasses from "../pages/newcharacterpage/NewCharacterPage.module.css";
import SpellCard from "./SpellCard";
import { getItems } from "../app/actions/dndApiActions";
import {
  SPELL_SLOTS,
  SPELLS_AVAILABLE,
  SPELLS_INSTRUCTION,
} from "../app/STATIC_SPELL_LEVELS";

const SpellsFormData = ({
  spells,
  classInput,
  levelInput,
  getFieldValue,
  wisdomInput,
  charismaInput,
}) => {
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
      setLoading(false);

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
                  lvl != 0 &&
                  !selectedSpells.includes(spell.index) &&
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
              <div>Cantrips available:</div>
              <div className={cssClasses.countNumbers}>0 / 3</div>
              <div>Spells available:</div>
              <div>{`${selectedSpells.length} / ${spellsAllowed}`}</div>
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
      setContent(<p>The class you selected is not a spellcaster.</p>);
    }
  }, [
    classInput,
    levelInput,
    spellsData,
    wisdomInput,
    charismaInput,
    selectedSpells,
    canSelectMoreSpells,
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

  console.log(fetchedSpells, "fetched spells");
  //LIMIT number of spells that can be selected
  const onValuesChangeHandler = (values, lvl, leveledSpells) => {
    //leveled spells are passed because fetchedSpells are not updated here the first click (this function is technically asynch finction and uses previous render before fetched spells was updated i zato e ova problem.)
    const spellsList = Object.keys(leveledSpells)
      .slice(1)
      .map((level) => getFieldValue(`spells${level}`))
      .flat()
      .filter((spell) => spell !== undefined);

    const selectedSpellsCount = spellsList.length;
    setSelectedSpells(spellsList);

    setCanSelectMoreSpells(selectedSpellsCount < spellsAllowed);
  };

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
