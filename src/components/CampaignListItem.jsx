import { useState } from "react";
import { Link } from "react-router-dom";

import DeleteModal from "./DeleteModal";
import classes from "../pages/homepage/HomePage.module.css";

import { Card } from "antd";
import Meta from "antd/es/card/Meta";
import { motion } from "framer-motion";
import {
  ArrowRightOutlined,
  CloseOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";

const CampaignListItem = ({ campaign, type }) => {
  const [showModal, setShowModal] = useState(false);

  const deleteButtonHandler = () => {
    setShowModal(true);
  };

  const actions =
    type === "created"
      ? [
          <Link to={`/Campaigns/${type}/${campaign.id}/info`}>
            <InfoCircleOutlined key="info" />
          </Link>,
          <Link to={`/Campaigns/${type}/${campaign.id}/play`}>
            <ArrowRightOutlined key="play" />
          </Link>,

          <CloseOutlined key="delete" onClick={deleteButtonHandler} />,
        ]
      : [
          <Link to={`/Campaigns/${type}/${campaign.id}/info`}>
            <InfoCircleOutlined key="info" />
          </Link>,
          <Link to={`/Campaigns/${type}/${campaign.id}/play`}>
            <ArrowRightOutlined key="play" />
          </Link>,
        ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      whileHover={{ scale: 1.05 }}
    >
      {
        <DeleteModal
          type="campaign"
          campaign={campaign}
          showModal={showModal}
          setShowModal={setShowModal}
        />
      }
      <Card
        cover={
          <Link to={`/Campaigns/${type}/${campaign.id}/info`}>
            <div className={classes.coverDiv}>
              <img alt="campaign image" src={campaign.image} />
            </div>
          </Link>
        }
        actions={actions}
      >
        <Meta
          title={campaign.title}
          description={`Players: ${
            campaign.players ? campaign.players.length : "0"
          }`}
        />
      </Card>
    </motion.div>
  );
};

export default CampaignListItem;
