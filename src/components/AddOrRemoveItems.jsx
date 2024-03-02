import { MinusCircleOutlined, PlusCircleOutlined } from "@ant-design/icons";

const AddOrRemoveItems = ({ itemId, shopItems }) => {
  //check if item id is in shops items. If yes, display minus, if not plus. On click they will add or remove that object of the shops in state.

  const addOrRemoveItemHandler = () => {};
  const content = (
    <a onClick={addOrRemoveItemHandler}>
      <PlusCircleOutlined />
    </a>
  );
  return content;
};

export default AddOrRemoveItems;
