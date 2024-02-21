import { useParams } from "react-router";
import { Table } from "antd";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getItem } from "../../app/actions/dndApiActions";
import ItemDescriptionCard from "../../components/ItemDescriptionCard";
import classes from "./ShopPage.module.css";

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
      sorter: {
        compare: (a, b) => a.amount - b.amount,
      },
    },
    {
      title: "price (gp)",
      dataIndex: "price",
      sorter: {
        compare: (a, b) => a.price - b.price,
      },
    },
  ];

  return (
    <div className={classes.content}>
      <div className={classes.shopMenu}>
        <h2>{shop.title}</h2>
        <div className={classes.table}>
          <Table
            columns={columns}
            dataSource={itemsData}
            pagination={false}
            size={"small"}
            rowKey="id"
          />
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
