import classes from "../pages/shoppage/ShopPage.module.css";

const ArmorDescription = ({ item }) => {
  const propertyList = item.properties.map((property) => property.index);
  const specialList = item.special.map((special) => special.index);

  return (
    <div className={classes.itemDescription}>
      <h3>{item.name}</h3>
      <p className={classes.itemspecs}>{item.armor_category}</p>
      <p>
        <span className={classes.categoryDesc}>AC: </span>{" "}
        {item.armor_class.base}
      </p>
      {propertyList.length > 0 && (
        <p>
          <span className={classes.categoryDesc}>Properties: </span>{" "}
          {propertyList.join(", ")}
        </p>
      )}
      {specialList.length > 0 && (
        <p>
          <span className={classes.categoryDesc}>Special: </span>{" "}
          {specialList.join(", ")}
        </p>
      )}
      <p>
        <span className={classes.categoryDesc}>Weight: </span> {item.weight}
      </p>
      <p>
        <span className={classes.categoryDesc}>Price: </span>{" "}
        {item.cost.quantity}
        {item.cost.unit}
      </p>
    </div>
  );
};

export default ArmorDescription;
