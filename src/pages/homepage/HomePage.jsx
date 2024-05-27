import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import NotificationBox from "../../components/NotificationBox";
import { LoadingOutlined, PlusCircleOutlined } from "@ant-design/icons";

import classes from "./HomePage.module.css";

import CampaignCardsContainer from "../../components/CampaignCardsContainer";
import { useState } from "react";
import JoinCampaignModal from "../../components/JoinCampaignModal";
import { uiSliceActions } from "../../app/uiSlice";

const Home = () => {
  //fetch state from store

  const { notification } = useSelector((state) => state.uiSlice);
  const { uid } = useSelector((state) => state.userSlice.user);

  const { isLoading } = useSelector((state) => state.uiSlice);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const joinCampaignHandler = () => {
    setShowJoinModal(true);
  };
  const dispatch = useDispatch();
  dispatch(uiSliceActions.resetRequestState());

  return (
    <div className={classes.content}>
      {notification && <NotificationBox />}

      <div className={classes.section}>
        <div className={classes.sectionHeader}>
          <div>
            <h2> Created Campaigns {isLoading && <LoadingOutlined />}</h2>
          </div>

          <Link className={classes.sectionLink} to="/NewCampaign">
            New Campaign <PlusCircleOutlined />
          </Link>
        </div>
        <CampaignCardsContainer type="created" uid={uid} />
      </div>

      <div className={classes.section}>
        <div className={classes.sectionHeader}>
          <JoinCampaignModal
            showModal={showJoinModal}
            setShowModal={setShowJoinModal}
            uid={uid}
          />
          <div>
            <h2>Joined Campaigns {isLoading && <LoadingOutlined />}</h2>
          </div>
          <Link className={classes.sectionLink} onClick={joinCampaignHandler}>
            Join <PlusCircleOutlined />
          </Link>
        </div>
        <CampaignCardsContainer type="joined" uid={uid} />
      </div>

      <div className={classes.section}>
        <div className={classes.sectionHeader}>
          <h2>Characters {isLoading && <LoadingOutlined />}</h2>
          <Link to="/NewCharacter" className={classes.sectionLink}>
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
