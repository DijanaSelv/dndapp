import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import CampaignListItem from "../../components/CampaignListItem";
import { getCampaignsData } from "../../app/actions/databaseActions";
import NotificationBox from "../../components/NotificationBox";
import { uiSliceActions } from "../../app/uiSlice";

import { LoadingOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { Flex, Progress } from "antd";
import classes from "./HomePage.module.css";
import JoinCampaignModal from "../../components/JoinCampaignModal";
import LoadingCard from "../../components/LoadingCard";

const Home = () => {
  //fetch state from store
  const { createdCampaigns, joinedCampaigns } = useSelector(
    (state) => state.campaignSlice
  );
  const { notification } = useSelector((state) => state.uiSlice);
  const { uid } = useSelector((state) => state.userSlice.user);
  const {
    created: createdCampaignsFromUser,
    joined: joinedCampaignsFromUsers,
  } = useSelector((state) => state.userSlice.user.campaigns || {});

  const { isLoading, fetchedCampaigns } = useSelector((state) => state.uiSlice);

  const [showJoinModal, setShowJoinModal] = useState(false);

  const dispatch = useDispatch();

  //useEffect sets the campaigns once the user and data is fetched.
  useEffect(() => {
    //check if we have the needed data to prevent unnecessary rerendering
    if (uid && createdCampaignsFromUser && joinedCampaignsFromUsers) {
      const createdCampaignsIds = createdCampaignsFromUser
        ? Object.keys(createdCampaignsFromUser)
        : [];
      dispatch(getCampaignsData(createdCampaignsIds, "created"));
      const joinedCampaignsIds = joinedCampaignsFromUsers
        ? Object.keys(joinedCampaignsFromUsers)
        : [];
      dispatch(getCampaignsData(joinedCampaignsIds, "joined"));

      dispatch(uiSliceActions.resetRequestState());
    }
  }, [createdCampaignsFromUser, joinedCampaignsFromUsers, uid]);

  const joinCampaignHandler = () => {
    setShowJoinModal(true);
  };

  return (
    <div className={classes.content}>
      {notification && <NotificationBox />}
      <JoinCampaignModal
        showModal={showJoinModal}
        setShowModal={setShowJoinModal}
        uid={uid}
      />
      <div className={classes.section}>
        <div className={classes.sectionHeader}>
          <div>
            <h2> Created Campaigns {isLoading && <LoadingOutlined />}</h2>
          </div>

          <Link className={classes.sectionLink} to="/NewCampaign">
            New Campaign <PlusCircleOutlined />
          </Link>
        </div>

        <ul>
          {Object.keys(createdCampaigns).length !== 0
            ? Object.values(createdCampaigns).map((campaign) => (
                <CampaignListItem
                  key={campaign.id}
                  campaign={campaign}
                  type="created"
                />
              ))
            : !fetchedCampaigns && <LoadingCard />}
          {fetchedCampaigns &&
            Object.keys(createdCampaignsFromUser).length === 0 && (
              <p>
                You haven't created any campaigns yet.{" "}
                <Link to="/NewCampaign">Create one here.</Link>
              </p>
            )}
        </ul>
      </div>

      <div className={classes.section}>
        <div className={classes.sectionHeader}>
          <div>
            <h2>Joined Campaigns {isLoading && <LoadingOutlined />}</h2>
          </div>
          <Link className={classes.sectionLink} onClick={joinCampaignHandler}>
            Join <PlusCircleOutlined />
          </Link>
        </div>

        <ul>
          {Object.keys(joinedCampaigns).length !== 0
            ? Object.values(joinedCampaigns).map((campaign) => (
                <CampaignListItem key={campaign.id} campaign={campaign} />
              ))
            : !fetchedCampaigns && <LoadingCard />}
          {fetchedCampaigns &&
            Object.keys(joinedCampaignsFromUsers).length === 0 && (
              <p>
                You haven't joined any campaigns yet. Do you have a{" "}
                <Link onClick={joinCampaignHandler}>Join Code</Link>?
              </p>
            )}
        </ul>
      </div>

      <div className={classes.section}>
        <div className={classes.sectionHeader}>
          <h2>Characters {isLoading && <LoadingOutlined />}</h2>
          <Link className={classes.sectionLink}>
            New Character <PlusCircleOutlined />
          </Link>
        </div>

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
