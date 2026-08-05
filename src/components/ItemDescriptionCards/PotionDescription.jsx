import classes from "../../pages/shoppage/ShopPage.module.css";

const PotionDescription = ({ item }) => {
  const { name, cost, rarity } = item;

  const showDescription = () => {
    let description = [];
    if (item.desc) {
      for (const desc of item.desc) {
        description.push(<p key={desc}>{desc}</p>);
      }
    }
    return description;
  };
  return (
    <div className={classes.itemDescription}>
      <h3>{name}</h3>
      <p>{rarity}</p>
      {showDescription()}

      <p>
        {item.cost && (
          <>
            <span className={classes.categoryDesc}>Price: </span>
            {cost?.quantity || "/"} {cost?.unit}
          </>
        )}
      </p>
    </div>
  );
};

export default PotionDescription;
