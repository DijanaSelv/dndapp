import { useDispatch, useSelector } from "react-redux";

import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getCampaignsData } from "../app/actions/databaseActions";
import LoadingCard from "./LoadingCard";
import CampaignListItem from "./CampaignListItem";
import JoinCampaignModal from "./JoinCampaignModal";
import { uiSliceActions } from "../app/uiSlice";

const CampaignCardsContainer = ({ type, uid }) => {
  const dispatch = useDispatch();

  // Fetch campaigns data from userSlice
  const campaigns = useSelector(
    (state) => state.userSlice.user.campaigns || {}
  );
  const { createdCampaigns, joinedCampaigns } = useSelector(
    (state) => state.campaignSlice
  );

  //get the campaigns undefined - if data hasn't been fetched, null - fetched but empty, {id: true} if there is data. In content it will show loading, no campaigns message or cards soodvetno.
  let createdCampaignsFromUser = campaigns.created;
  let joinedCampaignsFromUsers = campaigns.joined;

  const [showJoinModal, setShowJoinModal] = useState(false);

  useEffect(() => {
    const campaignIds =
      type === "created"
        ? createdCampaignsFromUser
          ? Object.keys(createdCampaignsFromUser)
          : []
        : joinedCampaignsFromUsers
        ? Object.keys(joinedCampaignsFromUsers)
        : [];

    if (campaignIds.length > 0) {
      dispatch(getCampaignsData(campaignIds, type));
    } else {
      createdCampaignsFromUser = null;
      joinedCampaignsFromUsers = null;
      dispatch(uiSliceActions.changeLoading(false));
    }
  }, [type, createdCampaignsFromUser, joinedCampaignsFromUsers, dispatch]);

  const joinCampaignHandler = () => {
    setShowJoinModal(true);
  };

  let content;
  if (type === "created") {
    content = (
      <ul>
        {createdCampaignsFromUser === undefined && <LoadingCard />}
        {createdCampaignsFromUser === null ? (
          <p>
            You haven't created any campaigns yet.{" "}
            <Link to="/NewCampaign">Create one here.</Link>
          </p>
        ) : (
          Object.values(createdCampaigns).map((campaign) => (
            <CampaignListItem
              key={campaign.id}
              campaign={campaign}
              type="created"
            />
          ))
        )}
      </ul>
    );
  } else {
    content = (
      <ul>
        <JoinCampaignModal
          showModal={showJoinModal}
          setShowModal={setShowJoinModal}
          uid={uid}
        />
        {joinedCampaignsFromUsers === undefined && <LoadingCard />}
        {joinedCampaignsFromUsers === null ? (
          <p>
            You haven't joined any campaigns yet. Do you have a{" "}
            <Link onClick={joinCampaignHandler}>Join Code</Link>?
          </p>
        ) : (
          Object.values(joinedCampaigns).map((campaign) => (
            <CampaignListItem key={campaign.id} campaign={campaign} />
          ))
        )}
      </ul>
    );
  }

  return <>{content}</>;
};

export default CampaignCardsContainer;
