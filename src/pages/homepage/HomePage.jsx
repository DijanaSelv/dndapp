import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import CampaignListItem from "../../components/CampaignListItem";
import { getCampaignsData } from "../../app/actions/databaseActions";
import NotificationBox from "../../components/NotificationBox";
import { uiSliceActions } from "../../app/uiSlice";

import { PlusCircleOutlined } from "@ant-design/icons";
import { Flex, Progress } from "antd";
import classes from "./HomePage.module.css";
import JoinCampaignModal from "../../components/JoinCampaignModal";

const Home = () => {
  const { createdCampaigns, joinedCampaigns } = useSelector(
    (state) => state.campaignSlice
  );
  const { notification, fetchedCampaigns } = useSelector(
    (state) => state.uiSlice
  );
  const {
    created: createdCampaignsFromUser,
    joined: joinedCampaignsFromUsers,
  } = useSelector((state) => state.userSlice.user.campaigns || {});

  const { uid } = useSelector((state) => state.userSlice.user);
  const { isLoading } = useSelector((state) => state.uiSlice);

  const [showJoinModal, setShowJoinModal] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(uiSliceActions.resetRequestState());
  }, [fetchedCampaigns]);

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
      <div className={classes.campaignsSection}>
        <div className={classes.campaignsHeader}>
          <div>
            <h2>Created Campaigns</h2>
            {isLoading && (
              <Flex vertical gap="small" style={{ width: 230 }}>
                <Progress
                  percent={100}
                  status="active"
                  showInfo={false}
                  size="small"
                  strokeColor={{ from: "#108ee9", to: "#87d068" }}
                />
              </Flex>
            )}
          </div>

          <Link className={classes.campaignsLink} to="/NewCampaign">
            Create <PlusCircleOutlined />
          </Link>
        </div>

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

      <div className={classes.campaignsSection}>
        <div className={classes.campaignsHeader}>
          <div>
            <h2>Joined Campaigns</h2>
            {isLoading && (
              <Flex vertical gap="small" style={{ width: 230 }}>
                <Progress
                  percent={100}
                  status="active"
                  showInfo={false}
                  size="small"
                  strokeColor={{ from: "#108ee9", to: "#87d068" }}
                />
              </Flex>
            )}
          </div>
          <Link className={classes.campaignsLink} onClick={joinCampaignHandler}>
            Join <PlusCircleOutlined />
          </Link>
        </div>

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
            <p>
              You haven't joined any campaigns yet. Do you have a{" "}
              <Link onClick={joinCampaignHandler}>Join Code</Link>?
            </p>
          )}
        </ul>
      </div>

      <div className={classes.campaignsSection}>
        <div className={classes.campaignsHeader}>
          <h2>Characters</h2>
          <Link className={classes.campaignsLink}>
            Create <PlusCircleOutlined />
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
