import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { getItems } from "../../app/actions/dndApiActions";
import ItemDescriptionCard from "../../components/ItemDescriptionCard";
import { getShopsData } from "../../app/actions/databaseActions";

import { LeftSquareOutlined } from "@ant-design/icons";
import { Button, Table, Spin } from "antd";
import classes from "./ShopPage.module.css";
import DeleteModal from "../../components/DeleteModal";

const ShopPage = () => {
  const params = useParams();
  const dispatch = useDispatch();

  const { isLoading } = useSelector((state) => state.uiSlice);
  const { shops } = useSelector((state) => state.shopsSlice);
  const shop = shops[params.shopId];

  const [itemsData, setItemsData] = useState();
  const [clickedItem, setClickedItem] = useState();
  const [showModal, setShowModal] = useState(false);

  const deleteButtonHandler = () => {
    setShowModal(true);
  };
  let itemsList = [];

  //POPULATE THE SHOP ITEMS in shop
  const getShop = async () => {
    dispatch(getShopsData(params.campaignId));
  };

  const setShop = () => {
    Object.keys(shop.items).map((itemKey) =>
      itemsList.push({
        id: itemKey,
        name: shop.items[itemKey].name,
        price: shop.items[itemKey].price,
        amount: shop.items[itemKey].amount,
        url: shop.items[itemKey].url,
      })
    );
    setItemsData(itemsList);
  };

  useEffect(() => {
    getShop();
  }, []);

  useEffect(() => {
    if (shop) {
      //if there are no items on shop pass an empty items array.
      shop.items ? setShop() : setItemsData([]);
    }
  }, [shop]);

  //show item specs on click
  const clickHandler = async (url) => {
    const data = await getItems(url);
    setClickedItem(data);
  };

  //define the columns of the table
  const columns = [
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
      sorter: {
        compare: (a, b) => a.amount - b.amount,
      },
      render: (text) => (text > 0 ? text : "∞"),
    },
    {
      title: "price (gp)",
      dataIndex: "price",
      sorter: {
        compare: (a, b) => a.price - b.price,
      },
      render: (text) => (text > 0 ? text : "/"),
    },
  ];

  return (
    <>
      {shop ? (
        <div className={classes.content}>
          <DeleteModal
            type="shop"
            campaignId={params.campaignId}
            showModal={showModal}
            setShowModal={setShowModal}
            shopId={shop.id}
            shopTitle={shop.title}
            navigatePath={-1}
          />
          <div className={classes.shopMenu}>
            <Link to={-1}>
              <LeftSquareOutlined /> Back to shoppes
            </Link>
            <h2 className={classes.title}>{shop.title}</h2>
            <p>{shop.description}</p>
            <div className={classes.tableDiv}>
              <Table
                locale={{
                  emptyText: "The shop is currently empty.",
                }}
                loading={isLoading}
                columns={columns}
                dataSource={itemsData}
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
                <Link to="edit">
                  <Button style={{ borderColor: "#7cacbb" }}>Edit Shop</Button>
                </Link>
                <Button type="primary" danger onClick={deleteButtonHandler}>
                  Delete Shop
                </Button>
              </div>
            </div>
          </div>
          <div className={classes.details}>
            <img src={shop.image} style={{ width: "200px" }} />
            {clickedItem && <ItemDescriptionCard item={clickedItem} />}
          </div>
        </div>
      ) : (
        <Spin style={{ fontSize: "5rem" }} />
      )}
    </>
  );
};

export default ShopPage;
