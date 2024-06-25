import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShield,
  faHeartPulse,
  faHeart,
  faCoins,
  faEye,
  faPersonRunning,
  faHandFist,
  faBullseye,
  faBrain,
  faLightbulb,
  faMasksTheater,
} from "@fortawesome/free-solid-svg-icons";

import { faCircleDot, faCircle } from "@fortawesome/free-regular-svg-icons";
import { Tooltip } from "antd";
import classes from "./CharacterPage.module.css";

const CharacterPage = () => {
  return (
    <>
      <div className={classes.charInfoSection}>
        <h2 className={classes.sectionTitle}>
          {" "}
          Slafko Janevski <span>Human Bard</span>
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
                <span className={classes.statValue}>200gp, 56sp, 5cp</span>
              </div>
            </div>
            <div className={classes.statRow}>
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
          </div>
        </div>
      </div>
      <div className={classes.charInfoSection}>
        <h2 className={classes.sectionTitle}>
          Ability Scores <span>Proficiency bonus: +4</span>
        </h2>

        <div className={classes.allStats}>
          <div className={`${classes.abilities} `}>
            <div className={classes.singleAbility}>
              <Tooltip title="athletics" trigger={"click"}>
                <p className={classes.abilityTitle}>
                  {" "}
                  <FontAwesomeIcon icon={faHandFist} />
                  Strength
                </p>
              </Tooltip>
              <div className={classes.abilityCircle}>
                {" "}
                <div className={classes.abilityScore}>10</div>
                <div className={classes.modifierScore}>+0</div>
              </div>
            </div>
            <div className={classes.singleAbility}>
              <Tooltip
                title={
                  <>
                    acrobatics
                    <br />
                    sleight of hand
                    <br />
                    stealth
                  </>
                }
                trigger={"click"}
              >
                <p className={classes.abilityTitle}>
                  {" "}
                  <FontAwesomeIcon icon={faBullseye} /> Dexterity
                </p>
              </Tooltip>
              <div className={classes.abilityCircle}>
                {" "}
                <div className={classes.abilityScore}>16</div>
                <div className={classes.modifierScore}>+3</div>
              </div>
            </div>
            <div className={classes.singleAbility}>
              <Tooltip title={<>endurance</>} trigger={"click"}>
                <p className={classes.abilityTitle}>
                  {" "}
                  <FontAwesomeIcon icon={faHeartPulse} />
                  Constitution
                </p>
              </Tooltip>
              <div className={classes.abilityCircle}>
                {" "}
                <div className={classes.abilityScore}>15</div>
                <div className={classes.modifierScore}>+3</div>
              </div>
            </div>
            <div className={classes.singleAbility}>
              <Tooltip
                title={
                  <>
                    arcana
                    <br />
                    history
                    <br />
                    investigation
                    <br />
                    nature
                    <br />
                    religion
                  </>
                }
                trigger={"click"}
              >
                <p className={classes.abilityTitle}>
                  {" "}
                  <FontAwesomeIcon icon={faLightbulb} />
                  Intelligence
                </p>
              </Tooltip>
              <div className={classes.abilityCircle}>
                {" "}
                <div className={classes.abilityScore}>9</div>
                <div className={classes.modifierScore}>-1</div>
              </div>
            </div>
            <div className={classes.singleAbility}>
              <Tooltip
                title={
                  <>
                    animal handling
                    <br />
                    insight
                    <br />
                    medicine
                    <br />
                    perception
                    <br />
                    survival
                  </>
                }
                trigger={"click"}
              >
                <p className={classes.abilityTitle}>
                  {" "}
                  <FontAwesomeIcon icon={faBrain} />
                  Wisodm
                </p>
              </Tooltip>
              <div className={classes.abilityCircle}>
                {" "}
                <div className={classes.abilityScore}>20</div>
                <div className={classes.modifierScore}>+5</div>
              </div>
            </div>
            <div className={classes.singleAbility}>
              <Tooltip
                title={
                  <>
                    deception
                    <br />
                    intimidation
                    <br />
                    performance
                    <br />
                    persuasion
                  </>
                }
                trigger={"click"}
              >
                <p className={classes.abilityTitle}>
                  {" "}
                  <FontAwesomeIcon icon={faMasksTheater} />
                  Charisma
                </p>
              </Tooltip>
              <div className={classes.abilityCircle}>
                {" "}
                <div className={classes.abilityScore}>11</div>
                <div className={classes.modifierScore}>+0</div>
              </div>
            </div>
          </div>
          <div className={classes.skills}>
            <h3 className={classes.skillsTitle}>Skills</h3>
            <div className={classes.skillGroup}>
              <div className={classes.singleSkill}>
                <FontAwesomeIcon icon={faCircle} />
                <span className={classes.skillScore}>+9</span>{" "}
                <span className={classes.skillLabel}>Acrobatics</span>{" "}
                <FontAwesomeIcon icon={faBullseye} />
              </div>
              <div className={classes.singleSkill}>
                <FontAwesomeIcon icon={faCircleDot} />
                <span className={classes.skillScore}>+3</span>{" "}
                <span className={classes.skillLabel}>Animal Handling</span>{" "}
                <FontAwesomeIcon icon={faLightbulb} />
              </div>
              <div className={classes.singleSkill}>
                <FontAwesomeIcon icon={faCircle} />
                <span className={classes.skillScore}>+4</span>{" "}
                <span className={classes.skillLabel}>Arcana</span>{" "}
                <FontAwesomeIcon icon={faBrain} />
              </div>
              <div className={classes.singleSkill}>
                <FontAwesomeIcon icon={faCircle} />
                <span className={classes.skillScore}>+5</span>{" "}
                <span className={classes.skillLabel}>Athletics</span>{" "}
                <FontAwesomeIcon icon={faPersonRunning} />
              </div>
              <div className={classes.singleSkill}>
                <FontAwesomeIcon icon={faCircle} />
                <span className={classes.skillScore}>+5</span>{" "}
                <span className={classes.skillLabel}>Athletics</span>{" "}
                <FontAwesomeIcon icon={faPersonRunning} />
              </div>
              <div className={classes.singleSkill}>
                <FontAwesomeIcon icon={faCircle} />
                <span className={classes.skillScore}>+5</span>{" "}
                <span className={classes.skillLabel}>Athletics</span>{" "}
                <FontAwesomeIcon icon={faPersonRunning} />
              </div>
              <div className={classes.singleSkill}>
                <FontAwesomeIcon icon={faCircle} />
                <span className={classes.skillScore}>+5</span>{" "}
                <span className={classes.skillLabel}>Athletics</span>{" "}
                <FontAwesomeIcon icon={faPersonRunning} />
              </div>
              <div className={classes.singleSkill}>
                <FontAwesomeIcon icon={faCircle} />
                <span className={classes.skillScore}>+5</span>{" "}
                <span className={classes.skillLabel}>Athletics</span>{" "}
                <FontAwesomeIcon icon={faPersonRunning} />
              </div>
              <div className={classes.singleSkill}>
                <FontAwesomeIcon icon={faCircle} />
                <span className={classes.skillScore}>+5</span>{" "}
                <span className={classes.skillLabel}>Athletics</span>{" "}
                <FontAwesomeIcon icon={faPersonRunning} />
              </div>
              <div className={classes.singleSkill}>
                <FontAwesomeIcon icon={faCircle} />
                <span className={classes.skillScore}>+5</span>{" "}
                <span className={classes.skillLabel}>Athletics</span>{" "}
                <FontAwesomeIcon icon={faPersonRunning} />
              </div>
              <div className={classes.singleSkill}>
                <FontAwesomeIcon icon={faCircle} />
                <span className={classes.skillScore}>+5</span>{" "}
                <span className={classes.skillLabel}>Athletics</span>{" "}
                <FontAwesomeIcon icon={faPersonRunning} />
              </div>
              <div className={classes.singleSkill}>
                <FontAwesomeIcon icon={faCircle} />
                <span className={classes.skillScore}>+5</span>{" "}
                <span className={classes.skillLabel}>Athletics</span>{" "}
                <FontAwesomeIcon icon={faPersonRunning} />
              </div>
              <div className={classes.singleSkill}>
                <FontAwesomeIcon icon={faCircle} />
                <span className={classes.skillScore}>+5</span>{" "}
                <span className={classes.skillLabel}>Athletics</span>{" "}
                <FontAwesomeIcon icon={faPersonRunning} />
              </div>
              <div className={classes.singleSkill}>
                <FontAwesomeIcon icon={faCircle} />
                <span className={classes.skillScore}>+5</span>{" "}
                <span className={classes.skillLabel}>Athletics</span>{" "}
                <FontAwesomeIcon icon={faPersonRunning} />
              </div>
              <div className={classes.singleSkill}>
                <FontAwesomeIcon icon={faCircle} />
                <span className={classes.skillScore}>+5</span>{" "}
                <span className={classes.skillLabel}>Athletics</span>{" "}
                <FontAwesomeIcon icon={faPersonRunning} />
              </div>
              <div className={classes.singleSkill}>
                <FontAwesomeIcon icon={faCircle} />
                <span className={classes.skillScore}>+5</span>{" "}
                <span className={classes.skillLabel}>Athletics</span>{" "}
                <FontAwesomeIcon icon={faPersonRunning} />
              </div>
              <div className={classes.singleSkill}>
                <FontAwesomeIcon icon={faCircle} />
                <span className={classes.skillScore}>+5</span>{" "}
                <span className={classes.skillLabel}>Athletics</span>{" "}
                <FontAwesomeIcon icon={faPersonRunning} />
              </div>
              <div className={classes.singleSkill}>
                <FontAwesomeIcon icon={faCircle} />
                <span className={classes.skillScore}>+5</span>{" "}
                <span className={classes.skillLabel}>Athletics</span>{" "}
                <FontAwesomeIcon icon={faPersonRunning} />
              </div>
            </div>
          </div>
          <div className={classes.skills}>
            <h3 className={classes.skillsTitle}>Saving Throws</h3>
            <div className={classes.skillGroup}>
              <div className={classes.singleSkill}>
                <FontAwesomeIcon icon={faCircleDot} />
                <span className={classes.skillScore}>+4</span>{" "}
                <span className={classes.skillLabel}>Strength</span>{" "}
                <FontAwesomeIcon icon={faHandFist} />
              </div>
              <div className={classes.singleSkill}>
                <FontAwesomeIcon icon={faCircleDot} />
                <span className={classes.skillScore}>+4</span>{" "}
                <span className={classes.skillLabel}>Strength</span>{" "}
                <FontAwesomeIcon icon={faHandFist} />
              </div>
              <div className={classes.singleSkill}>
                <FontAwesomeIcon icon={faCircleDot} />
                <span className={classes.skillScore}>+4</span>{" "}
                <span className={classes.skillLabel}>Strength</span>{" "}
                <FontAwesomeIcon icon={faHandFist} />
              </div>
              <div className={classes.singleSkill}>
                <FontAwesomeIcon icon={faCircleDot} />
                <span className={classes.skillScore}>+4</span>{" "}
                <span className={classes.skillLabel}>Strength</span>{" "}
                <FontAwesomeIcon icon={faHandFist} />
              </div>
              <div className={classes.singleSkill}>
                <FontAwesomeIcon icon={faCircleDot} />
                <span className={classes.skillScore}>+4</span>{" "}
                <span className={classes.skillLabel}>Strength</span>{" "}
                <FontAwesomeIcon icon={faHandFist} />
              </div>
              <div className={classes.singleSkill}>
                <FontAwesomeIcon icon={faCircleDot} />
                <span className={classes.skillScore}>+4</span>{" "}
                <span className={classes.skillLabel}>Strength</span>{" "}
                <FontAwesomeIcon icon={faHandFist} />
              </div>
            </div>

            <h3 className={classes.skillsTitle}>Proficiencies</h3>
            <div className={classes.otherInfoGroup}>
              <div className={classes.proficiency}>
                <span className={classes.proficiencyTitle}>
                  Armor Proficiencies:
                </span>{" "}
                Light armor, Medium Armor, Shields
              </div>
              <div className={classes.proficiency}>
                <span className={classes.proficiencyTitle}>
                  Weapon Proficiencies:
                </span>{" "}
                Simple Weapons, Martial Weapons
              </div>
              <div className={classes.proficiency}>
                <span className={classes.proficiencyTitle}>
                  Tool Proficiencies:
                </span>{" "}
                -
              </div>
              <div className={classes.proficiency}>
                <span className={classes.proficiencyTitle}>Languages:</span>{" "}
                Common, all bird languages, Basic Walnar
              </div>
            </div>
          </div>
          <div className={`${classes.skills} ${classes.equippedSection}`}>
            <h3 className={classes.skillsTitle}>Equipped items</h3>
            <div className={classes.otherInfoGroup}>
              <div> Crossbow heavy Ova treba table da e nekoj</div>
              <div> Crossbow heavy Ova treba table da e nekoj</div>
              <div> Crossbow heavy Ova treba table da e nekoj</div>
            </div>
            <h3 className={classes.skillsTitle}>Features and Traits</h3>
            <div className={classes.otherInfoGroup}>
              <div> Add additional info for your character here</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CharacterPage;
