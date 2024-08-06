import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getCampaignsData } from "../app/actions/databaseActions";
import LoadingCard from "./LoadingCard";
import CampaignListItem from "./CampaignListItem";
import JoinCampaignModal from "./JoinCampaignModal";
import { Card } from "antd";
import classes from "../pages/homepage/HomePage.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import Meta from "antd/es/card/Meta";
import { motion } from "framer-motion";

const CampaignCardsContainer = ({ type, uid, joinCampaignHandler }) => {
  const dispatch = useDispatch();

  //when loading is done: gi imame created and joined vo user
  //loading campaigns true:
  //togash proveri dali ima created and joined, ako ima setni gi, ako nema opet setni gi
  //ko kje se setnati togash loading campaigns false
  //display data accordingly:
  //loading campagins true - loading
  //loading false i ima campaigns: join + cards
  //loading false i nema campaigns: join samo

  // Fetch campaigns data from userSlice
  const campaigns = useSelector(
    (state) => state.userSlice.user.campaigns || {}
  );
  const { createdCampaigns, joinedCampaigns } = useSelector(
    (state) => state.campaignSlice
  );
  const { isLoading } = useSelector((state) => state.uiSlice);
  const [loadingCampaigns, setLoadingCampaigns] = useState(true);

  let createdCampaignsFromUser = campaigns.created;
  let joinedCampaignsFromUsers = campaigns.joined;

  /*  const [showJoinModal, setShowJoinModal] = useState(false); */

  const addMoreCard =
    type === "created" ? (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        whileHover={{ scale: 1.02 }}
        className={classes.addMoreWrapper}
      >
        <Link to={`/NewCampaign`}>
          <Card
            className={classes.addMoreCard}
            cover={
              <div className={classes.addMoreCoverDiv}>
                <FontAwesomeIcon icon={faPlusCircle} />
              </div>
            }
          >
            {" "}
            <Meta
              className={classes.campaignMeta}
              description={"Create a new campaign"}
            />
          </Card>
        </Link>
      </motion.div>
    ) : (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        whileHover={{ scale: 1.02 }}
        className={classes.addMoreWrapper}
      >
        <Card
          onClick={joinCampaignHandler}
          className={classes.addMoreCard}
          cover={
            <div className={classes.addMoreCoverDiv}>
              <FontAwesomeIcon icon={faPlusCircle} />
            </div>
          }
        >
          {" "}
          <Meta
            className={classes.campaignMeta}
            description={"Join a campaign"}
          />
        </Card>
      </motion.div>
    );

  useEffect(() => {
    if (!isLoading) {
      const campaignIds =
        type === "created"
          ? createdCampaignsFromUser
            ? Object.keys(createdCampaignsFromUser)
            : []
          : joinedCampaignsFromUsers
          ? Object.keys(joinedCampaignsFromUsers)
          : [];

      //makes sure the loading is managed after getCampaignsData is done
      dispatch(getCampaignsData(campaignIds, type)).then(() => {
        setLoadingCampaigns(false);
      });
    }
  }, [type, createdCampaignsFromUser, joinedCampaignsFromUsers, isLoading]);

  console.log("createdCampaigns", createdCampaigns);
  console.log("createdCampaignsFromUser", createdCampaignsFromUser);
  console.log(loadingCampaigns);

  let content;
  if (type === "created") {
    content = (
      <ul className={classes.campaignsList}>
        {loadingCampaigns && <LoadingCard />}
        {!loadingCampaigns &&
          (createdCampaignsFromUser ? (
            <>
              {addMoreCard}
              {Object.values(createdCampaigns).map((campaign) => (
                <CampaignListItem
                  key={campaign.id}
                  campaign={campaign}
                  type="created"
                />
              ))}
            </>
          ) : (
            <>{addMoreCard}</>
          ))}
      </ul>
    );
  } else {
    content = (
      <ul className={classes.campaignsList}>
        {/* <JoinCampaignModal
          showModal={showJoinModal}
          setShowModal={setShowJoinModal}
          uid={uid}
        /> */}
        {loadingCampaigns && <LoadingCard />}
        {!loadingCampaigns &&
          (joinedCampaignsFromUsers ? (
            <>
              {addMoreCard}
              {joinedCampaignsFromUsers !== null &&
                Object.values(joinedCampaigns).map((campaign) => (
                  <CampaignListItem key={campaign.id} campaign={campaign} />
                ))}
            </>
          ) : (
            <>{addMoreCard}</>
          ))}
      </ul>
    );
  }

  return <>{content}</>;
};

export default CampaignCardsContainer;
