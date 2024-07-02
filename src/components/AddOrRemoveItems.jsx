import { useDispatch } from "react-redux";

import {
  createItemObjectForShop,
  getItems,
} from "../app/actions/dndApiActions";
import { shopsSliceActions } from "../app/shopsSlice";

import { AnimatePresence, motion } from "framer-motion";
import { MinusCircleOutlined, PlusCircleOutlined } from "@ant-design/icons";

import classes from "../pages/shoppage/ShopPage.module.css";
import { currencyToCopper } from "../app/actions/uitls";

const AddOrRemoveItems = ({ itemToEdit, shop }) => {
  const dispatch = useDispatch();

  const addItemHandler = async () => {
    const itemData = await getItems(itemToEdit.url);
    const item = createItemObjectForShop(itemData);
    console.log(item);
    item.price = currencyToCopper(item.price.gp, item.price.sp, item.price.cp);
    const payload = {
      item,
      shopId: shop.id,
    };
    dispatch(shopsSliceActions.addItemToShop(payload));
  };

  const removeItemHandler = async () => {
    dispatch(
      shopsSliceActions.removeItemFromShop({
        itemId: itemToEdit.id,
        shopId: shop.id,
      })
    );
  };

  const content = (
    <AnimatePresence mode="wait">
      {" "}
      {shop.items && Object.keys(shop.items).includes(itemToEdit.id) ? (
        <motion.div
          key="remove"
          initial={{ scale: 1.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.5 }}
          transition={{ duration: 0.1 }}
          whileHover={{ scale: 1.2 }}
        >
          <a onClick={removeItemHandler}>
            <MinusCircleOutlined className={classes.removeIcon} />
          </a>
        </motion.div>
      ) : (
        <motion.div
          key="add"
          initial={{ scale: 1.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.5 }}
          transition={{ duration: 0.1 }}
          whileHover={{ scale: 1.2 }}
        >
          <a onClick={addItemHandler}>
            <PlusCircleOutlined className={classes.addIcon} />
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  );
  return content;
};

export default AddOrRemoveItems;
