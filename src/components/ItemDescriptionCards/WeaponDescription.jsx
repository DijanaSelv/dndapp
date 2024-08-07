import classes from "../../pages/shoppage/ShopPage.module.css";

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
    range,
    desc,
  } = item;

  const propertyList =
    item.properties && item.properties.map((property) => property.index);
  const specialList = item.special && item.special.map((special) => special);

  return (
    <div className={classes.itemDescription}>
      <h3>{name}</h3>
      {properties && properties.length > 0 && (
        <p className={classes.itemspecs}>{propertyList.join(", ")}</p>
      )}
      {desc && desc.length > 0 && (
        <p className={classes.itemspecs}>{desc[0]}</p>
      )}
      <p>
        <span className={classes.categoryDesc}>Category:</span>{" "}
        {weapon_category || "/"}
      </p>
      <p>
        <span className={classes.categoryDesc}>Type:</span>{" "}
        {weapon_range || "/"}
      </p>

      {range && (
        <p>
          <span className={classes.categoryDesc}>Range:</span> {range.normal}
          {range.long ? `/${range.long}` : " ft"}
        </p>
      )}
      {damage && (
        <p>
          <span className={classes.categoryDesc}>Damage:</span>{" "}
          {damage.damage_dice}, {damage.damage_type.index}
        </p>
      )}
      {item["two_handed_damage"] && (
        <p>
          <span className={classes.categoryDesc}>Two-handed Damage:</span>{" "}
          {item["two_handed_damage"].damage_dice},{" "}
          {item["two_handed_damage"].damage_type.index}
        </p>
      )}
      {special && special.length > 0 && (
        <p>
          <span className={classes.categoryDesc}>Special:</span>{" "}
          {specialList.join(", ")}
        </p>
      )}
      {desc && desc.length > 0 && <p> {desc.join(". ")}</p>}
      <p>
        <span className={classes.categoryDesc}>Weight:</span> {weight || "/"}
      </p>
      <p>
        {item.cost && (
          <>
            <span className={classes.categoryDesc}>Price: </span>
            {item.cost?.quantity || "/"} {item.cost?.unit}
          </>
        )}
      </p>
    </div>
  );
};

export default WeaponDescription;
