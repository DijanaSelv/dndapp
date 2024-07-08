import { Card } from "antd";
import { getItems } from "../app/actions/dndApiActions";

import cssClasses from "../pages/newcharacterpage/NewCharacterPage.module.css";
import { useState } from "react";
import Meta from "antd/es/card/Meta";

const SpellCard = ({ spell }) => {
  return (
    <Card
      className={cssClasses.spellCard}
      title={spell.name}
      extra={<p>{spell.school.index}</p>}
      onClick={() => console.log(spell)}
      size="small"
    >
      {/*  <Meta
        description={
          <p>
            {spell.level == 0 ? "cantrip" : `lvl ${spell.level}`}{" "}
            {spell.school.index}
          </p>
        }
      />{" "} */}
      <div className={cssClasses.spellSpecsContainer}>
        <span>casting time: </span>
        <span>{spell["casting_time"]}</span>
      </div>
      <div className={cssClasses.spellSpecsContainer}>
        <span>range: </span>
        <span>{spell["range"]}</span>
      </div>
      <div className={cssClasses.spellSpecsContainer}>
        <span>duration: </span>
        <span>{spell["duration"]}</span>
      </div>
      <div className={cssClasses.spellSpecsContainer}>
        <span>components: </span>
        <span>{spell.components.join()}</span>
      </div>
      <div>
        {spell.desc.map((line) => (
          <>
            {line}
            <br />
          </>
        ))}
      </div>
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
