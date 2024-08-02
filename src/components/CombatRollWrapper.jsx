import classes from "../pages/combatpage/CombatPage.module.css";

export const CombatRollWrapper = ({ character, content, type, uid }) => {
  return <div>{`${character} rolled a ${content} (${type}) `}</div>;
};
