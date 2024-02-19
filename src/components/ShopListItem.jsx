import { ArrowRightOutlined, CloseOutlined } from "@ant-design/icons";
import { Button, Card, Modal } from "antd";
import Meta from "antd/es/card/Meta";
import { motion } from "framer-motion";

import { Link } from "react-router-dom";
import DeleteModal from "./DeleteModal";
import { useState } from "react";

const ShopListItem = ({ shop, type }) => {
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
      {/*         <DeleteModal
          campaign={campaign}
          showModal={showModal}
          setShowModal={setShowModal}
        /> */}
      <Card
        style={{
          width: 300,
        }}
        cover={
          <Link to={`${shop.id}`}>
            <div className="coverDiv">
              <img alt="shop image" src={shop.image} />
            </div>
          </Link>
        }
        actions={actions}
      >
        <Meta title={shop.title} description={shop.description || ""} />
      </Card>
    </motion.div>
  );
};

export default ShopListItem;

/*       <Link to={`/Campaigns/${type}/${campaign.id}/play`}>
          <Button type="primary">Play</Button>
        </Link> */
