import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { subscribeToCampaigns } from "../app/actions/databaseActions";
import LoadingCard from "./LoadingCard";
import CampaignListItem from "./CampaignListItem";
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

  const campaignsForDisplay = useSelector((state) => {
    return type === "created"
      ? state.campaignSlice.createdCampaigns
      : state.campaignSlice.joinedCampaigns;
  });

  const { isLoading } = useSelector((state) => state.uiSlice);
  const [loadingCampaigns, setLoadingCampaigns] = useState(true);

  let campaignsFromUser =
    type == "created" ? campaigns.created : campaigns.joined;

  /*  const [showJoinModal, setShowJoinModal] = useState(false); */

  const addMoreCard =
    type === "created" ? (
      <div className={classes.addMoreWrapper}>
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
      </div>
    ) : (
      <div className={classes.addMoreWrapper}>
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
      </div>
    );

  useEffect(() => {
    if (!isLoading && campaignsFromUser) {
      const campaignIds = Object.keys(campaignsFromUser);

      const cleanup = dispatch(subscribeToCampaigns(campaignIds, type));

      return () => {
        if (typeof cleanup === "function") cleanup();
      };
    }
  }, [dispatch, type, campaignsFromUser, isLoading]);

  const content = (
    <ul className={classes.campaignsList}>
      <>{addMoreCard}</>

      {campaignsForDisplay && (
        <>
          {Object.keys(campaignsForDisplay).length !== 0 &&
            Object.values(campaignsForDisplay).map((campaign) => (
              <CampaignListItem
                key={campaign.id}
                campaign={campaign}
                type={type}
              />
            ))}
        </>
      )}
      {loadingCampaigns && !campaignsForDisplay && <LoadingCard />}
    </ul>
  );

  return <>{content}</>;
};

export default CampaignCardsContainer;
