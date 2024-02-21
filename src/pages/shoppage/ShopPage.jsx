import { useParams } from "react-router";
import { Table } from "antd";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getItem } from "../../app/actions/dndApiActions";
import ItemDescriptionCard from "../../components/ItemDescriptionCard";

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
      })
    );
    setItemsData(itemsList);
  }, []);
  const clickHandler = async (id) => {
    const data = await getItem(`equipment/${id}`);
    setClickedItem(data);
    console.log(clickedItem);
  };

  const columns = [
    {
      title: "name",
      dataIndex: "name",
      render: (text, record) => (
        <a onClick={() => clickHandler(record.id)}>{text}</a>
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
    <div className="content">
      <div className="shopMenu">
        <h3>{shop.title}</h3>
        <div style={{ width: "500px" }}>
          <Table
            columns={columns}
            dataSource={itemsData}
            pagination={false}
            size={"small"}
            rowKey="id"
          />
        </div>
      </div>
      <img src={shop.image} style={{ width: "200px" }} />
      {clickedItem && <ItemDescriptionCard item={clickedItem} />}
    </div>
  );
};

export default ShopPage;
