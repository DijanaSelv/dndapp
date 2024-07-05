import React, { useEffect, useState } from "react";
import { Form, Checkbox, Progress } from "antd";
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
      const spellsArray = await Promise.all(
        spells.map((spell) => getSpellData(spell))
      );
      const validSpellsArray = spellsArray.filter(
        (spell) => spell.class !== null
      );
      //filter them by whether they apply for the selected class

      //create 9 new arrays for each spell lvl

      //down render a new checkbox group for each spell lvl

      // design the cards

      //calculate the available spell slots of the character

      // display available slots for the player

      //limit number of selectable spells per level

      console.log(validSpellsArray);
      setFetchedSpells(validSpellsArray);
      setLoading(false);
    };

    fetchSpellsData();
  }, [spells, classInput]);

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
          <Checkbox.Group
            className={cssClasses.spellsGroupContainer}
            options={fetchedSpells.map((spell) => ({
              label: <SpellCard spell={spell} />,
              value: spell.index,
            }))}
          />
        </Form.Item>
      )}
    </>
  );
};

export default SpellsFormData;
