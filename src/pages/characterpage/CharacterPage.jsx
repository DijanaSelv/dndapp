import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { HIT_DICE } from "../../app/STATIC_HIT_DICE";
import SkillsModifierContainer from "../../components/SkillsModifierContainer";
import {
  faShield,
  faHeart,
  faCoins,
  faEye,
  faPersonRunning,
  faDice,
  faPrint,
} from "@fortawesome/free-solid-svg-icons";

import { Button, Checkbox, Progress, Tooltip } from "antd";
import classes from "./CharacterPage.module.css";
import { useParams } from "react-router";
import { useSelector } from "react-redux";

import { currencyForDisplay } from "../../app/actions/uitls";
import SpellCard from "../../components/SpellCard";
import { useEffect, useState } from "react";
import { getItems } from "../../app/actions/dndApiActions";
import { SPELL_SLOTS } from "../../app/STATIC_SPELL_LEVELS";

const CharacterPage = () => {
  const params = useParams();

  const cid = params.characterId;

  const characterData = useSelector(
    (state) => state.userSlice.user.characters[cid]
  );
  const { isLoading } = useSelector((state) => state.uiSlice);

  const [spellsData, setSpellsData] = useState();
  const [spellsComponent, setSpellsComponent] = useState();

  /* CALCULATIONS AND FORMATTING OF STATS */
  let formattedAlignment;
  let hitPoints;
  let classDice;
  let proficiencyBonus;
  let passivePerception;
  let constitutionModifier,
    strengthModifier,
    dexterityModifier,
    intelligenceModifier,
    wisdomModifier,
    charismaModifier,
    skillsStatic,
    savingThrowsStatic,
    abilitiesStatic,
    armorProficiency,
    weaponsProficiency,
    languagesProficiency,
    toolsProficiency,
    spellLevels,
    spellSlots;
  let coins;

  let checkIfProficient;

  //to calculate a modifier

  if (!isLoading) {
    classDice = HIT_DICE[characterData.class];
    const level = characterData.level;
    spellSlots = SPELL_SLOTS[characterData.class][level];
    proficiencyBonus = Math.floor((level - 1) / 4 + 2);

    //modifier is ability -10/2 and proficiency bonus added if proficient in skill

    checkIfProficient = (proficiencyName, savingThrows) => {
      return savingThrows
        ? Object.values(characterData["saving throws"]).includes(
            proficiencyName
          )
          ? proficiencyBonus
          : 0
        : Object.values(characterData.skills).includes(proficiencyName)
        ? proficiencyBonus
        : 0;
    };

    const calculateModifier = (ability, proficiencyName) => {
      let proficiency = proficiencyName
        ? checkIfProficient(proficiencyName)
        : 0;
      return Math.floor((ability - 10) / 2) + proficiency;
    };

    const listProficiencies = (proficiencyType) => {
      return characterData[proficiencyType]
        ? Object.values(characterData[proficiencyType])
            .map((singleItem) =>
              singleItem
                .split("-")
                .map((word) => {
                  return word[0].toUpperCase() + word.slice(1);
                })
                .join(" ")
            )
            .join(", ")
        : "";
    };

    armorProficiency = listProficiencies("armor");
    weaponsProficiency = listProficiencies("weapons");
    languagesProficiency = listProficiencies("languages");
    toolsProficiency = listProficiencies("tools");

    //alignment capitalized and dash removed
    const words = characterData.alignment?.split("-") || "";
    formattedAlignment = words
      ? words
          .map((word) => {
            return word[0].toUpperCase() + word.slice(1);
          })
          .join(" ")
      : "";

    //hp calculated 1. find dice type from class, const. modifier, formula: (maxdice+level*dice +2*level + 2*level+const modifier -2)/2

    constitutionModifier = calculateModifier(characterData.constitution);
    strengthModifier = calculateModifier(characterData.strength);
    dexterityModifier = calculateModifier(characterData.dexterity);
    intelligenceModifier = calculateModifier(characterData.intelligence);
    wisdomModifier = calculateModifier(characterData.wisdom);
    charismaModifier = calculateModifier(characterData.charisma);

    //to iterate over components more easily instead of typing each one individually for all skills etc.
    abilitiesStatic = {
      strength: strengthModifier,
      dexterity: dexterityModifier,
      constitution: constitutionModifier,
      intelligence: intelligenceModifier,
      wisdom: wisdomModifier,
      charisma: charismaModifier,
    };

    skillsStatic = {
      acrobatics: dexterityModifier,
      "animal-handling": wisdomModifier,
      arcana: intelligenceModifier,
      athletics: strengthModifier,
      deception: charismaModifier,
      history: intelligenceModifier,
      insight: wisdomModifier,
      intimidation: charismaModifier,
      investigation: intelligenceModifier,
      medicine: wisdomModifier,
      nature: intelligenceModifier,
      perception: wisdomModifier,
      performance: charismaModifier,
      persuasion: charismaModifier,
      religion: intelligenceModifier,
      "sleight-of-hand": dexterityModifier,
      stealth: dexterityModifier,
      survival: wisdomModifier,
    };

    savingThrowsStatic = {
      "saving-throw-str": strengthModifier,
      "saving-throw-dex": dexterityModifier,
      "saving-throw-con": constitutionModifier,
      "saving-throw-int": intelligenceModifier,
      "saving-throw-wis": wisdomModifier,
      "saving-throw-cha": charismaModifier,
    };

    //first (spells) is spells0 = cantrips.
    spellLevels = [
      "spells",
      "spells1",
      "spells2",
      "spells3",
      "spells4",
      "spells5",
      "spells6",
      "spells7",
      "spells8",
      "spells9",
    ];

    hitPoints =
      (classDice +
        level * classDice +
        2 * level +
        2 * level * constitutionModifier -
        2) /
      2;

    coins = currencyForDisplay(characterData.gold);

    passivePerception = Math.floor(
      10 +
        calculateModifier(characterData.wisdom) +
        checkIfProficient("skill-perception")
    );

    //SKILL MODIFIERS - relevant ability modifier + proficiency modifier if applicable + expertise/feat when I include them voopshto
  }
  const printCharacterHandler = () => {
    window.print();
  };

  useEffect(() => {
    if (!isLoading) {
      const allLeveledSpells = spellLevels
        .map((lvl) => characterData[lvl])
        .filter((level) => level !== undefined);

      const getSpellsData = async () => {
        const allSpellsData = await Promise.all(
          allLeveledSpells.map(
            async (oneLevelSpells) =>
              await Promise.all(
                oneLevelSpells.map(
                  async (spell) => await getItems(`/api/spells/${spell}`)
                )
              )
          )
        );

        setSpellsData(allSpellsData);
      };
      getSpellsData();
    }
  }, [isLoading]);

  useEffect(() => {
    if (spellsData) {
      const component = spellsData.map((oneLevelArray, i) => {
        return (
          <div className={classes.spellLevelContainer} key={i}>
            <div className={classes.spellTitleContainer}>
              <h4 className={classes.spellTitle}>
                Level {oneLevelArray[0].level}
              </h4>{" "}
              <div className={classes.spellSlotsContainer}>
                <span>Spell Slots:</span>
                <p className={classes.spellSlotsCheck}>
                  <Checkbox />
                  <Checkbox />
                  <Checkbox />
                  <Checkbox />
                </p>
              </div>
            </div>
            <div className={classes.spellLabelsContainer}>
              {oneLevelArray.map((spell) => (
                <Tooltip
                  key={`tooltip${spell.index}`}
                  overlayInnerStyle={{
                    width: "450px",
                  }}
                  placement="bottom"
                  arrow={false}
                  title={<SpellCard spell={spell} />}
                >
                  <div className={classes.spellLabel} ley={spell.index}>
                    {spell.name}
                  </div>
                </Tooltip>
              ))}
            </div>
          </div>
        );
      });
      setSpellsComponent(component);
    }
  }, [spellsData]);

  return (
    <>
      {!isLoading ? (
        <div className={classes.characterPageContent}>
          <div className={classes.charInfoSection}>
            <h2 className={classes.sectionTitle}>
              {" "}
              {characterData.name}{" "}
              <Button
                className={classes.printButton}
                onClick={printCharacterHandler}
              >
                <FontAwesomeIcon icon={faPrint} /> Print Character Sheet
              </Button>
              <span className={classes.gold}>
                {" "}
                <FontAwesomeIcon icon={faCoins} />
                {coins.gp > 0 && `${coins.gp}gp`}
                {coins.sp > 0 && `, ${coins.sp}sp`}
                {coins.cp > 0 && `, ${coins.cp}cp`}
                {coins.gp == 0 && coins.sp == 0 && coins.cp == 0 && "0gp"}
              </span>
            </h2>
            <div className={classes.charInfoContent}>
              <div className={classes.charProfile}>
                {" "}
                <img
                  className={classes.charIcon}
                  src={characterData.image}
                ></img>
                <p>Level {characterData.level}</p>
                <p>
                  {characterData.race[0].toUpperCase() +
                    characterData.race.slice(1)}{" "}
                  {characterData.class[0].toUpperCase() +
                    characterData.class.slice(1)}
                </p>
                <p>{formattedAlignment}</p>
              </div>
              <div className={classes.mainStats}>
                <div className={classes.statRow}>
                  <div className={classes.singleStat}>
                    <span className={classes.statLabel}>
                      <FontAwesomeIcon icon={faHeart} />
                      HP:
                    </span>
                    <span className={classes.statValue}>{hitPoints}</span>
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
                      <FontAwesomeIcon icon={faDice} />
                      Hit Dice:
                    </span>
                    <span className={classes.statValue}>
                      {characterData.level}d{classDice}
                    </span>
                  </div>
                </div>
                <div className={classes.statRow}>
                  <div className={classes.singleStat}>
                    <span className={classes.statLabel}>
                      <FontAwesomeIcon icon={faPersonRunning} />
                      Initiative:
                    </span>
                    <span className={classes.statValue}>
                      +{Math.floor((characterData.dexterity - 10) / 2)}
                    </span>
                  </div>
                  <div className={classes.singleStat}>
                    <span className={classes.statLabel}>
                      <FontAwesomeIcon icon={faEye} />
                      Passive Perception:
                    </span>
                    <span className={classes.statValue}>
                      {passivePerception}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={classes.charInfoSection}>
            <h2 className={classes.sectionTitle}>
              Ability Scores <span>Proficiency bonus: +{proficiencyBonus}</span>
            </h2>

            <div className={classes.allStats}>
              <div className={`${classes.abilities} `}>
                {Object.keys(abilitiesStatic).map((ability) => (
                  <SkillsModifierContainer
                    type="main-ability"
                    key={ability}
                    modifier={abilitiesStatic[ability]}
                    name={ability}
                    value={characterData[ability]}
                  />
                ))}
              </div>
              <div className={classes.skills}>
                <h3 className={classes.skillsTitle}>Skills</h3>
                <div className={classes.skillGroup}>
                  {Object.keys(skillsStatic).map((skill) => (
                    <SkillsModifierContainer
                      key={skill}
                      skill={skill}
                      modifier={skillsStatic[skill]}
                      checkIfProficient={checkIfProficient}
                      type="skill"
                    />
                  ))}
                </div>
              </div>
              <div className={classes.skills}>
                <h3 className={classes.skillsTitle}>Saving Throws</h3>
                <div className={classes.skillGroup}>
                  {Object.keys(savingThrowsStatic).map((savingThrow) => (
                    <SkillsModifierContainer
                      key={savingThrow}
                      skill={savingThrow}
                      modifier={savingThrowsStatic[savingThrow]}
                      checkIfProficient={checkIfProficient}
                      type="saving-throw"
                    />
                  ))}
                </div>

                <h3 className={classes.skillsTitle}>Proficiencies</h3>
                <div className={classes.otherInfoGroup}>
                  <div className={classes.proficiency}>
                    <span className={classes.proficiencyTitle}>
                      Armor Proficiencies:
                    </span>{" "}
                    {armorProficiency || "/"}
                  </div>
                  <div className={classes.proficiency}>
                    <span className={classes.proficiencyTitle}>
                      Weapon Proficiencies:
                    </span>{" "}
                    {weaponsProficiency || "/"}
                  </div>
                  <div className={classes.proficiency}>
                    <span className={classes.proficiencyTitle}>
                      Tool Proficiencies:
                    </span>{" "}
                    {toolsProficiency || "/"}
                  </div>
                  <div className={classes.proficiency}>
                    <span className={classes.proficiencyTitle}>Languages:</span>{" "}
                    {languagesProficiency || "/"}
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

          <h3 className={classes.skillsTitle}>Spells</h3>
          <div className={classes.spellsSection}>{spellsComponent}</div>

          <div className={classes.charInfoSection}>
            <h3 className={classes.skillsTitle}>Biography</h3>
            <div className={classes.bioInfoGroup}>
              <div className={classes.bioSection}>
                <h4>Physical description</h4>
                <div>{characterData["physical description"]}</div>
              </div>

              <div className={classes.bioSection}>
                <h4>Backstory</h4>
                <div>{characterData.backstory}</div>
              </div>

              <div className={classes.bioSection}>
                <h4>Personality</h4>
                <div>{characterData.personality}</div>
              </div>
              <div className={classes.bioSection}>
                <h4>Ideals</h4>
                <div>{characterData.ideals}</div>
              </div>
              <div className={classes.bioSection}>
                <h4>Bonds</h4>
                <div>{characterData.bonds}</div>
              </div>

              <div className={classes.bioSection}>
                <h4>Flaws</h4>
                <div>{characterData.flaws}</div>
              </div>

              <div className={classes.bioSection}>
                <h4>Allies & Organizations</h4>
                <div>{characterData.allies}</div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <p className={classes.pageInfo}>Loading...</p>
          <Progress
            percent={100}
            status="active"
            showInfo={false}
            size="small"
            strokeColor={{ from: "#108ee9", to: "#87d068" }}
          />
        </>
      )}
    </>
  );
};

export default CharacterPage;
