import { useParams } from "react-router";
import { Button, Table } from "antd";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getItem } from "../../app/actions/dndApiActions";
import ItemDescriptionCard from "../../components/ItemDescriptionCard";
import classes from "./ShopPage.module.css";
import { Link } from "react-router-dom";
import { LeftSquareOutlined } from "@ant-design/icons";

const ShopPage = () => {
  const params = useParams();
  const [itemsData, setItemsData] = useState();
  const [clickedItem, setClickedItem] = useState();
  const { shops } = useSelector((state) => state.shopsSlice);
  const shop = shops[params.shopId];

  useEffect(() => {
    let itemsList = [];
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
  }, [shop]);
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
    <div className={classes.content}>
      <div className={classes.shopMenu}>
        <Link to={-1}>
          <LeftSquareOutlined /> Back to shoppes
        </Link>
        <h2>{shop.title}</h2>
        <p>{shop.description}</p>
        <div className={classes.table}>
          <Table
            columns={columns}
            dataSource={itemsData}
            pagination={false}
            size={"small"}
            rowKey="id"
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
  );
};

export default ShopPage;
