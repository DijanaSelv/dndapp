import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShield,
  faHeart,
  faCoins,
  faEye,
  faPersonRunning,
} from "@fortawesome/free-solid-svg-icons";
import classes from "./CharacterPage.module.css";

const CharacterPage = () => {
  return (
    <>
      <div className={classes.charInfoSection}>
        <h2 className={classes.sectionTitle}>
          {" "}
          Character Name <span>Race and class</span>
        </h2>
        <div className={classes.charInfoContent}>
          <img
            className={classes.charIcon}
            src="https://pics.craiyon.com/2023-10-07/7f7dddf8a3594e2289ef0b90ab1628cf.webp"
          ></img>
          <div className={classes.mainStats}>
            <div className={classes.statRow}>
              <div className={classes.singleStat}>
                <span className={classes.statLabel}>
                  <FontAwesomeIcon icon={faHeart} />
                  HP:
                </span>
                <span className={classes.statValue}>69</span>
              </div>
              <div className={classes.singleStat}>
                <span className={classes.statLabel}>
                  <FontAwesomeIcon icon={faShield} />
                  AC:
                </span>
                <span className={classes.statValue}>14</span>
              </div>
              <div className={classes.singleStat}>
                <span className={classes.statLabel}>
                  <FontAwesomeIcon icon={faCoins} />
                  Gold:
                </span>
                <span className={classes.statValue}>200gp</span>
              </div>
              <div className={classes.singleStat}>
                <span className={classes.statLabel}>
                  <FontAwesomeIcon icon={faPersonRunning} />
                  Initiative:
                </span>
                <span className={classes.statValue}>+4</span>
              </div>
              <div className={classes.singleStat}>
                <span className={classes.statLabel}>
                  <FontAwesomeIcon icon={faEye} />
                  Passive Perception:
                </span>
                <span className={classes.statValue}>12</span>
              </div>
            </div>
            {/* <div className={classes.statRow}>
              <div className={classes.singleStat}>
                <span className={classes.statLabel}>
                  <FontAwesomeIcon icon={faPersonRunning} />
                  Initiative:
                </span>
                <span className={classes.statValue}>+4</span>
              </div>
              <div className={classes.singleStat}>
                <span className={classes.statLabel}>
                  <FontAwesomeIcon icon={faEye} />
                  Passive Perception:
                </span>
                <span className={classes.statValue}>12</span>
              </div>
            </div> */}
          </div>
        </div>
      </div>
      <div className={classes.charInfoSection}>
        <h2 className={classes.sectionTitle}>
          Stats <span>Proficiency bonus: +4</span>
        </h2>

        <div>Strength</div>
        <div></div>
        <div>Dexterity</div>
        <div>Constitution</div>
        <div>Intelligence</div>
        <div>Wisdom</div>
        <div>Charisma</div>
      </div>
    </>
  );
};

export default CharacterPage;
