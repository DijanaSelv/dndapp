import React, { useEffect, useState } from "react";
import { Form, Checkbox, Progress, Collapse } from "antd";
import cssClasses from "../pages/newcharacterpage/NewCharacterPage.module.css";
import SpellCard from "./SpellCard";
import { getItems } from "../app/actions/dndApiActions";
import { SPELL_SLOTS } from "../app/STATIC_SPELL_LEVELS";

const SpellsFormData = ({ spells, classInput, levelInput }) => {
  const [spellsData, setSpellsData] = useState([]);
  const [fetchedSpells, setFetchedSpells] = useState([]);
  const [loading, setLoading] = useState(true);
  //get spell slots for that class
  const classSpellSlots = SPELL_SLOTS[classInput];
  //se what the max level of spells is for this class and selected level (-1 because cantrip is first in the array)
  const spellLevelsAvailable = classSpellSlots[levelInput].length - 1;
  /*   console.log(classSpellSlots, spellLevelsAvailable);
   */
  const getSpellData = async (spell) => {
    try {
      const spellData = await getItems(spell.url);
      return spellData;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  //fetch the spells from the api
  console.log(spellsData);

  useEffect(() => {
    const fetchSpellsData = async () => {
      setLoading(true);
      //deal with all promises as one
      const spellsArray = await Promise.all(
        spells.map((spell) => getSpellData(spell))
      );
      setSpellsData(spellsArray);
      console.log("spells fetched");
      setLoading(false);
    };
    fetchSpellsData();
  }, [spells]);

  useEffect(() => {
    if (classInput && spellsData.length > 0) {
      //filter them by whether they apply for the selected class.

      setLoading(true);
      const validSpellsArray = spellsData.filter((spell) => {
        const classesList = spell.classes.map((cls) => cls.index);
        return classesList.includes(classInput);
      });

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

      // design the cards

      //limit number of selectable spells per level

      setLoading(false);
    }
  }, [spells, classInput, levelInput, spellsData]);

  //create a checkbox group for each level of spells

  const collapseItems = Object.keys(fetchedSpells).map((lvl) => ({
    key: `${lvl}`,
    label: `${lvl == 0 ? `Cantrips` : `Level ${lvl}`}`,
    children: fetchedSpells[lvl] && (
      <>
        <Checkbox.Group
          className={cssClasses.spellsGroupContainer}
          options={fetchedSpells[lvl].map((spell) => ({
            label: <SpellCard spell={spell} />,
            value: spell.index,
          }))}
        />
      </>
    ),
  }));

  return (
    <>
      {loading ? (
        <>
          <p className={cssClasses.pageInfo}>Loading...</p>
          <Progress
            percent={100}
            status="active"
            showInfo={false}
            size="small"
            strokeColor={{ from: "#108ee9", to: "#87d068" }}
          />
        </>
      ) : (
        <Form.Item name="spells" label="Spells:">
          <Collapse items={collapseItems} />
        </Form.Item>
      )}
    </>
  );
};

export default SpellsFormData;
