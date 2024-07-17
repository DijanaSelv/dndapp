// import classes from "../pages/shoppage/ShopPage.module.css";
import ArmorDescription from "./ItemDescriptionCards/ArmorDescription";
import PotionDescription from "./ItemDescriptionCards/PotionDescription";
import WeaponDescription from "./ItemDescriptionCards/WeaponDescription";
import GeneralItemDescription from "./ItemDescriptionCards/GeneralItemDescription";
import ChooseItem from "./ItemDescriptionCards/ChooseItem";
import FeatureDescription from "./ItemDescriptionCards/FeatureDescription";

const ItemDescriptionCard = ({ item }) => {
  let content;

  if (item.url.includes("features")) {
    content = <FeatureDescription item={item} />;
  }
  // Check the type of item and render the appropriate component
  else {
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
      case "choose":
        content = <ChooseItem />;
        break;
      default:
        content = <GeneralItemDescription item={item} />;
    }
  }

  //TODO: Ammunition category

  return content;
};

export default ItemDescriptionCard;

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
