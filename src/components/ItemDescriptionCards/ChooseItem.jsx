import { DashOutlined, SmallDashOutlined } from "@ant-design/icons";
import classes from "../../pages/shoppage/ShopPage.module.css";

const ChooseItem = ({ item }) => {
  return (
    <div className={`${classes.itemDescription} ${classes.chooseItem}`}>
      <p>Click on an item to see more details</p>
    </div>
  );
};

export default ChooseItem;
