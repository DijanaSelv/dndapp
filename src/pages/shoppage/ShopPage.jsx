import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { getItems } from "../../app/actions/dndApiActions";
import ItemDescriptionCard from "../../components/ItemDescriptionCard";
import { getShopsData } from "../../app/actions/databaseActions";

import { Button, Table, Spin } from "antd";
import classes from "./ShopPage.module.css";
import DeleteModal from "../../components/DeleteModal";
import { currencyForShopDisplay } from "../../app/actions/uitls";

const ShopPage = () => {
  const params = useParams();
  const dispatch = useDispatch();

  const { isLoading } = useSelector((state) => state.uiSlice);
  const { shops } = useSelector((state) => state.shopsSlice);
  const { dm } = useSelector((state) => state.rolesSlice);
  const shop = shops[params.shopId];

  const [itemsData, setItemsData] = useState();
  const [clickedItem, setClickedItem] = useState();
  const [showModal, setShowModal] = useState(false);

  const deleteButtonHandler = () => {
    setShowModal(true);
  };
  let itemsList = [];
  const chooseItem = {
    equipment_category: { index: "choose" },
  };

  //POPULATE THE SHOP ITEMS in shop
  const getShop = async () => {
    dispatch(getShopsData(params.campaignId));
  };

  const setShop = () => {
    Object.keys(shop.items).map((itemKey) => {
      const priceToDisplay = currencyForShopDisplay(shop.items[itemKey].price);
      console.log(priceToDisplay);

      itemsList.push({
        id: itemKey,
        name: shop.items[itemKey].name,
        price: priceToDisplay,
        amount: shop.items[itemKey].amount,
        url: shop.items[itemKey].url,
      });
    });
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
  const clickHandler = async (url, id) => {
    const data = await getItems(url);
    //the cost in the api might be different from in the shop if the dm changed it. 1 option is to not show it, the other to fetch it from the shop item id and convert it to display price.
    data.cost = null;
    setClickedItem(data);
  };

  //define the columns of the table
  const columns = [
    {
      title: "item",
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
      title: "price",
      dataIndex: "price",
      sorter: {
        compare: (a, b) => a.price - b.price,
      },
      render: (text) => {
        return (
          (text.gp && `${text.gp} gp`) ||
          (text.sp && `${text.sp} sp`) ||
          (text.cp && `${text.cp} cp`)
        );
      },
    },
  ];

  return (
    <>
      {shop ? (
        <>
          <div className={classes.titleContainer}>
            <h2 className={classes.title}>{shop.title}</h2>
          </div>
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
              {/* <Link to={-1}>
              <LeftSquareOutlined /> Back to shoppes
            </Link> */}

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
                      onClick: () => clickHandler(record.url, record.id),
                    };
                  }}
                  className={classes.tableOfItems}
                />
                {dm === true && (
                  <div className={classes.buttons}>
                    <Link to="edit">
                      <Button style={{ borderColor: "#7cacbb" }}>
                        Edit Shop
                      </Button>
                    </Link>
                    <Button type="primary" danger onClick={deleteButtonHandler}>
                      Delete Shop
                    </Button>
                  </div>
                )}
              </div>
            </div>
            <div className={classes.details}>
              <div className={classes.logoWrapper}>
                <p>{shop.description}</p>
                <img src={shop.image} style={{ width: "200px" }} />
              </div>
              {clickedItem ? (
                <ItemDescriptionCard item={clickedItem} />
              ) : (
                <ItemDescriptionCard item={chooseItem} />
              )}
            </div>
          </div>{" "}
        </>
      ) : (
        <Spin style={{ fontSize: "5rem" }} />
      )}
    </>
  );
};

export default ShopPage;
