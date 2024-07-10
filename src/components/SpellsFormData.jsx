import React, { useEffect, useState } from "react";
import { Form, Checkbox, Progress, Collapse } from "antd";
import cssClasses from "../pages/newcharacterpage/NewCharacterPage.module.css";
import SpellCard from "./SpellCard";
import { getItems } from "../app/actions/dndApiActions";
import { SPELL_SLOTS, SPELLS_INSTRUCTION } from "../app/STATIC_SPELL_LEVELS";

const SpellsFormData = ({ spells, classInput, levelInput }) => {
  const [spellsData, setSpellsData] = useState([]);
  const [fetchedSpells, setFetchedSpells] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSpells, setSelectedSpells] = useState({
    cantrips: 0,
    spells: 0,
  });

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

      //TODO: limit number of selectable spells per level

      setLoading(false);

      const collapseItems = Object.keys(leveledArray).map((lvl) => ({
        key: `${lvl}`,
        label: `${lvl == 0 ? `Cantrips` : `Level ${lvl}`}`,
        children: leveledArray[lvl] && (
          <>
            <Checkbox.Group
              className={cssClasses.spellsGroupContainer}
              options={leveledArray[lvl].map((spell) => ({
                label: <SpellCard spell={spell} />,
                value: spell.index,
              }))}
              /* onClick={(values) => onChangeHandler(values, lvl)} */
              /* onChange={(values) => onChangeHandler(values, lvl)} */
            />
          </>
        ),
      }));

      setContent(
        <>
          <p>{classInstructions}</p>
          <Form.Item name="spells" label="Spells:">
            <Collapse
              items={collapseItems}
              className={cssClasses.spellCollapseComponent}
            />
          </Form.Item>
        </>
      );
    }

    //2/ the class is not a spellcaster.
    if (
      classInput &&
      ["barbarian", "fighter", "monk", "rogue"].includes(classInput)
    ) {
      setContent(<p>The class you selected is not a spellcaster.</p>);
    }
  }, [spells, classInput, levelInput, spellsData]);

  //LIMIT number of spells that can be selected
  const onChangeHandler = (e, lvl) => {
    e.preventDefault();
    /* e.target.closest; */
    e.target.className += `${cssClasses.spellsFull}`;
    if (lvl == 0) {
      /* const selectedCantrips = values.length;
      setSelectedSpells((prev) => ({ ...prev, cantrips: selectedCantrips })); */
    } else {
      /*  e.target.checked = false; */
    }
    /* console.log(e.target, lvl); */
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
