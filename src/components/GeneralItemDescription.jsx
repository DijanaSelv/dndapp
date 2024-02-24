import React from 'react';
import classes from '../pages/shoppage/ShopPage.module.css';

const GeneralItemDescription = ({ item }) => {
  return (
    <div className={classes.itemDescription}>
      <h3>{item.name}</h3>
      {item.properties.length !== 0 && (
        <p>
          <span className={classes.categoryDesc}>Properties: </span>{' '}
          {item.properties.join(', ')}
        </p>
      )}
      {item.special.length !== 0 && (
        <p>
          <span className={classes.categoryDesc}>Special: </span>{' '}
          {item.special.join(', ')}
        </p>
      )}
      {item.desc.length !== 0 && (
        <p className={classes.description}>{item.desc[0]}</p>
      )}
      <p>
        <span className={classes.categoryDesc}>Weight: </span> {item.weight}
      </p>
      <p>
        <span className={classes.categoryDesc}>Price: </span>{' '}
        {item.cost.quantity}
        {item.cost.unit}
      </p>
    </div>
  );
};

export default GeneralItemDescription;
