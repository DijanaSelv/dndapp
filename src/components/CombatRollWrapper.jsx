export const CombatRollWrapper = ({ character, content, type }) => {
  return <div>{`${character} rolled a ${content} ${type} score`}</div>;
};
