import React, { useEffect, useState } from "react";
import { Form, Checkbox, Progress, Collapse } from "antd";
import cssClasses from "../pages/newcharacterpage/NewCharacterPage.module.css";
import SpellCard from "./SpellCard";
import { getItems } from "../app/actions/dndApiActions";

const SpellsFormData = ({ spells, classInput }) => {
  const [fetchedSpells, setFetchedSpells] = useState([]);
  const [loading, setLoading] = useState(true);

  const getSpellData = async (spell) => {
    try {
      const spellData = await getItems(spell.url);
      return spellData;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  useEffect(() => {
    const fetchSpellsData = async () => {
      setLoading(true);
      //deal with all promises as one
      const spellsArray = await Promise.all(
        spells.map((spell) => getSpellData(spell))
      );
      //filter them by whether they apply for the selected class
      const validSpellsArray = spellsArray.filter((spell) => {
        const classesList = spell.classes.map((cls) => cls.index);
        return classesList.includes(classInput);
      });

      //create 9 new arrays for each spell lvl
      const levelOneSpells = validSpellsArray.filter(
        (spell) => spell.level === 1
      );
      const levelTwoSpells = validSpellsArray.filter(
        (spell) => spell.level === 2
      );
      const levelThreeSpells = validSpellsArray.filter(
        (spell) => spell.level === 3
      );
      const levelFourSpells = validSpellsArray.filter(
        (spell) => spell.level === 4
      );
      const levelFiveSpells = validSpellsArray.filter(
        (spell) => spell.level === 5
      );
      const levelSixSpells = validSpellsArray.filter(
        (spell) => spell.level === 6
      );
      const levelSevenSpells = validSpellsArray.filter(
        (spell) => spell.level === 7
      );
      const levelEightSpells = validSpellsArray.filter(
        (spell) => spell.level === 8
      );
      const levelNineSpells = validSpellsArray.filter(
        (spell) => spell.level === 9
      );

      // design the cards

      //calculate the available spell slots of the character

      // display available slots for the player

      //limit number of selectable spells per level

      //update state with sorted spells
      setFetchedSpells({
        1: levelOneSpells,
        2: levelTwoSpells,
        3: levelThreeSpells,
        4: levelFourSpells,
        5: levelFiveSpells,
        6: levelSixSpells,
        7: levelSevenSpells,
        8: levelEightSpells,
        9: levelNineSpells,
      });
      setLoading(false);
    };

    fetchSpellsData();
  }, [spells, classInput]);

  //create a checkbox group for each level of spells
  const collapseItems = Object.keys(fetchedSpells).map((lvl) => ({
    key: `${lvl}`,
    label: `Level ${lvl}`,
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
