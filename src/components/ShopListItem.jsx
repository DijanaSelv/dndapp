import { useState } from "react";
import { Link, useParams } from "react-router-dom";

import DeleteModal from "./DeleteModal";

import { ArrowRightOutlined, CloseOutlined } from "@ant-design/icons";
import { Card } from "antd";
import Meta from "antd/es/card/Meta";
import { motion } from "framer-motion";

import classes from "../pages/campaignshopspage/CampaignShopsPage.module.css";

const ShopListItem = ({ shop, type }) => {
  const params = useParams();
  const [showModal, setShowModal] = useState(false);

  const deleteButtonHandler = () => {
    setShowModal(true);
  };

  const actions =
    type === "created"
      ? [
          <Link to={`${shop.id}`}>
            <ArrowRightOutlined key="play" />
          </Link>,

          <CloseOutlined key="delete" onClick={deleteButtonHandler} />,
        ]
      : [
          <Link to={`${shop.id}`}>
            <ArrowRightOutlined key="play" />
          </Link>,
        ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.05 }}
    >
      {
        <DeleteModal
          type="shop"
          campaignId={params.campaignId}
          showModal={showModal}
          setShowModal={setShowModal}
          shopId={shop.id}
          shopTitle={shop.title}
        />
      }
      <Card
        cover={
          <Link to={`${shop.id}`}>
            <div className={classes.coverDiv}>
              <img alt="shop image" src={shop.image} />
            </div>
          </Link>
        }
        actions={actions}
      >
        <Meta
          className={classes.shopDescription}
          title={shop.title}
          description={shop.description || ""}
        />
      </Card>
    </motion.div>
  );
};

export default ShopListItem;
