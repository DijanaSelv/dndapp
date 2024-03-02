import classes from "../pages/shoppage/ShopPage.module.css";

const WeaponDescription = ({ item }) => {
  const {
    name,
    properties,
    weapon_category,
    weapon_range,
    damage,
    special,
    weight,
    cost,
  } = item;

  const propertyList = item.properties.map((property) => property.index);
  const specialList = item.special.map((special) => special.index);

  return (
    <div className={classes.itemDescription}>
      <h3>{name}</h3>
      {properties.length > 0 && (
        <p className={classes.itemspecs}>{propertyList.join(", ")}</p>
      )}
      <p>
        <span className={classes.categoryDesc}>Category:</span>{" "}
        {weapon_category}
      </p>
      <p>
        <span className={classes.categoryDesc}>Range:</span> {weapon_range}
      </p>
      <p>
        <span className={classes.categoryDesc}>Damage:</span>{" "}
        {damage.damage_dice}, {damage.damage_type.index}
      </p>
      {special.length > 0 && (
        <p>
          <span className={classes.categoryDesc}>Special:</span>{" "}
          {specialList.join(", ")}
        </p>
      )}
      <p>
        <span className={classes.categoryDesc}>Weight:</span> {weight}
      </p>
      <p>
        <span className={classes.categoryDesc}>Price:</span> {cost.quantity}
        {cost.unit}
      </p>
    </div>
  );
};

export default WeaponDescription;
