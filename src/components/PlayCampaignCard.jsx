import { Card } from "antd";
import Meta from "antd/es/card/Meta";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const PlayCampaignCard = ({ goTo, cardFor, image, description }) => {
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
