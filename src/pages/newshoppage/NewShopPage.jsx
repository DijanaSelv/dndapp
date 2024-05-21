import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";

import { useValidate } from "../../app/hooks/useValidate";
import {
  createItemObjectForShop,
  getItems,
} from "../../app/actions/dndApiActions";
import { uiSliceActions } from "../../app/uiSlice";
import { createShopsData } from "../../app/actions/databaseActions";

import ItemDescriptionCard from "../../components/ItemDescriptionCard";
import CancelModal from "../../components/CancelModal";
import NotificationBox from "../../components/NotificationBox";

import { nanoid } from "nanoid";

import { Button, Input, Select, Table, Tabs } from "antd";
import {
  DeleteOutlined,
  MinusCircleOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import classes from "../shoppage/ShopPage.module.css";
import DeleteModal from "../../components/DeleteModal";

const NewShopPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { TextArea } = Input;
  const params = useParams();
  const campaignId = params.campaignId;

  const { isLoading } = useSelector((state) => state.uiSlice);
  const { requestSuccess, requestFailed, notification } = useSelector(
    (state) => state.uiSlice
  );

  const [clickedItem, setClickedItem] = useState();
  const [showModal, setShowModal] = useState(false);
  const [selectedCategoryPath, setSelectedCategoryPath] =
    useState("adventuring-gear");
  const [displayItemsToAdd, setDisplayItemsToAdd] = useState();
  const [selectCategories, setSelectCategories] = useState();
  const [addingItemsLoading, setAddingItemsLoading] = useState();

  //On save shop, handle the sucess of the request and redirect
  useEffect(() => {
    if (requestSuccess) {
      navigate(-1);
    }
    if (requestFailed) {
    }
    dispatch(uiSliceActions.resetRequestState());
  }, [requestSuccess, requestFailed]);

  //ADD ITEMS TAB
  const setCategories = async () => {
    const categoriesArray = [];
    const categories = await getItems("/api/equipment-categories");
    for (const category of categories.results) {
      categoriesArray.push({ value: category.index, label: category.name });
    }
    setSelectCategories(categoriesArray);
  };

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

  // populate the items from dnd api
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

  // INPUT

  const {
    inputValue: title,
    isValid: titleIsValid,
    isError: titleIsError,
    inputBlurHandler: titleBlurHandler,
    valueChangeHandler: titleChangeHandler,
  } = useValidate((value) => value.trim() !== "");

  const {
    inputValue: description,
    inputBlurHandler: descriptionBlurHandler,
    valueChangeHandler: descriptionChangeHandler,
  } = useValidate((value) => true);

  const {
    inputValue: imageUrl,
    inputBlurHandler: imageUrlBlurHandler,
    valueChangeHandler: imageUrlChangeHandler,
  } = useValidate((value) => true);

  const handleItemChange = (itemId, field, value) => {
    setItemsList((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId
          ? { ...item, [field]: Math.sign(value) === 1 ? value : 0 }
          : item
      )
    );
  };

  //Manage added items
  const [itemsList, setItemsList] = useState([]);

  const addItemToShopHandler = async (record) => {
    const itemData = await getItems(record.url);
    const itemObj = createItemObjectForShop(itemData);
    console.log(itemObj);
    setItemsList((prevState) => [...prevState, itemObj]);
    //console.log(itemsList);
  };
  const removeItemFromShopHandler = async (record) => {
    console.log(record);
    setItemsList((prevState) =>
      prevState.filter((obj) => {
        return obj.id !== record.id;
      })
    );
  };

  let formIsValid = false;

  if (title && itemsList.length) {
    formIsValid = true;
  }

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
        <a onClick={() => removeItemFromShopHandler(record)}>
          <MinusCircleOutlined className={classes.removeIcon} />
        </a>
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
      render: (_, record) =>
        itemsList.some((e) => e.id === record.id) ? (
          <a onClick={() => removeItemFromShopHandler(record)}>
            <MinusCircleOutlined className={classes.removeIcon} />
          </a>
        ) : (
          <a onClick={() => addItemToShopHandler(record)}>
            <PlusCircleOutlined className={classes.addIcon} />
          </a>
        ),
    },
  ];

  //EVENT HANDLERS
  const saveChangesHandler = () => {
    const itemsDataObject = {};
    itemsList.map((item) => (itemsDataObject[item.id] = { ...item }));
    const shopData = {
      title,
      description,
      id: nanoid(12),
      image:
        imageUrl ||
        "https://cdn.pixabay.com/photo/2021/11/04/21/45/bag-6769430_1280.png",
      items: itemsList,
    };

    //dispatch create shop
    dispatch(createShopsData(campaignId, shopData));
  };

  const addAllItemsHandler = async (shop) => {
    setAddingItemsLoading(true);
    let items = [];
    let payload;
    for (const itemToAdd of displayItemsToAdd) {
      const itemData = await getItems(itemToAdd.url);
      const newItem = createItemObjectForShop(itemData);
      items.push(newItem);
      // payload = {
      //   items,
      //   shopId: shop.id,
      //   type: "addAll",
      // };
    }
    setItemsList((prevState) => [...prevState, ...items]);
    setAddingItemsLoading(false);
  };

  const removeAllItemsHandler = () => {
    setItemsList([]);
  };

  const selectHandler = (value) => {
    setSelectedCategoryPath(value);
  };

  const clickHandler = async (url) => {
    const data = await getItems(url);
    setClickedItem(data);
  };

  const selectAllUrlHandler = (e) => {
    e.target.select();
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
            dataSource={itemsList}
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
            <Button onClick={addAllItemsHandler}>
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
    <div className={classes.content}>
      {notification && <NotificationBox />}
      <DeleteModal />
      <CancelModal showModal={showModal} setShowModal={setShowModal} />
      <div className={classes.shopMenu}>
        <div className={classes.editContainer}>
          <h3>Title</h3>
          <Input
            placeholder={
              titleIsError ? "Title is requred" : "The name of your shop"
            }
            status={titleIsError ? "error" : ""}
            value={title}
            onBlur={titleBlurHandler}
            onChange={titleChangeHandler}
          ></Input>
        </div>

        <Tabs defaultActiveKey="1" items={tabs}></Tabs>
        <div className={classes.buttons}>
          <Button
            style={{ borderColor: "#7cacbb" }}
            onClick={saveChangesHandler}
            disabled={!formIsValid}
          >
            Save
          </Button>

          <Button danger onClick={() => setShowModal(true)}>
            Cancel
          </Button>
        </div>
      </div>
      <div className={classes.editDetails}>
        <div className={classes.editContainer}>
          <h4>Description</h4>
          <TextArea
            placeholder={"A blurb for your shop"}
            value={description}
            onBlur={descriptionBlurHandler}
            onChange={descriptionChangeHandler}
          ></TextArea>
        </div>
        <div className={classes.editContainer}>
          <h3>Image URL:</h3>
          <Input
            name="image"
            value={imageUrl}
            onBlur={imageUrlBlurHandler}
            onChange={imageUrlChangeHandler}
            onFocus={selectAllUrlHandler}
          />
        </div>
        {<img src={imageUrl || null} style={{ width: "200px" }} />}
        {clickedItem && <ItemDescriptionCard item={clickedItem} />}
      </div>
    </div>
  );
};
export default NewShopPage;
