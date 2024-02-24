import classes from "../pages/shoppage/ShopPage.module.css";

const PotionDescription = ({ item }) => {
  const { name, desc, cost, rarity } = item;

  return (
    <div className={classes.itemDescription}>
      <h3>{name}</h3>
      {desc.length > 0 && (
        <>
          <p className={classes.itemspecs}>{desc[0]}</p>
          {desc.length > 1 && (
            <p className={classes.description}>{desc[1]}</p>
          )}
        </>
      )}

      <p>
        <span className={classes.categoryDesc}>Price:</span>{" "}
        {cost?.quantity || (rarity.name === "Common" ? "50" : "100")}
        {cost?.unit || "gp"}
      </p>
    </div>
  );
};

export default PotionDescription;
