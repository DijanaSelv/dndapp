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
  faPlusCircle,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { LoadingOutlined } from "@ant-design/icons";
import { useState } from "react";
import { Button, Modal, Radio } from "antd";

import CharacterCard from "../../components/CharacterCard";
import { addCharacterToCampaign } from "../../app/actions/databaseActions";

const CampaignPlayPage = () => {
  const params = useParams();
  const { currentCampaign } = useSelector((state) => state.campaignSlice);
  const { characters, uid } = useSelector((state) => state.userSlice.user);
  const dispatch = useDispatch();

  const [showModal, setShowModal] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState();

  //TODO: on added character the new character data is not fetched and updated.

  const addCharacterHandler = () => {
    setShowModal(true);
  };

  const setSelectedCharacterHandler = (e) => {
    setSelectedCharacter(e.target.value);
  };

  const cancelHandler = () => {
    setShowModal(false);
    setSelectedCharacter(null);
  };

  const joinHandler = () => {
    console.log(uid, selectedCharacter, currentCampaign.id);
    dispatch(
      addCharacterToCampaign(uid, selectedCharacter, currentCampaign.id)
    );
    setSelectedCharacter(null);
    setShowModal(false);
  };

  return (
    <div className={classes.playPageContainer}>
      <h1 className={classes.campaignTitle}>
        {currentCampaign.title || <LoadingOutlined />}
      </h1>

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
            /*  image={
              (
                <img
                  alt="characterCard"
                  src={characters[currentCampaign.members[uid].character].image}
                />
              ) || <FontAwesomeIcon icon={faUserLarge} />
            } */
            description="Your character in this campaign"
          />
        ) : (
          <>
            <Modal
              className={classes.modalWindow}
              title={<h3>Select a character to join this campaign</h3>}
              centered
              open={showModal}
              onOk={joinHandler}
              okText="Join"
              okButtonProps={{ disabled: !selectedCharacter }}
              onCancel={cancelHandler}
              cancelText="Cancel"
            >
              {/*  <span>Your characters: </span> */}

              <Radio.Group
                className={classes.charactersCheckboxGroup}
                options={Object.keys(characters).map((cid) => ({
                  label: (
                    <div
                      className={
                        selectedCharacter === cid && classes.selectedCharacter
                      }
                    >
                      <CharacterCard cid={cid} inModal="true" />
                    </div>
                  ),
                  value: cid,
                }))}
                onChange={setSelectedCharacterHandler}
                value={selectedCharacter}
              />
              <div className={classes.newCharacterOptionWrapper}>
                <Link to="/NewCharacter">
                  <Button type="dashed">
                    <FontAwesomeIcon icon={faPlus} /> Create a New Character
                  </Button>
                </Link>
              </div>
            </Modal>
            <div onClick={addCharacterHandler}>
              <PlayCampaignCard
                /* goTo={`/Campaigns/${params.campaignId}/info`} */

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
          </>
        )}

        <PlayCampaignCard
          goTo={`/Campaigns/${params.campaignId}/play/shops`}
          cardFor="Shops"
          image={<FontAwesomeIcon className={classes.icon} icon={faShop} />}
          description="You can buy and sell items"
        />
        <PlayCampaignCard
          goTo={`/Campaigns/${params.campaignId}/play/combat`}
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
