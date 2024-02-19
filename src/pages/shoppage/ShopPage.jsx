import { useParams } from "react-router";
import STATIC_SHOPS from "../../app/STATIC_SHOPS";
import { Table } from "antd";
import { useState } from "react";

const ShopPage = () => {
  const params = useParams();
  const [clickedItem, setClickedItem] = useState();

  const clickHandler = (id) => {
    setClickedItem(id);
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

  const itemsData = [
    { id: "padded-armor", name: "padded armor", price: "5", amount: 6 },
    { id: "leather-armor", name: "leather armor", price: "10", amount: 3 },
    { id: "studded-leather", name: "studded leather", price: "45" },
  ];

  return (
    <div className="content">
      <div className="shopMenu">
        <h3>{STATIC_SHOPS.jkWY3iLz8XqR.title}</h3>
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

      <img src={STATIC_SHOPS.jkWY3iLz8XqR.image} style={{ width: "200px" }} />
      <div>{clickedItem || "Click an item to view more details."}</div>
    </div>
  );
};

export default ShopPage;
