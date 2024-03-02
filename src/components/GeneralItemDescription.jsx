import React from "react";
import classes from "../pages/shoppage/ShopPage.module.css";

const GeneralItemDescription = ({ item }) => {
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
      <h3>{item.name}</h3>
      {item.properties.length !== 0 && (
        <p>
          <span className={classes.categoryDesc}>Properties: </span>{" "}
          {item.properties.join(", ")}
        </p>
      )}
      {item.special.length !== 0 && (
        <p>
          <span className={classes.categoryDesc}>Special: </span>{" "}
          {item.special.join(", ")}
        </p>
      )}
      {showDescription()}
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

export default GeneralItemDescription;
