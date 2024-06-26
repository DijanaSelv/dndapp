import { Card, Flex } from "antd";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import classes from "../pages/homepage/HomePage.module.css";
import Meta from "antd/es/card/Meta";
import { useState } from "react";
import { useSelector } from "react-redux";
import { ArrowRightOutlined, CloseOutlined } from "@ant-design/icons";

const CharacterCardsContainer = () => {
  const characters = useSelector((state) => state.userSlice.user.characters);

  const deleteButtonHandler = () => {
    console.log("delete character");
  };

  return (
    <>
      {/*          <DeleteModal
      type={modalType}
      campaign={campaign}
      showModal={showModal}
      setShowModal={setShowModal}
      /> */}
      {characters &&
        Object.keys(characters).map((cid) => {
          const actions = [
            <Link to={`/Characters/${cid}`}>
              <ArrowRightOutlined key="view" />
            </Link>,
            <CloseOutlined key="delete" onClick={deleteButtonHandler} />,
          ];

          return (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              whileHover={{ scale: 1.02 }}
            >
              <Card
                className={classes.characterCard}
                cover={
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
                }
                /* actions={actions} */
              >
                <Meta
                  className={classes.characterMeta}
                  title={characters[cid].name}
                  description={`${characters[cid].race} ${
                    characters[cid].class || ""
                  }`}
                />
              </Card>
            </motion.div>
          );
        })}
    </>
  );
};

export default CharacterCardsContainer;
