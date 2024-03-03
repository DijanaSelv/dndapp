import { useNavigate, useParams } from "react-router";
import { Button, Input, Select, Table, Tabs } from "antd";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createItemObjectForShop,
  getItems,
} from "../../app/actions/dndApiActions";
import ItemDescriptionCard from "../../components/ItemDescriptionCard";
import classes from "../shoppage/ShopPage.module.css";
import { MinusCircleOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { updateShopItems } from "../../app/actions/databaseActions";
import { getShopsData } from "../../app/actions/databaseActions";
import AddOrRemoveItems from "../../components/AddOrRemoveItems";
import CancelModal from "../../components/CancelModal";
import { shopsSliceActions } from "../../app/shopsSlice";

const EditShopPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { TextArea } = Input;
  const params = useParams();

  const { shops } = useSelector((state) => state.shopsSlice);
  const { isLoading } = useSelector((state) => state.uiSlice);
  const shop = shops[params.shopId];
  const [shopItemsData, setShopItemsData] = useState([]);
  const [imageUrl, setImageUrl] = useState();
  const [shopTitle, setShopTitle] = useState();
  const [clickedItem, setClickedItem] = useState();
  const [shopDescription, setShopDescription] = useState();
  const [showModal, setShowModal] = useState(false);

  //fetch items in Add Items tab
  const [selectedCategoryPath, setSelectedCategoryPath] =
    useState("adventuring-gear");
  const [displayItemsToAdd, setDisplayItemsToAdd] = useState();
  const [selectCategories, setSelectCategories] = useState();

  const selectHandler = (value) => {
    setSelectedCategoryPath(value);
  };

  const setCategories = async () => {
    const categoriesArray = [];
    const categories = await getItems("/api/equipment-categories");
    for (const category of categories.results) {
      categoriesArray.push({ value: category.index, label: category.name });
    }
    setSelectCategories(categoriesArray);
  };

  const clickHandler = async (url) => {
    const data = await getItems(url);
    setClickedItem(data);
  };

  //populate items that are already in the shop on render, refresh
  const getShop = () => {
    dispatch(getShopsData(params.campaignId));
  };

  const populateItemsInShop = () => {
    const initialshopItemsData = Object.keys(shop.items).map((itemKey) => ({
      id: itemKey,
      name: shop.items[itemKey].name,
      price: shop.items[itemKey].price,
      amount: shop.items[itemKey].amount,
      url: shop.items[itemKey].url,
    }));
    setShopItemsData(initialshopItemsData);
  };

  useEffect(() => {
    getShop();
  }, []);

  //when shop data is fetched populate the items from store
  useEffect(() => {
    if (shop) {
      populateItemsInShop();
      setImageUrl(shop.image);
      setShopTitle(shop.title);
      setShopDescription(shop.description);
    }
  }, [shop]);

  //update the added items on add item from the state
  useEffect(() => {
    if (shop) {
      populateItemsInShop();
    }
  }, [shop?.items]);

  //populate the items from dnd api

  const populateAddItemsTable = async () => {
    let displayshopItemsData = [];
    const displayData = await getItems(
      `/api/equipment-categories/${selectedCategoryPath}`
    );
    for (const element of displayData.equipment) {
      displayshopItemsData.push({
        id: element.index,
        name: element.name,
        url: element.url,
      });
    }
    setDisplayItemsToAdd(displayshopItemsData);
  };

  useEffect(() => {
    populateAddItemsTable();
  }, [selectedCategoryPath]);

  // get all the categories from dnd api
  useEffect(() => {
    if (!selectCategories) {
      setCategories();
    }
  }, []);

  const memoizedCategories = useMemo(
    () => selectCategories,
    [selectCategories]
  );

  //TABLE COLUMNS
  const columnsForEdit = [
    {
      title: "name",
      dataIndex: "name",
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
          onChange={(e) =>
            handleItemChange(record.id, "amount", e.target.value)
          }
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
        <AddOrRemoveItems itemToEdit={record} shop={shop} />
      ),
    },
  ];

  const columnsForAdd = [
    {
      title: "name",
      dataIndex: "name",
      sorter: {
        compare: (a, b) => {
          if (a.name === b.name) return 0;
          return a.name > b.name ? 1 : -1;
        },
      },
    },
    {
      title: <span>add/remove</span>,
      dataIndex: "actions",
      render: (_, record) => (
        <AddOrRemoveItems itemToEdit={record} shop={shop} />
      ),
    },
  ];

  //USER EDIT INPUT
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

  // Update the item that is edited in input
  const handleItemChange = (itemId, field, value) => {
    setShopItemsData((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId
          ? { ...item, [field]: Math.sign(value) === 1 ? value : 0 }
          : item
      )
    );
  };

  const handleResetChange = () => {
    setImageUrl(shop.image);
  };

  const saveChangesHandler = () => {
    const updatedItems = {};
    shopItemsData.map((item) => (updatedItems[item.id] = { ...item }));
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

  const addAllItemsHandler = async (shop) => {
    for (const itemToAdd of displayItemsToAdd) {
      const itemData = await getItems(itemToAdd.url);
      const newItem = createItemObjectForShop(itemData);
      const payload = {
        item: newItem,
        shopId: shop.id,
      };
      dispatch(shopsSliceActions.addItemToShop(payload));
    }
  };

  const tabs = [
    {
      key: "1",
      label: "Edit Items",
      children: (
        <div className={classes.tableDiv}>
          <Table
            loading={isLoading}
            columns={columnsForEdit}
            dataSource={shopItemsData}
            pagination={false}
            size={"small"}
            rowKey="id"
            onRow={(record) => {
              return {
                onClick: () => clickHandler(record.url),
              };
            }}
            className={classes.tableOfItems}
          />
          <div className={classes.buttons}>
            <Button
              style={{ borderColor: "#7cacbb" }}
              onClick={saveChangesHandler}
            >
              Save
            </Button>

            <Button
              danger
              onClick={() => {
                setShowModal(true);
              }}
            >
              Cancel
            </Button>

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
      children: (
        <div className={classes.tableDiv}>
          <Select
            defaultValue="Adventuring Gear"
            options={memoizedCategories}
            style={{ width: "250px" }}
            onSelect={(value) => selectHandler(value)}
          />
          <Button onClick={() => addAllItemsHandler(shop)}>
            {" "}
            <PlusCircleOutlined />
            Add All{" "}
          </Button>
          <Table
            loading={isLoading}
            columns={columnsForAdd}
            dataSource={displayItemsToAdd}
            size={"small"}
            rowKey="id"
            onRow={(record) => {
              return {
                onClick: () => clickHandler(record.url),
              };
            }}
            pagination={{
              defaultPageSize: 25,
            }}
            className={classes.tableOfItems}
          />
          <div className={classes.buttons}>
            <Button
              style={{ borderColor: "#7cacbb" }}
              onClick={saveChangesHandler}
            >
              Save
            </Button>

            <Button danger onClick={() => setShowModal(true)}>
              Cancel
            </Button>

            <Button type="primary" danger>
              Delete Shop
            </Button>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className={classes.content}>
      <CancelModal showModal={showModal} setShowModal={setShowModal} />
      <div className={classes.shopMenu}>
        <h3>Title</h3>
        <Input value={shopTitle} onChange={handleTitleChange}></Input>
        <h4>Description</h4>
        <TextArea
          value={shopDescription}
          onChange={handleDescriptionChange}
        ></TextArea>
        <Tabs defaultActiveKey="1" items={tabs}></Tabs>
      </div>
      <div className={classes.details}>
        <p>Image URL:</p>
        <Input name="image" value={imageUrl} onChange={handleImageChange} />

        <Button htmlType="submit">Apply Image</Button>
        <Button onClick={(e) => handleResetChange(null, null, null)}>
          Reset Image
        </Button>
        <img src={imageUrl} style={{ width: "200px" }} />
        {clickedItem && <ItemDescriptionCard item={clickedItem} />}
      </div>
    </div>
  );
};
export default EditShopPage;
