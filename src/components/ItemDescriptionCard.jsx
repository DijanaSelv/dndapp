// import classes from "../pages/shoppage/ShopPage.module.css";
import ArmorDescription from "./ItemDescriptionCards/ArmorDescription";
import PotionDescription from "./ItemDescriptionCards/PotionDescription";
import WeaponDescription from "./ItemDescriptionCards/WeaponDescription";
import GeneralItemDescription from "./ItemDescriptionCards/GeneralItemDescription";

const ItemDescriptionCard = ({ item }) => {
  let content;

  // Check the type of item and render the appropriate component
  switch (item.equipment_category.index) {
    case "armor":
      content = <ArmorDescription item={item} />;
      break;
    case "potion":
      content = <PotionDescription item={item} />;
      break;
    case "weapon":
      content = <WeaponDescription item={item} />;
      break;
    default:
      content = <GeneralItemDescription item={item} />;
  }

  return content;
};

export default ItemDescriptionCard;

// if (item["equipment_category"].index === "armor") {
//   content = (
//     <div className="item_description">
//       <h4>{item.name}</h4>
//       <p className={classes.itemspecs}> {item["armor_category"]}</p>
//       <p>
//         <span className={classes.categoryDesc}>AC: </span>{" "}
//         {item["armor_class"].base}
//       </p>

//       {item.properties.length !== 0 && (
//         <p>
//           <span className={classes.categoryDesc}>Properties: </span>{" "}
//           {propertyList.join(", ")}
//         </p>
//       )}
//       {item.special.length !== 0 && (
//         <p>
//           <span className={classes.categoryDesc}>Special: </span>{" "}
//           {specialList.join(", ")}
//         </p>
//       )}
//       <p>
//         <span className={classes.categoryDesc}>Weight: </span> {item.weight}
//       </p>
//       <p>
//         <span className={classes.categoryDesc}>Price: </span>{" "}
//         {item.cost.quantity}
//         {item.cost.unit}
//       </p>
//     </div>
//   );
// }
// if (item["equipment_category"].index === "potion") {
//   content = (
//     <div className={classes.itemDescription}>
//       <h3>{item.name}</h3>
//       {item.desc.length !== 0 && (
//         <p className={classes.itemspecs}>{item.desc[0]}</p>
//       )}
//       {item.desc.length !== 0 && (
//         <p className={classes.description}>{item.desc[1]}</p>
//       )}
//       {/* {item.properties.length !== 0 && (
//         <p>Properties: {propertyList.join(", ")}</p>
//       )}
//       {item.special.length !== 0 && <p>Special: {specialList.join(", ")}</p>} */}
//       <p>
//         <span className={classes.categoryDesc}>Price:</span>{" "}
//         {item.cost?.quantity || item.rarity.name === "Common" ? "50" : "100"}
//         {item.cost?.unit || "gp"}
//       </p>
//     </div>
//   );
// }

// else if (item["equipment_category"].index === "weapon") {
//   content = (
//     <div className={classes.itemDescription}>
//       <h3>{item.name}</h3>
//       {item.properties.length !== 0 && (
//         <p className={classes.itemspecs}>{propertyList.join(", ")}</p>
//       )}
//       <p>
//         <span className={classes.categoryDesc}>Category: </span>
//         {item["weapon_category"]}
//       </p>
//       <p>
//         <span className={classes.categoryDesc}>Range: </span>{" "}
//         {item["weapon_range"]}
//       </p>
//       <p>
//         <span className={classes.categoryDesc}>Damage: </span>{" "}
//         {item.damage["damage_dice"]}, {item.damage["damage_type"].index}
//       </p>

//       {item.special.length !== 0 && (
//         <p>
//           <span className={classes.categoryDesc}>Special: </span>{" "}
//           {specialList.join(", ")}
//         </p>
//       )}

//       <p>
//         <span className={classes.categoryDesc}>Weight: </span> {item.weight}
//       </p>
//       <p>
//         <span className={classes.categoryDesc}>Price: </span>{" "}
//         {item.cost.quantity}
//         {item.cost.unit}
//       </p>
//     </div>
//   );
// } else {
//   content = (
//     <div className={classes.itemDescription}>
//       <h3>{item.name}</h3>
//       {item.properties.length !== 0 && (
//         <p>
//           <span className={classes.categoryDesc}>Properties: </span>{" "}
//           {propertyList.join(", ")}
//         </p>
//       )}

//       {item.special.length !== 0 && (
//         <p>
//           <span className={classes.categoryDesc}>Special: </span>{" "}
//           {specialList.join(", ")}
//         </p>
//       )}
//       {item.desc.length !== 0 && (
//         <p className={classes.description}>{item.desc[0]}</p>
//       )}
//       <p>
//         <span className={classes.categoryDesc}>Weight: </span> {item.weight}
//       </p>

//       <p>
//         <span className={classes.categoryDesc}>Price: </span>{" "}
//         {item.cost.quantity}
//         {item.cost.unit}
//       </p>
//     </div>
//   );
// }

/* 
EQUIPMENT CATEGORIES:
Adventuring Gear: This category includes various items useful for adventurers, such as backpacks, bedrolls, rope, and torches.

Armor: Armor includes protective gear worn by characters to reduce damage from attacks. This category may include items such as light armor, medium armor, heavy armor, and shields.

Artisan's Tools: Artisan's tools are specialized equipment used by characters proficient in certain artisan skills, such as blacksmithing, carpentry, or alchemy.

Consumables: Consumables are items that are used up or consumed when activated, such as potions, scrolls, or magical items with limited charges.

Mounts and Vehicles: This category includes creatures that characters can ride or use as mounts, as well as vehicles such as carts, wagons, or ships.

Weapons: Weapons are items used in combat to deal damage to opponents. This category includes melee weapons (swords, axes, etc.), ranged weapons (bows, crossbows, etc.), and ammunition.

Tools: Tools are items used for various tasks, such as thieves' tools for lockpicking, navigators' tools for navigation, or musical instruments for performances.

Substances: Substances are materials that characters can use or consume for various effects, such as alchemical substances, poisons, or magical reagents. */
