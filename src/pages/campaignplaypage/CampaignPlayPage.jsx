import { Link, useParams } from "react-router-dom";
import classes from "./CampaginPlayPage.module.css";
import { useDispatch, useSelector } from "react-redux";
import PlayCampaignCard from "../../components/PlayCampaignCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faInfo,
  faShop,
  faDiceD20,
  faBook,
  faPencil,
  faUserLarge,
  faPersonCircleQuestion,
} from "@fortawesome/free-solid-svg-icons";
import { LoadingOutlined } from "@ant-design/icons";
import { useState } from "react";

import { AddCharacterToCampaignModal } from "../../components/AddCharacterToCampaignModal";

const CampaignPlayPage = () => {
  const params = useParams();
  const { currentCampaign } = useSelector((state) => state.campaignSlice);
  const { characters, uid } = useSelector((state) => state.userSlice.user);

  const [showModal, setShowModal] = useState(false);
  const addCharacterHandler = () => {
    setShowModal(true);
  };

  return (
    <div className={classes.playPageContainer}>
      <ul className={classes.cardsList}>
        <PlayCampaignCard
          goTo={`/Campaigns/${params.campaignId}/info`}
          cardFor="Info"
          image={<FontAwesomeIcon className={classes.icon} icon={faInfo} />}
          description="General campaign info"
        />
        {characters && characters[currentCampaign.members?.[uid]?.character] ? (
          <PlayCampaignCard
            goTo={`/Campaigns/${params.campaignId}/play/character/${currentCampaign.members[uid].character}`}
            cardFor="Character"
            image={
              <FontAwesomeIcon className={classes.icon} icon={faUserLarge} />
            }
            description="Your character in this campaign"
          />
        ) : (
          <AddCharacterToCampaignModal
            showModal={showModal}
            setShowModal={setShowModal}
          >
            <div onClick={addCharacterHandler}>
              <PlayCampaignCard
                cardFor="Add a characer"
                image={
                  <div className={classes.addCharacterCardImg}>
                    <FontAwesomeIcon
                      className={classes.icon}
                      icon={faPersonCircleQuestion}
                    />
                  </div>
                }
                description="You can link one of your characters to this campaign"
              />
            </div>
          </AddCharacterToCampaignModal>
        )}

        <PlayCampaignCard
          goTo={`/Campaigns/${params.campaignId}/play/shops`}
          cardFor="Shops"
          image={<FontAwesomeIcon className={classes.icon} icon={faShop} />}
          description="You can buy and sell items"
        />
        <PlayCampaignCard
          goTo={`/Campaigns/${params.campaignId}/play/${uid}/combat`}
          cardFor="Combat"
          image={<FontAwesomeIcon className={classes.icon} icon={faDiceD20} />}
          description="Fight!"
        />
        <PlayCampaignCard
          goTo={`/Campaigns/${params.campaignId}/play/log`}
          cardFor="Log"
          image={<FontAwesomeIcon className={classes.icon} icon={faBook} />}
          description="Campaign lore and progress"
        />
        <PlayCampaignCard
          goTo={`/Campaigns/${params.campaignId}/play/notes`}
          cardFor="Notes"
          image={<FontAwesomeIcon className={classes.icon} icon={faPencil} />}
          description="Your personal notes"
        />
      </ul>
    </div>
  );
};

export default CampaignPlayPage;
