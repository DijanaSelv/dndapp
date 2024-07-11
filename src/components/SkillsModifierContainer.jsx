import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classes from "../pages/characterpage/CharacterPage.module.css";
import {
  faBrain,
  faBullseye,
  faHandFist,
  faHeartPulse,
  faLightbulb,
  faMasksTheater,
} from "@fortawesome/free-solid-svg-icons";

import { faCircleDot, faCircle } from "@fortawesome/free-regular-svg-icons";
import { Tooltip } from "antd";
import React from "react";

const SkillsModifierContainer = (props) => {
  const { skill, checkIfProficient, modifier, type, value, name } = props;

  const abilities = {
    strength: {
      icon: <FontAwesomeIcon icon={faHandFist} />,
      skills: ["athletics", "saving-throw-str"],
    },

    dexterity: {
      icon: <FontAwesomeIcon icon={faBullseye} />,
      skills: ["acrobatics", "sleight-of-hand", "stealth", "saving-throw-dex"],
    },

    constitution: {
      icon: <FontAwesomeIcon icon={faHeartPulse} />,
      skills: ["endurance", "saving-throw-con"],
    },

    intelligence: {
      icon: <FontAwesomeIcon icon={faLightbulb} />,
      skills: [
        "arcana",
        "history",
        "investigation",
        "nature",
        "religion",
        "saving-throw-int",
      ],
    },
    wisdom: {
      icon: <FontAwesomeIcon icon={faBrain} />,
      skills: [
        "animal-handling",
        "insight",
        "medicine",
        "perception",
        "survival",
        "saving-throw-wis",
      ],
    },
    charisma: {
      icon: <FontAwesomeIcon icon={faMasksTheater} />,
      skills: [
        "deception",
        "intimidation",
        "performance",
        "persuasion",
        "saving-throw-cha",
      ],
    },
  };

  let currentAbility;
  let abilityName;
  let proficiency;
  let label;
  let content;

  if (type === "main-ability") {
    const relevantSkills = abilities[name].skills.slice(0, -1);

    const skillsTooltip = (
      <>
        {relevantSkills.map((name, index) => (
          <React.Fragment key={index}>
            {name.split("-").join(" ")} <br />
          </React.Fragment>
        ))}
      </>
    );

    content = (
      <div className={classes.singleAbility}>
        <Tooltip title={skillsTooltip} trigger={"click"}>
          <p className={classes.abilityTitle}>
            {" "}
            {abilities[name].icon}
            {name[0].toUpperCase() + name.slice(1)}
          </p>
        </Tooltip>
        <div className={classes.abilityCircle}>
          {" "}
          <div className={classes.abilityScore}>{value}</div>
          <div className={classes.modifierScore}>
            {modifier > 0 ? "+" : ""} {modifier}
          </div>
        </div>
      </div>
    );
  } else {
    Object.entries(abilities).forEach(([key, value]) => {
      if (value.skills.includes(skill)) {
        currentAbility = value;
        abilityName = key;
      }
    });

    if (type === "saving-throw") {
      proficiency = checkIfProficient(skill, true);
      label = abilityName[0].toUpperCase() + abilityName.slice(1);
    } else if (type === "skill") {
      proficiency = checkIfProficient(`skill-${skill}`);
      label = skill
        .split("-")
        .map((word) => {
          return word[0].toUpperCase() + word.slice(1);
        })
        .join(" ");
    }
    content = (
      <div className={classes.singleSkill}>
        <FontAwesomeIcon icon={proficiency ? faCircleDot : faCircle} />
        <span className={classes.skillScore}>
          {modifier + proficiency >= 0 ? "+" : ""}
          {modifier + proficiency}
        </span>{" "}
        {currentAbility.icon}
        {<span className={classes.skillLabel}>{label}</span>}{" "}
      </div>
    );
  }

  return <>{content}</>;
};

export default SkillsModifierContainer;
