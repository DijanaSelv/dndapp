import { Card } from "antd";
import cssClasses from "../pages/newcharacterpage/NewCharacterPage.module.css";
import { motion } from "framer-motion";

const SpellCard = ({ spell }) => {
  return (
    <motion.div className={cssClasses.motionWrapper} whileTap={{ scale: 1.01 }}>
      <Card
        key={`card-${spell.index}`}
        className={cssClasses.spellCard}
        title={spell.name}
        extra={<p>{spell.school.index}</p>}
        /* onClick={() => console.log(spell)} */
        size="small"
      >
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
            {spell.desc.map((line, i) => (
              <div key={`${spell.index}-desc-${i}`}>
                {line}
                <br />
              </div>
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
