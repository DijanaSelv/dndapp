import classes from "../../pages/shoppage/ShopPage.module.css";

const FeatureDescription = ({ item }) => {
  const showDescription = () => {
    let description = [];
    if (item.desc) {
      for (const desc of item.desc) {
        description.push(<p key={desc}>{desc}</p>);
      }
    }
    return description;
  };

  const showPrerequisites = () => {
    let prerequisites = [];

    if (item.prerequisites) {
      for (const prereq of item.prerequisites) {
        prerequisites.push(<p key={prereq}>{prereq}</p>);
      }
    }
    return prerequisites;
  };

  return (
    <div className={classes.itemDescription}>
      <h3>{item.name}</h3>

      {item.class && (
        <p>
          <span className={classes.categoryDesc}>Class: </span>{" "}
          {item.class.name}
        </p>
      )}
      {item.level && (
        <p>
          <span className={classes.categoryDesc}>Level: </span> {item.level}
        </p>
      )}

      {showDescription()}
      {showPrerequisites()}
    </div>
  );
};

export default FeatureDescription;
