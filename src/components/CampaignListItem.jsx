import {
  ArrowRightOutlined,
  CloseOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { Button, Card } from "antd";
import Meta from "antd/es/card/Meta";
import { motion } from "framer-motion";

import { Link } from "react-router-dom";

const CampaignListItem = ({ campaign, type }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.05 }}
    >
      <Card
        cover={
          <div className="coverDiv">
            <img alt="campaign image" src={campaign.image} />
          </div>
        }
        actions={[
          <Link to={`/Campaigns/${type}/${campaign.id}/info`}>
            <InfoCircleOutlined key="info" />
          </Link>,
          <Link to={`/Campaigns/${type}/${campaign.id}/play`}>
            <ArrowRightOutlined key="play" />
          </Link>,
          <Link>
            <CloseOutlined key="delete" />
          </Link>,
        ]}
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

/*       <Link to={`/Campaigns/${type}/${campaign.id}/play`}>
        <Button type="primary">Play</Button>
      </Link> */
