import { Card } from "antd";
import { getItems } from "../app/actions/dndApiActions";

import cssClasses from "../pages/newcharacterpage/NewCharacterPage.module.css";
import { useState } from "react";

const SpellCard = ({ spell, classInput }) => {
  /* const [content, setContent] = useState(
    <Card className={cssClasses.spellCard} title="title">
      {" "}
      <p>Loading spell...</p>
    </Card>
  );

  const getSpellInfo = async () => {
    try {
      const spellData = await getItems(spell.url);
      console.log(spellData);

      setContent(
        <Card title={spellData.name} className={cssClasses.spellCard}>
          <p>
            {spellData.level == 0 ? "cantrip" : `lvl ${spellData.level}`}{" "}
            {spellData.school.index}
          </p>
          <p>{spellData.desc[0]}</p>
          <p>It's been fetched.</p>
          <p></p>
        </Card>
      );

    } catch (error) {
      content = (
        <Card title={spell.value} key={spell.value}>
          {" "}
          <p>Spell could not be found...</p>
        </Card>
      );
    }
  };

  getSpellInfo(); */

  return (
    <Card className={cssClasses.spellCard} title={spell.name}>
      {" "}
      <p>Loading spell...</p>
    </Card>
  );
};

export default SpellCard;

/* 

<Card title={spellData.name} className={cssClasses.spellCard}>
              <p>
                {spellData.level == 0 ? "cantrip" : `lvl ${spellData.level}`}{" "}
                {spellData.school.index}
              </p>
              <p>{spellData.desc[0]}</p>
              <p>It's been fetched.</p>
              <p></p>
            </Card>

*/
