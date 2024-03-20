import { ArrowRightOutlined } from "@ant-design/icons";
import { Card } from "antd";
import Meta from "antd/es/card/Meta";
import { motion } from "framer-motion";
import { Link, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classes from "../pages/campaignplaypage/CampaginPlayPage.module.css";

const PlayCampaignCard = ({ goTo, cardFor, image, description }) => {
  const params = useParams();
  const campaignId = params.campaignId;
  const type = params.type;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
    >
      <Link to={goTo}>
        <Card cover={image}>
          <Meta title={cardFor} description={description} />
        </Card>
      </Link>
    </motion.div>
  );
};

export default PlayCampaignCard;
