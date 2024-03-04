import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import CampaignListItem from "../../components/CampaignListItem";
import { getCampaignsData } from "../../app/actions/databaseActions";
import NotificationBox from "../../components/NotificationBox";
import { uiSliceActions } from "../../app/uiSlice";

import { PlusCircleOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import classes from "./HomePage.module.css";

const Home = () => {
  const { createdCampaigns, joinedCampaigns } = useSelector(
    (state) => state.campaignSlice
  );
  const { notification } = useSelector((state) => state.uiSlice);
  const {
    created: createdCampaignsFromUser,
    joined: joinedCampaignsFromUsers,
  } = useSelector((state) => state.userSlice.user.campaigns || {});
  const { isLoading } = useSelector((state) => state.uiSlice);

  const dispatch = useDispatch();

  useEffect(() => {
    if (createdCampaignsFromUser) {
      const createdCampaignsIds = Object.keys(createdCampaignsFromUser);
      dispatch(getCampaignsData(createdCampaignsIds, "created"));
    }
    if (joinedCampaignsFromUsers) {
      const joinedCampaignsIds = Object.keys(joinedCampaignsFromUsers);
      dispatch(getCampaignsData(joinedCampaignsIds, "joined"));
    }
    dispatch(uiSliceActions.resetRequestState());
  }, [createdCampaignsFromUser, joinedCampaignsFromUsers]);

  return (
    <div className={classes.content}>
      {notification && <NotificationBox />}
      <div className={classes.createdCampaignsSection}>
        <div className={classes.createdCampaignsHeader}>
          <h2>Created Campaigns</h2>
          <Link className={classes.createdCampaignsLink} to="/NewCampaign">
            Create <PlusCircleOutlined />
          </Link>
        </div>
        {isLoading && <Spin />}
        <ul>
          {Object.keys(createdCampaigns).length !== 0
            ? Object.values(createdCampaigns).map((campaign) => (
                <CampaignListItem
                  key={campaign.id}
                  campaign={campaign}
                  type={campaign.type}
                />
              ))
            : !isLoading && (
                <p>
                  You haven't created any campaigns yet.{" "}
                  <Link to="/NewCampaign">Create one here.</Link>
                </p>
              )}
        </ul>
      </div>
      <div>
        <h2>Joined Campaigns</h2>
        <ul>
          {Object.keys(joinedCampaigns).length !== 0 && !isLoading ? (
            Object.values(joinedCampaigns).map((campaign) => (
              <CampaignListItem
                key={campaign.id}
                campaign={campaign}
                type={campaign.type}
              />
            ))
          ) : (
            <p>You haven't joined any campaigns yet. </p>
          )}
        </ul>
      </div>
      <div>
        <h2>Characters</h2>
        <Link to="/NewCharacter">
          New Character
          <PlusCircleOutlined style={{ fontSize: "2rem", color: "green" }} />
        </Link>
        <ul>
          {/* {characters.map((character) => (
            <CharacterListItem character={character} />
          ))} */}
        </ul>
      </div>
    </div>
  );
};

export default Home;
