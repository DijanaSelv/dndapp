import { Card } from "antd";
import cssClasses from "../pages/newcharacterpage/NewCharacterPage.module.css";
import { motion } from "framer-motion";

const SpellCard = ({ spell }) => {
  return (
    <motion.div className={cssClasses.motionWrapper} whileTap={{ scale: 1.01 }}>
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
        <div>
          <div className={cssClasses.spellSpecContainer}>
            <span>casting time: </span>
            <span>{spell["casting_time"]}</span>
          </div>
          <div className={cssClasses.spellSpecContainer}>
            <span>range: </span>
            <span>{spell["range"]}</span>
          </div>
          <div className={cssClasses.spellSpecContainer}>
            <span>duration: </span>
            <span>{spell["duration"]}</span>
          </div>
          <div className={cssClasses.spellSpecContainer}>
            <span>components: </span>
            <span>{spell.components.join()}</span>
          </div>
        </div>
        <div className={cssClasses.cardDescriptionContainer}>
          <div>
            {spell.desc.map((line) => (
              <>
                {line}
                <br />
              </>
            ))}
          </div>
          {spell["higher_level"].length ? (
            <p className={cssClasses.higherLevel}>
              Higher level: {spell["higher_level"]}
            </p>
          ) : (
            ""
          )}
        </div>
      </Card>
    </motion.div>
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
