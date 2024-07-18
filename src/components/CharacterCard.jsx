import { useSelector } from "react-redux";
import classes from "../pages/homepage/HomePage.module.css";
import { motion } from "framer-motion";
import { Card, Flex } from "antd";
import Meta from "antd/es/card/Meta";
import { Link } from "react-router-dom";

const CharacterCard = ({ cid, inModal }) => {
  const characters = useSelector((state) => state.userSlice.user.characters);
  return (
    <motion.div
      key={cid}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
    >
      <Card
        className={classes.characterCard}
        cover={
          !inModal ? (
            <>
              <Link to={`/Characters/${cid}`}>
                <div className={classes.coverDiv}>
                  <img
                    alt="campaign image"
                    src={
                      characters[cid].image ||
                      "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
                    }
                  />
                </div>
              </Link>
            </>
          ) : (
            <div className={classes.coverDiv}>
              <img
                alt="campaign image"
                src={
                  characters[cid].image ||
                  "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
                }
              />
            </div>
          )
        }
        /* actions={actions} */
      >
        <Meta
          className={classes.characterMeta}
          title={characters[cid].name}
          description={`${characters[cid].race} ${characters[cid].class || ""}`}
        />
      </Card>
    </motion.div>
  );
};

export default CharacterCard;
