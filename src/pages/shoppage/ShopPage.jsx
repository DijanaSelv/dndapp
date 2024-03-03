import { useParams } from "react-router";
import { Button, Table } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getItems } from "../../app/actions/dndApiActions";
import ItemDescriptionCard from "../../components/ItemDescriptionCard";
import classes from "./ShopPage.module.css";
import { Link } from "react-router-dom";
import { LeftSquareOutlined, LoadingOutlined } from "@ant-design/icons";
import { getShopsData } from "../../app/actions/databaseActions";

const ShopPage = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const [itemsData, setItemsData] = useState();
  const [clickedItem, setClickedItem] = useState();
  const { isLoading } = useSelector((state) => state.uiSlice);
  const { shops } = useSelector((state) => state.shopsSlice);
  const shop = shops[params.shopId];

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
      setShop();
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
      render: (text, record) => (text > 0 ? text : "∞"),
    },
    {
      title: "price (gp)",
      dataIndex: "price",
      sorter: {
        compare: (a, b) => a.price - b.price,
      },
      render: (text, record) => (text > 0 ? text : "/"),
    },
  ];

  return (
    <>
      {shop ? (
        <div className={classes.content}>
          <div className={classes.shopMenu}>
            <Link to={-1}>
              <LeftSquareOutlined /> Back to shoppes
            </Link>
            <h2>{shop.title}</h2>
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
                <Button type="primary" danger>
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
        <LoadingOutlined style={{ fontSize: "5rem" }} />
      )}
    </>
  );
};

export default ShopPage;
