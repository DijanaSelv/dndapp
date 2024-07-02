import React from "react";
import classes from "../../pages/shoppage/ShopPage.module.css";

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
      {item.properties && item.properties.length !== 0 && (
        <p>
          <span className={classes.categoryDesc}>Properties: </span>{" "}
          {item.properties?.join(", ")}
        </p>
      )}
      {item["vehicle_category"] && (
        <p className={classes.itemspecs}>{item["vehicle_category"]}</p>
      )}
      {item.special && item.special?.length !== 0 && (
        <p>
          <span className={classes.categoryDesc}>Special: </span>{" "}
          {item.special?.join(", ")}
        </p>
      )}
      {showDescription()}
      {item.speed && (
        <p>
          <span className={classes.categoryDesc}>Speed: </span>
          {item.speed.quantity} {item.speed.unit}
        </p>
      )}
      <p>
        <span className={classes.categoryDesc}>Weight: </span>{" "}
        {item.weight || 0}
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

export default GeneralItemDescription;
