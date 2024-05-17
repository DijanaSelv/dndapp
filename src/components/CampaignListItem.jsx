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
  const [modalType, setModalType] = useState();

  const deleteButtonHandler = () => {
    setModalType("campaign");
    setShowModal(true);
  };
  const leaveCampaignButtonHandler = () => {
    setModalType("leaveCampaign");
    setShowModal(true);
  };

  const actions =
    type === "created"
      ? [
          <Link to={`/Campaigns/${campaign.id}/play`}>
            <ArrowRightOutlined key="play" />
          </Link>,
          <Link to={`/Campaigns/${campaign.id}/info`}>
            <InfoCircleOutlined key="info" />
          </Link>,
          <CloseOutlined key="delete" onClick={deleteButtonHandler} />,
        ]
      : [
          <Link to={`/Campaigns/${campaign.id}/play`}>
            <ArrowRightOutlined key="play" />
          </Link>,
          <Link to={`/Campaigns/${campaign.id}/info`}>
            <InfoCircleOutlined key="info" />
          </Link>,
          <CloseOutlined key="leave" onClick={leaveCampaignButtonHandler} />,
        ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
    >
      {
        <DeleteModal
          type={modalType}
          campaign={campaign}
          showModal={showModal}
          setShowModal={setShowModal}
        />
      }
      <Card
        cover={
          <Link to={`/Campaigns/${campaign.id}/info`}>
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
