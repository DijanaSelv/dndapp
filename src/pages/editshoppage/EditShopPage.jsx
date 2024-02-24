import { useNavigate, useParams } from "react-router";
import { Button, Input, Table, Tabs } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getItem } from "../../app/actions/dndApiActions";
import ItemDescriptionCard from "../../components/ItemDescriptionCard";
import classes from "../shoppage/ShopPage.module.css";
import { MinusCircleOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { updateShopItems } from "../../app/actions/databaseActions";

const EditShopPage = () => {
  const { TextArea } = Input;
  const params = useParams();
  const [itemsData, setItemsData] = useState([]);
  const [imageUrl, setImageUrl] = useState();
  const [shopTitle, setShopTitle] = useState();
  const [shopDescription, setShopDescription] = useState();
  const [clickedItem, setClickedItem] = useState();
  const { shops } = useSelector((state) => state.shopsSlice);
  const shop = shops[params.shopId];
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const initialItemsData = Object.keys(shop.items).map((itemKey) => ({
      id: itemKey,
      name: shop.items[itemKey].name,
      price: shop.items[itemKey].price,
      amount: shop.items[itemKey].amount,
      url: shop.items[itemKey].url,
    }));
    setItemsData(initialItemsData);
    setImageUrl(shop.image);
    setShopTitle(shop.title);
    setShopDescription(shop.description);
  }, []);

  const clickHandler = async (url) => {
    const data = await getItem(url);
    setClickedItem(data);
  };

  const columns = [
    {
      title: "name",
      dataIndex: "name",
      render: (text, record) => (
        <a onClick={() => clickHandler(record.url)}>{text}</a>
      ),
      sorter: {
        compare: (a, b) => {
          if (a.name === b.name) return 0;
          return a.name > b.name ? 1 : -1;
        },
      },
    },
    {
      title: "amount",
      dataIndex: "amount",
      render: (text, record) => (
        <Input
          type="number"
          value={text > 0 ? text : ""}
          // onChange={(e) => handleChange(e, e.target.value, record.id, "amount")}
          onChange={(e) => handleItemChange(record.id, "amount", e.target.value)}
        ></Input>
      ),
      sorter: {
        compare: (a, b) => a.amount - b.amount,
      },
    },
    {
      title: "price (gp)",
      dataIndex: "price",
      render: (text, record) => (
        <Input
          type="number"
          value={text > 0 ? text : ""}
          // onChange={(e) => handleChange(e, e.target.value, record.id, "price")}
          onChange={(e) => handleItemChange(record.id, "price", e.target.value)}
        ></Input>
      ),
      sorter: {
        compare: (a, b) => a.price - b.price,
      },
    },
    {
      title: "remove",
      dataIndex: "actions",
      render: (_, record) => (
        <a>
          <MinusCircleOutlined />
        </a>
      ),
    },
  ];

  //EDITS
  const handleTitleChange = (e) => {
    setShopTitle(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setShopDescription(e.target.value);
  };

  const handleImageChange = (e) => {
    const imageUrl = e.target.value;
    setImageUrl(imageUrl);
  };

  const handleItemChange = (itemId, field, value) => {
    setItemsData((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId
          ? { ...item, [field]: Math.sign(value) === 1 ? value : 0 }
          : item
      )
    );
  };

  const handleResetChange = () => {    
    setImageUrl(shop.image);
  }

  // const handleChange = (e, value, itemId, field) => {
  //   if (field === "title") {
  //     setShopTitle(value);
  //   } else if (field === "image") {
  //     if (e) {
  //       e.preventDefault();
  //       const imageInput = e.target.elements["image"].value;
  //       setImageUrl(imageInput ? imageInput : shop.image);
  //     } else {
  //       setImageUrl(shop.image);
  //     }
  //   } else if (field === "description") {
  //     setShopDescription(value);
  //   } else {
  //     setItemsData((prevItems) =>
  //       prevItems.map((item) =>
  //         item.id === itemId
  //           ? { ...item, [field]: Math.sign(value) === 1 ? value : 0 }
  //           : item
  //       )
  //     );
  //   }
  // };

  const saveChangesHandler = () => {
    const updatedItems = {};
    itemsData.map((item) => (updatedItems[item.id] = { ...item }));
    //const shopid = shop.id;
    const newShopData = {
      title: shopTitle,
      description: shopDescription,
      id: shop.id,
      image: imageUrl,
      items: updatedItems,
    };
    dispatch(updateShopItems(newShopData, params.campaignId, shop.id));
    navigate(-1);
  };

  const tabs = [
    {
      key: "1",
      label: "Edit Items",
      children: (
        <div className={classes.table}>
          <Table
            columns={columns}
            dataSource={itemsData}
            pagination={false}
            size={"small"}
            rowKey="id"
          />
          <div className={classes.buttons}>
            <Button
              style={{ borderColor: "#7cacbb" }}
              onClick={saveChangesHandler}
            >
              Save
            </Button>
            <Link to={-1}>
              <Button danger>Cancel</Button>
            </Link>
            <Button type="primary" danger>
              Delete Shop
            </Button>
          </div>
        </div>
      ),
    },
    {
      key: "2",
      label: "Add Items",
      children: "Content of Tab Pane 2",
    },
  ];

  return (
    <div className={classes.content}>
      <div className={classes.shopMenu}>
        <h3>Title</h3>
        <Input
          value={shopTitle}
          // onChange={(e) => handleChange(e, e.target.value, null, "title")}
          // onChange={(e) => handleTitleChange(e)} // $ mozhi i vaka msm ama poubo e dolnoto ko sho e, oti mozhi vaka rerender da napraj 
          onChange={handleTitleChange}
        ></Input>
        <h4>Description</h4>
        <TextArea
          value={shopDescription}
          // onChange={(e) => handleChange(e, e.target.value, null, "description")}
          onChange={handleDescriptionChange}
        ></TextArea>
        <Tabs defaultActiveKey="1" items={tabs}></Tabs>
      </div>
      <div className={classes.details}>
        <p>Image URL:</p>
        {/* <form onSubmit={(e) => handleChange(e, null, null, "image")}> */}

          {/* <Input name="image"></Input>{" "} */}
          
          <Input
            name="image"
            value={imageUrl}
            onChange={handleImageChange}
          />

          <Button htmlType="submit">Apply Image</Button>
          <Button onClick={(e) => handleResetChange(null, null, null)}>
            Reset Image
          </Button>
        {/* </form> */}
        <img src={imageUrl} style={{ width: "200px" }} />
        {clickedItem && <ItemDescriptionCard item={clickedItem} />}
      </div>
    </div>
  );
};
export default EditShopPage;
