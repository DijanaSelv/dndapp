import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";

import {
  createItemObjectForShop,
  getItems,
} from "../../app/actions/dndApiActions";
import {
  getShopsData,
  updateShopItems,
} from "../../app/actions/databaseActions";
import ItemDescriptionCard from "../../components/ItemDescriptionCard";
import AddOrRemoveItems from "../../components/AddOrRemoveItems";
import CancelModal from "../../components/CancelModal";
import { shopsSliceActions } from "../../app/shopsSlice";

import { Button, Input, Select, Spin, Table, Tabs } from "antd";
import { DeleteOutlined, PlusCircleOutlined } from "@ant-design/icons";
import classes from "../shoppage/ShopPage.module.css";
import DeleteModal from "../../components/DeleteModal";

const EditShopPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { TextArea } = Input;
  const params = useParams();

  const { isLoading } = useSelector((state) => state.uiSlice);
  const { shops } = useSelector((state) => state.shopsSlice);
  const shop = shops[params.shopId];

  //STATES TODO: should refactor into one state
  const [shopItemsData, setShopItemsData] = useState([]);
  const [imageUrl, setImageUrl] = useState("");
  const [originalImageUrl, setOriginalImageUrl] = useState("");
  const [shopTitle, setShopTitle] = useState();
  const [clickedItem, setClickedItem] = useState();
  const [shopDescription, setShopDescription] = useState();
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [addingItemsLoading, setAddingItemsLoading] = useState(false);
  //fetch items in Add Items tab
  const [selectedCategoryPath, setSelectedCategoryPath] =
    useState("adventuring-gear");
  const [displayItemsToAdd, setDisplayItemsToAdd] = useState();
  const [selectCategories, setSelectCategories] = useState();

  const deleteButtonHandler = () => {
    console.log("delete");
    setShowDeleteModal(true);
  };

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
    console.log(data);
    setClickedItem(data);
  };

  //------------------Populating and fetching shop data
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

  //update the added items on add item from the state and on render
  useEffect(() => {
    if (shop) {
      shop.items ? populateItemsInShop() : setShopItemsData([]);
      setImageUrl(shop.image);
      setShopTitle(shop.title);
      setShopDescription(shop.description);
      if (!originalImageUrl) {
        setOriginalImageUrl(shop.image);
      }
    }
  }, [shop, originalImageUrl]);

  //populate the items from dnd api
  const populateAddItemsTable = async () => {
    let displayshopItemsData = [];
    const displayData = await getItems(
      `/api/equipment-categories/${selectedCategoryPath}`
    );
    for (const element of displayData.equipment) {
      //the api has double entries for some items and causes error in the table rendering (same kay for more items) this is to filter in case it happens
      if (!displayshopItemsData.some((item) => item.id === element.index)) {
        displayshopItemsData.push({
          id: element.index,
          name: element.name,
          url: element.url,
        });
      }
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
    const payload = {
      shopId: shop.id,
      title: e.target.value,
    };
    dispatch(shopsSliceActions.changeTitleOfShop(payload));
  };

  const handleDescriptionChange = (e) => {
    setShopDescription(e.target.value);
    const payload = {
      shopId: shop.id,
      description: e.target.value,
    };
    dispatch(shopsSliceActions.changeDescriptionOfShop(payload));
  };

  const selectAllUrlHandler = (e) => {
    e.target.select();
  };

  const handleImageChange = (e) => {
    setImageUrl(e.target.value);
  };

  const handleApplyChange = (e) => {
    const payload = {
      shopId: shop.id,
      image: imageUrl,
    };
    dispatch(shopsSliceActions.changeImageOfShop(payload));
  };

  const handleResetChange = (e) => {
    setImageUrl(originalImageUrl);
    const payload = {
      shopId: shop.id,
      image: originalImageUrl,
    };
    dispatch(shopsSliceActions.changeImageOfShop(payload));
  };

  // Update the item that is edited in input for price and amount
  const handleItemChange = (itemId, field, value) => {
    setShopItemsData((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId
          ? { ...item, [field]: Math.sign(value) === 1 ? value : 0 }
          : item
      )
    );
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
    setAddingItemsLoading(true);
    let items = {};
    let payload;
    for (const itemToAdd of displayItemsToAdd) {
      const itemData = await getItems(itemToAdd.url);
      const newItem = createItemObjectForShop(itemData);
      items[newItem.id] = newItem;
      payload = {
        items,
        shopId: shop.id,
        type: "addAll",
      };
    }
    dispatch(shopsSliceActions.addItemToShop(payload));
    setAddingItemsLoading(false);
  };

  const removeAllItemsHandler = () => {
    dispatch(shopsSliceActions.clearItemsFromShop(shop.id));
  };

  const tabs = [
    {
      key: "1",
      label: "Edit Items",
      children: (
        <div className={classes.tableDiv}>
          <div className={classes.itemEdits}>
            <Button onClick={removeAllItemsHandler}>
              <DeleteOutlined />
              Remove All
            </Button>
          </div>
          <Table
            locale={{
              emptyText:
                "The shop is currently empty. Add items in the next tab.",
            }}
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
        </div>
      ),
    },
    {
      key: "2",
      label: "Add Items",
      children: (
        <div className={classes.tableDiv}>
          <div className={classes.itemEdits}>
            <Button onClick={() => addAllItemsHandler(shop)}>
              {" "}
              <PlusCircleOutlined />
              Add All{" "}
            </Button>
            <Select
              defaultValue="Adventuring Gear"
              options={memoizedCategories}
              style={{ width: "250px" }}
              onSelect={(value) => selectHandler(value)}
            />
          </div>
          <Table
            loading={isLoading || addingItemsLoading}
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
        </div>
      ),
    },
  ];

  return (
    <>
      {shop ? (
        <div className={classes.content}>
          <CancelModal
            showModal={showCancelModal}
            setShowModal={setShowCancelModal}
          />
          <DeleteModal
            type="shop"
            campaignId={params.campaignId}
            showModal={showDeleteModal}
            setShowModal={setShowDeleteModal}
            shopId={shop.id}
            shopTitle={shop.title}
            navigatePath={-2}
          />
          <div className={classes.shopMenu}>
            <div className={classes.editContainer}>
              <h3>Shop Name: </h3>
              <Input value={shopTitle} onChange={handleTitleChange}></Input>
            </div>

            <Tabs defaultActiveKey="1" items={tabs}></Tabs>
            <div className={classes.buttons}>
              <Button
                style={{ borderColor: "#7cacbb" }}
                onClick={saveChangesHandler}
              >
                Save
              </Button>

              <Button danger onClick={() => setShowCancelModal(true)}>
                Cancel
              </Button>

              <Button type="primary" danger onClick={deleteButtonHandler}>
                Delete Shop
              </Button>
            </div>
          </div>
          <div className={classes.editDetails}>
            <div className={classes.editContainer}>
              <h3>Description:</h3>
              <TextArea
                value={shopDescription}
                onChange={handleDescriptionChange}
              ></TextArea>
            </div>
            <div className={classes.editContainer}>
              <h3>Image URL:</h3>
              <Input
                name="image"
                value={imageUrl}
                onChange={handleImageChange}
                onFocus={selectAllUrlHandler}
              />
              <div className={classes.buttons}>
                <Button onClick={handleApplyChange}>Apply Image</Button>
                <Button onClick={handleResetChange}>Reset Image</Button>
              </div>
            </div>

            {shop?.image && <img src={shop.image} style={{ width: "200px" }} />}
            {clickedItem && <ItemDescriptionCard item={clickedItem} />}
          </div>
        </div>
      ) : (
        <Spin style={{ fontSize: "5rem" }} />
      )}
    </>
  );
};
export default EditShopPage;
