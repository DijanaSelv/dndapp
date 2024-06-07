import { Card } from "antd";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import classes from "../pages/homepage/HomePage.module.css";
import Meta from "antd/es/card/Meta";

const CharacterCardsContainer = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
    >
      {/*          <DeleteModal
              type={modalType}
              campaign={campaign}
              showModal={showModal}
              setShowModal={setShowModal}
            /> */}
      <Card
        cover={
          <Link to={`/Characters/abc`}>
            <div className={classes.coverDiv}>
              <img alt="campaign image" /* src={campaign.image} */ />
            </div>
          </Link>
        }
        /* actions={actions} */
      >
        <Meta title="Character" description="description" />
      </Card>
    </motion.div>
  );
};

export default CharacterCardsContainer;
