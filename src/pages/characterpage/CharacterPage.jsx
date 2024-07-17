import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { HIT_DICE } from "../../app/STATIC_HIT_DICE";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShield,
  faHeart,
  faCoins,
  faEye,
  faPersonRunning,
  faDice,
  faPrint,
  faTriangleExclamation,
  faShieldAlt,
  faHand,
} from "@fortawesome/free-solid-svg-icons";
import { faCircleQuestion } from "@fortawesome/free-regular-svg-icons";
import { Button, Checkbox, Progress, Table, Tooltip } from "antd";

import classes from "./CharacterPage.module.css";

import SkillsModifierContainer from "../../components/SkillsModifierContainer";
import ItemDescriptionCard from "../../components/ItemDescriptionCard";
import SpellCard from "../../components/SpellCard";
import { currencyForDisplay } from "../../app/actions/uitls";
import { getItems } from "../../app/actions/dndApiActions";
import { SPELL_SLOTS } from "../../app/STATIC_SPELL_LEVELS";
import { updateEquippedItems } from "../../app/actions/databaseActions";
import { LoadingOutlined } from "@ant-design/icons";

const CharacterPage = () => {
  const params = useParams();

  const cid = params.characterId;

  const characterData = useSelector(
    (state) => state.userSlice.user.characters[cid]
  );
  const uid = useSelector((state) => state.userSlice.user.uid);
  const { isLoading } = useSelector((state) => state.uiSlice);
  const dispatch = useDispatch();

  const [spellsData, setSpellsData] = useState();
  const [equipmentData, setEquipmentData] = useState();
  const [spellsComponent, setSpellsComponent] = useState();
  const [equipmentComponent, setEquipmentComponent] = useState();
  const [acScore, setAcScore] = useState();
  const [features, setFeatures] = useState();
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
    spellSlots,
    coins,
    spellcastingAbilities;

  let checkIfProficient;

  //to calculate a modifier

  if (!isLoading) {
    classDice = HIT_DICE[characterData.class];
    const level = characterData.level;
    if (
      !["barbarian", "fighter", "monk", "rogue"].includes(characterData.class)
    ) {
      spellSlots = SPELL_SLOTS[characterData.class][level];
    }
    proficiencyBonus = Math.floor((level - 1) / 4 + 2);

    //modifier is ability -10/2 and proficiency bonus added if proficient in skill

    checkIfProficient = (proficiencyName, savingThrows) => {
      return savingThrows
        ? characterData["saving throws"] &&
          Object.values(characterData["saving throws"]).includes(
            proficiencyName
          )
          ? proficiencyBonus
          : 0
        : characterData.skills &&
          Object.values(characterData.skills).includes(proficiencyName)
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
      "spells0",
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

    spellcastingAbilities = {
      bard: "charisma",
      cleric: "wisdom",
      druid: "wisdom",
      paladin: "charisma",
      ranger: "wisdom",
      sorcerer: "charisma",
      warlock: "charisma",
      wizard: "intelligence",
    };

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

      const getItemsData = async () => {
        const allEquipmentData = await Promise.all(
          characterData.equipment.map((item) => getItems(item.url))
        );

        setEquipmentData(allEquipmentData);
      };
      characterData.equipment && getItemsData();

      const getFeatures = async () => {
        const featuresList = await getItems("/api/features");
        const allFeaturesData = await Promise.all(
          featuresList.results.map(async (feature) => getItems(feature.url))
        );
        /* const classFeatures = allFeatures.filter(
          (feature) => feature.class.index === characterData.class
        ); */
        const classFeatures = allFeaturesData.filter(
          (feature) =>
            feature.class.index === characterData.class &&
            feature.level <= characterData.level
        );

        setFeatures(classFeatures);
      };

      getFeatures();
    }
  }, [isLoading]);

  useEffect(() => {
    if (
      spellsData &&
      !["barbarian", "fighter", "monk", "rogue"].includes(characterData.class)
    ) {
      const component = (characterData["spells0"] ||
        characterData["spells1"] ||
        characterData["spells2"] ||
        characterData["spells3"] ||
        characterData["spells4"] ||
        characterData["spells5"] ||
        characterData["spells6"] ||
        characterData["spells7"] ||
        characterData["spells8"] ||
        characterData["spells9"]) && (
        <>
          {" "}
          <h3 className={`${classes.skillsTitle} ${classes.spellsTitle}`}>
            <span>
              {" "}
              Spells{" "}
              <Tooltip title="keep hovering on each spell to see more details">
                {" "}
                <FontAwesomeIcon icon={faCircleQuestion} />
              </Tooltip>
            </span>
            <div className={` ${classes.spellCastingInfo}`}>
              {" "}
              {characterData.class === "warlock" && (
                <p>
                  Spell slots{" "}
                  {`(lvl.${SPELL_SLOTS["warlock"][characterData.level][3]})`}:{" "}
                  <span className={classes.spellCastingValue}>
                    {Array.from({
                      length: SPELL_SLOTS["warlock"][characterData.level][2],
                    }).map((_, i) => (
                      <Checkbox key={`war-${i}`} />
                    ))}
                  </span>
                </p>
              )}
              {characterData.class === "sorcerer" &&
                characterData.level > 1 && (
                  <p>
                    Sorcery points {`(${characterData.level})`}:{" "}
                    <span className={classes.spellCastingValue}>
                      {Array.from({
                        length: characterData.level,
                      }).map((_, i) => (
                        <Checkbox key={`sor-${i}`} />
                      ))}
                    </span>
                  </p>
                )}
              <p>
                Spellcasting ability:{" "}
                <span className={classes.spellCastingValue}>
                  {spellcastingAbilities[characterData.class]}
                </span>
              </p>
              <p>
                Spell attack bonus: +
                <span className={classes.spellCastingValue}>
                  {abilitiesStatic[spellcastingAbilities[characterData.class]] +
                    proficiencyBonus}
                </span>
              </p>
              <p>
                Saving throw DC:
                <span className={classes.spellCastingValue}>
                  {" "}
                  {8 +
                    abilitiesStatic[
                      spellcastingAbilities[characterData.class]
                    ] +
                    proficiencyBonus}
                </span>
              </p>
            </div>
          </h3>
          <div className={classes.spellsSection}>
            {spellsData.map((oneLevelArray, i) => {
              const numberOfSlots = spellSlots[oneLevelArray[0].level];
              return (
                <div className={classes.spellLevelContainer} key={i}>
                  <div className={classes.spellTitleContainer}>
                    <h4 className={classes.spellTitle}>
                      {oneLevelArray[0].level == 0
                        ? "Cantrips"
                        : `Level ${oneLevelArray[0].level}`}
                    </h4>{" "}
                    {oneLevelArray[0].level !== 0 &&
                      characterData.class !== "warlock" && (
                        <div className={classes.spellSlotsContainer}>
                          <span>Spell Slots:</span>
                          <p className={classes.spellSlotsCheck}>
                            {/* Make array of the number of spell slots for that level and map it to geerate that many spell slot checkboxes */}
                            {Array.from({
                              length: numberOfSlots,
                            }).map((_, i) => (
                              <Checkbox
                                key={`${oneLevelArray[0].level}-${i}`}
                              />
                            ))}
                          </p>
                        </div>
                      )}
                  </div>
                  <div className={classes.spellLabelsContainer}>
                    {oneLevelArray.map((spell) => (
                      <Tooltip
                        trigger="click"
                        key={`tooltip-${spell.index}`}
                        overlayInnerStyle={{
                          width: "500px",
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
            })}
          </div>
        </>
      );
      setSpellsComponent(component);
    }
  }, [spellsData]);

  const calculateAttackWeaponBonus = (range, record) => {
    let modifier;
    //check what type of weapon it is to select hte right modifier
    if (range === "Melee") {
      modifier = strengthModifier;
    } else if (range === "Ranged") {
      modifier = dexterityModifier;
    } else {
      modifier =
        strengthModifier > dexterityModifier
          ? strengthModifier
          : dexterityModifier;
    }

    //check if the character is proficient in the weapon
    let isProficient = 0;
    if (weaponsProficiency.includes(record.name)) {
      isProficient = proficiencyBonus;
    }
    if (weaponsProficiency.includes(record["weapon_category"])) {
      isProficient = proficiencyBonus;
    }

    return modifier + isProficient;
  };

  const calculateDamageModifier = (record) => {
    let modifier;
    //check what type of weapon it is to select hte right modifier
    if (record["weapon_range"] === "Melee") {
      modifier = strengthModifier;
    } else if (record["weapon_range"] === "Ranged") {
      modifier = dexterityModifier;
    } else {
      modifier =
        strengthModifier > dexterityModifier
          ? strengthModifier
          : dexterityModifier;
    }
    return modifier;
  };

  useEffect(() => {
    //set AC score
    if (characterData) {
      //BASE ARMOR CLASS
      //if no  equipped items AC = 10 + dex. mod
      //barbarian +  con mod
      //monk + con and wis mod
      const barbarianModifier =
        characterData.class === "barbarian" ? constitutionModifier : 0;
      const monkModifier = characterData.class === "monk" ? wisdomModifier : 0;
      const baseAC = 10 + dexterityModifier + barbarianModifier + monkModifier;

      //if equipped and there is armor class value of the items: armor_class base + dex mod if dex. bonus is true
      //+ shield if it's true
      //dex modifier if there is limit it can be +2 max. (max_bonus)

      if (
        (characterData.equipped?.armor &&
          characterData.equipped?.armor["armor_class"]) ||
        (characterData.equipped?.shield &&
          characterData.equipped?.shield["armor_class"])
      ) {
        const armor = characterData.equipped.armor || null;
        const shield = characterData.equipped.shield || null;
        const dexterityBonus =
          armor && armor["armor_class"]["dex_bonus"]
            ? armor["armor_class"]["max_bonus"]
              ? dexterityModifier > 2
                ? 2
                : dexterityModifier
              : dexterityModifier
            : 0;
        const shieldBonus = (shield && shield["armor_class"]?.base) || 0;

        //if there is no armor but yes shield shield bonus is added to base AC.
        const acWithArmor = armor
          ? armor["armor_class"]?.base
          : baseAC + dexterityBonus + shieldBonus;

        setAcScore(acWithArmor);
      } else {
        setAcScore(baseAC);
      }
    }

    //SET EQUIPMENT TABLES sorted by category
    if (equipmentData) {
      const weapons = equipmentData.filter(
        (item) => item["equipment_category"].index === "weapon"
      );

      const armor = equipmentData.filter(
        (item) => item["equipment_category"].index === "armor"
      );
      const otherItems = equipmentData.filter(
        (item) =>
          item["equipment_category"].index !== "armor" &&
          item["equipment_category"].index !== "weapon"
      );

      //The basic attack bonus formula is: Ability Modifier + Proficiency + Enchanted Item Bonus + Class Features = Attack Bonus.
      const weaponsColumn = [
        {
          title: "name",
          dataIndex: "name",
          key: "name",
          render: (text, record) => (
            <Tooltip
              overlayClassName={classes.equipmentTooltip}
              trigger="click"
              overlayInnerStyle={{
                width: "400px",
              }}
              title={
                <ItemDescriptionCard
                  className={classes.equipmentTooltip}
                  item={record}
                />
              }
            >
              {<span className={classes.itemNameSpan}>{text}</span>}
              {record.name === characterData.equipped?.weapon?.name && (
                <FontAwesomeIcon icon={faHand} />
              )}
            </Tooltip>
          ),
        },
        {
          title: "range",
          dataIndex: "range",
          key: "range",
          render: (range) =>
            range ? (
              <p>{`${range.normal}${range.long ? `/${range.long}` : " ft"}`}</p>
            ) : (
              "/"
            ),
        },
        {
          title: "attack",
          dataIndex: "weapon_range",
          key: "attack",
          render: (range, record) => {
            if (range) {
              const attackBonus = calculateAttackWeaponBonus(range, record);
              return <p>+{attackBonus} vs. AC</p>;
            } else {
              return "/";
            }
          },
        },
        {
          //When attacking with a weapon, you add your ability modifier—the same modifier used for the attack roll—to the damage.
          title: "damage",
          dataIndex: "damage",
          key: "damage",
          render: (damage, record) => {
            if (damage) {
              const modifier = calculateDamageModifier(record);
              return (
                <p>
                  {damage["damage_dice"]}
                  {modifier ? `+${modifier}` : ""} {damage["damage_type"].index}
                </p>
              );
            } else {
              return "/";
            }
          },
        },
      ];

      const armorColumn = [
        {
          title: "name",
          dataIndex: "name",
          key: "name",
          render: (text, record) => (
            <Tooltip
              overlayClassName={classes.equipmentTooltip}
              trigger="click"
              overlayInnerStyle={{
                minWidth: "200px",
                maxWidth: "600px",
              }}
              title={
                <ItemDescriptionCard
                  className={classes.equipmentTooltipCard}
                  item={record}
                />
              }
            >
              {<span className={classes.itemNameSpan}>{text}</span>}
              {(record.name === characterData.equipped?.armor?.name ||
                record.name === characterData.equipped?.shield?.name) && (
                <FontAwesomeIcon icon={faShieldAlt} />
              )}
            </Tooltip>
          ),
        },
        {
          title: "category",
          dataIndex: "armor_category",
          key: "category",
          render: (text, record) => {
            return text ? (
              <p>
                {text}
                {!armorProficiency.includes(text) &&
                  !weaponsProficiency.includes(record["armor_category"]) &&
                  !armorProficiency.includes("All") && (
                    <Tooltip title="You're not proficient in this category and can not equip this item.">
                      {" "}
                      <FontAwesomeIcon
                        icon={faTriangleExclamation}
                        style={{ color: "#8b0000" }}
                      />{" "}
                    </Tooltip>
                  )}
              </p>
            ) : (
              "/"
            );
          },
        },
        {
          title: "AC",
          dataIndex: "armor_class",
          key: "AC",
          render: (text, record) =>
            text ? (
              <p>
                {text.base}
                {text["dex_bonus"] && "+ dex. modifier"}
              </p>
            ) : (
              "/"
            ),
        },
      ];

      const otherItemsColumn = [
        {
          title: "name",
          dataIndex: "name",
          key: "name",
          render: (text, record) => (
            <Tooltip
              overlayClassName={classes.equipmentTooltip}
              trigger="click"
              overlayInnerStyle={{
                minWidth: "200px",
                maxWidth: "600px",
              }}
              title={
                <ItemDescriptionCard
                  className={classes.equipmentTooltipCard}
                  item={record}
                />
              }
            >
              <span className={classes.itemNameSpan}>{text}</span>
            </Tooltip>
          ),
        },
      ];
      const component = (
        <div className={classes.equipmentSection}>
          <h3 className={`${classes.skillsTitle} ${classes.spellsTitle}`}>
            <span>
              {" "}
              Inventory{" "}
              <Tooltip title="click on an item to see more details">
                {" "}
                <FontAwesomeIcon icon={faCircleQuestion} />
              </Tooltip>
            </span>
          </h3>
          <div className={classes.equipmentContainer}>
            {weapons.length > 0 && (
              <div
                className={`${classes.equipmentCategoryContent} ${classes.weaponsCategoryContent}`}
              >
                <h4>
                  Weapons{" "}
                  <Tooltip title="double click on an item to equip or unequip it">
                    {" "}
                    <FontAwesomeIcon icon={faCircleQuestion} />
                  </Tooltip>
                </h4>

                <Table
                  className={classes.equipmentTable}
                  columns={weaponsColumn}
                  dataSource={weapons}
                  size="small"
                  pagination={false}
                  onRow={(record, index) => {
                    return {
                      onDoubleClick: (event) => {
                        if (
                          record.name !== characterData.equipped?.weapon?.name
                        ) {
                          dispatch(
                            updateEquippedItems(record, uid, cid, "weapon")
                          );
                        } else {
                          dispatch(
                            updateEquippedItems(null, uid, cid, "weapon")
                          );
                        }
                      },
                    };
                  }}
                  rowClassName={(record) =>
                    record.name === characterData.equipped?.weapon?.name
                      ? classes.selectedItemRow
                      : null
                  }
                  /* pagination={{
                pageSize: 20,
              }} */
                  scroll={{
                    y: 400,
                  }}
                />
              </div>
            )}
            {armor.length > 0 && (
              <div className={classes.equipmentCategoryContent}>
                <h4>
                  Armor{" "}
                  <Tooltip title="double click on an item to equip or unequip it. This will affect your AC. If you're not proficient in that category you cannot equip the item.">
                    {" "}
                    <FontAwesomeIcon icon={faCircleQuestion} />
                  </Tooltip>
                </h4>
                <Table
                  className={classes.equipmentTable}
                  columns={armorColumn}
                  dataSource={armor}
                  size="small"
                  pagination={false}
                  onRow={(record, index) => {
                    return {
                      onDoubleClick: (event) => {
                        //SHIELD PROFICIENCY IS IN WEAPONS IN THE API
                        if (record["armor_category"] === "Shield") {
                          if (
                            //check if shiled is not already equipped
                            !characterData.equipped?.shield ||
                            record.name !== characterData.equipped?.shield?.name
                          ) {
                            if (
                              //check if character is proficient
                              !record["armor_category"] ||
                              weaponsProficiency.includes("Shield")
                            ) {
                              dispatch(
                                updateEquippedItems(record, uid, cid, "shield")
                              );
                            }
                          }
                          //if shield is equip it remove it from equipped items
                          else {
                            dispatch(
                              updateEquippedItems(null, uid, cid, "shield")
                            );
                          }
                        }
                        //ALL OTHER ARMOR PROFICIENCIES
                        //check if equipped other type of armor
                        else if (
                          !characterData.equipped?.armor ||
                          record.name !== characterData.equipped?.armor?.name
                        ) {
                          if (
                            //check if proficient
                            !record["armor_category"] ||
                            armorProficiency.includes(
                              record["armor_category"]
                            ) ||
                            armorProficiency.includes("All")
                          ) {
                            dispatch(
                              updateEquippedItems(record, uid, cid, "armor")
                            );
                          }
                        } else {
                          //if equipped, remove it
                          dispatch(
                            updateEquippedItems(null, uid, cid, "armor")
                          );
                        }
                      },
                    };
                  }}
                  rowClassName={(record) =>
                    record.name === characterData.equipped?.armor?.name ||
                    record.name === characterData.equipped?.shield?.name
                      ? classes.selectedItemRow
                      : null
                  }
                  /* pagination={{
                pageSize: 20,
              }} */
                  scroll={{
                    y: 400,
                  }}
                />
              </div>
            )}
            {otherItems.length > 0 && (
              <div className={classes.equipmentCategoryContent}>
                <h4>
                  Other Items{" "}
                  <Tooltip title="hover over the names to see more details">
                    {" "}
                    <FontAwesomeIcon icon={faCircleQuestion} />
                  </Tooltip>
                </h4>
                <Table
                  className={classes.equipmentTable}
                  columns={otherItemsColumn}
                  dataSource={otherItems}
                  size="small"
                  pagination={false}
                  /* pagination={{
                pageSize: 20,
              }} */
                  scroll={{
                    y: 400,
                  }}
                />
              </div>
            )}
          </div>
        </div>
      );
      setEquipmentComponent(component);
    }
  }, [equipmentData, characterData]);

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
                    <span className={classes.statValue}>{acScore}</span>
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
                <h3 className={classes.skillsTitle}>
                  Equipped Items{" "}
                  <Tooltip title="click on the items to see more details">
                    {" "}
                    <FontAwesomeIcon icon={faCircleQuestion} />
                  </Tooltip>{" "}
                </h3>
                <div className={classes.otherInfoGroup}>
                  {!characterData.equipped && (
                    <p>
                      You don't have any equipped items. Go down to your
                      inventory and select armor and weapons by double clicking
                      them.
                    </p>
                  )}
                  {characterData.equipped?.armor && (
                    <Tooltip
                      overlayClassName={classes.equipmentTooltip}
                      trigger="click"
                      placement="bottom"
                      overlayInnerStyle={{
                        minWidth: "300px",
                        maxWidth: "600px",
                      }}
                      title={
                        <ItemDescriptionCard
                          className={classes.equipmentTooltipCard}
                          item={characterData.equipped.armor}
                        />
                      }
                    >
                      <div className={classes.equippedItemContainer}>
                        {" "}
                        <h4>
                          <FontAwesomeIcon icon={faShieldAlt} /> Armor:{" "}
                        </h4>{" "}
                        <span>{characterData.equipped?.armor?.name}</span>
                        {characterData.equipped.armor["armor_class"] && (
                          <span>
                            AC:{" "}
                            {characterData.equipped.armor["armor_class"]?.base}{" "}
                            {characterData.equipped.armor["armor_class"][
                              "dex_bonus"
                            ] && "+ dex. modifier"}
                          </span>
                        )}
                      </div>
                    </Tooltip>
                  )}
                  {characterData.equipped?.shield && (
                    <Tooltip
                      overlayClassName={classes.equipmentTooltip}
                      trigger="click"
                      placement="bottom"
                      overlayInnerStyle={{
                        minWidth: "300px",
                        maxWidth: "600px",
                      }}
                      title={
                        <ItemDescriptionCard
                          className={classes.equipmentTooltipCard}
                          item={characterData.equipped.shield}
                        />
                      }
                    >
                      <div className={classes.equippedItemContainer}>
                        {" "}
                        <h4>
                          <FontAwesomeIcon icon={faShieldAlt} /> Shield:{" "}
                        </h4>{" "}
                        <span>{characterData.equipped.shield.name}</span>
                        <span>
                          AC: +
                          {characterData.equipped.shield["armor_class"].base}{" "}
                          {characterData.equipped.shield["armor_class"][
                            "dex_bonus"
                          ] && "+ dex. modifier"}
                        </span>
                      </div>
                    </Tooltip>
                  )}
                  {characterData.equipped?.weapon && (
                    <Tooltip
                      overlayClassName={classes.equipmentTooltip}
                      trigger="click"
                      placement="bottom"
                      overlayInnerStyle={{
                        minWidth: "300px",
                        maxWidth: "600px",
                      }}
                      title={
                        <ItemDescriptionCard
                          className={classes.equipmentTooltipCard}
                          item={characterData.equipped.weapon}
                        />
                      }
                    >
                      <div className={classes.equippedItemContainer}>
                        {" "}
                        <h4>
                          {" "}
                          <FontAwesomeIcon icon={faHand} /> Weapon:{" "}
                        </h4>{" "}
                        <span>{characterData.equipped.weapon.name}</span>
                        <span>
                          attack (+
                          {calculateAttackWeaponBonus(
                            characterData.equipped.weapon["weapon_range"],
                            characterData.equipped.weapon
                          ) || 0}{" "}
                          vs. AC)
                        </span>
                        <span>
                          dmg ({" "}
                          {characterData.equipped.weapon.damage["damage_dice"]}{" "}
                          +
                          {calculateDamageModifier(
                            characterData.equipped.weapon
                          ) || 0}{" "}
                          {
                            characterData.equipped.weapon.damage["damage_type"]
                              .index
                          }
                          )
                        </span>
                      </div>
                    </Tooltip>
                  )}
                </div>
                <h3 className={classes.skillsTitle}>
                  Features and Traits{" "}
                  <Tooltip title="You gain features as you level up. Click on a feature to see more details.">
                    {" "}
                    <FontAwesomeIcon icon={faCircleQuestion} />
                  </Tooltip>{" "}
                </h3>
                <div
                  className={`${classes.otherInfoGroup} ${classes.featuresContainer}`}
                >
                  {features ? (
                    features.map((feature) => (
                      <Tooltip
                        overlayClassName={classes.equipmentTooltip}
                        overlayInnerStyle={{ width: "600px" }}
                        trigger="click"
                        key={`tooltip-${feature.index}`}
                        placement="bottom"
                        title={<ItemDescriptionCard item={feature} />}
                      >
                        <div className={classes.featureLabel}>
                          {feature.name}
                        </div>
                      </Tooltip>
                    ))
                  ) : (
                    <div>
                      Loading features <LoadingOutlined />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {spellsComponent}
          {equipmentComponent}

          {(characterData["physical description"] ||
            characterData.backstory ||
            characterData.personality ||
            characterData.ideals ||
            characterData.bonds ||
            characterData.flaws ||
            characterData.allies) && (
            <div className={classes.charInfoSection}>
              <h3 className={classes.skillsTitle}>Biography</h3>
              <div className={classes.bioInfoGroup}>
                {characterData["physical description"] && (
                  <div className={classes.bioSection}>
                    <h4>Physical description</h4>
                    <div>{characterData["physical description"]}</div>
                  </div>
                )}

                {characterData.backstory && (
                  <div className={classes.bioSection}>
                    <h4>Backstory</h4>
                    <div>{characterData.backstory}</div>
                  </div>
                )}

                {characterData.personality && (
                  <div className={classes.bioSection}>
                    <h4>Personality</h4>
                    <div>{characterData.personality}</div>
                  </div>
                )}
                {characterData.ideals && (
                  <div className={classes.bioSection}>
                    <h4>Ideals</h4>
                    <div>{characterData.ideals}</div>
                  </div>
                )}
                {characterData.bonds && (
                  <div className={classes.bioSection}>
                    <h4>Bonds</h4>
                    <div>{characterData.bonds}</div>
                  </div>
                )}

                {characterData.flaws && (
                  <div className={classes.bioSection}>
                    <h4>Flaws</h4>
                    <div>{characterData.flaws}</div>
                  </div>
                )}
                {characterData.allies && (
                  <div className={classes.bioSection}>
                    <h4>Allies & Organizations</h4>
                    <div>{characterData.allies}</div>
                  </div>
                )}
              </div>
            </div>
          )}
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
