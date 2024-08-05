import { Button, Modal, Radio } from "antd";
import classes from "../pages/campaignplaypage/CampaginPlayPage.module.css";
import CharacterCard from "./CharacterCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { addCharacterToCampaign } from "../app/actions/databaseActions";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export const AddCharacterToCampaignModal = ({
  children,
  showModal,
  setShowModal,
}) => {
  const dispatch = useDispatch();

  const [selectedCharacter, setSelectedCharacter] = useState();
  const { uid, characters } = useSelector((state) => state.userSlice.user);
  const { currentCampaign } = useSelector((state) => state.campaignSlice);

  const joinHandler = () => {
    console.log(uid, selectedCharacter, currentCampaign.id);
    dispatch(
      addCharacterToCampaign(uid, selectedCharacter, currentCampaign.id)
    );
    setSelectedCharacter(null);
    setShowModal(false);
  };

  const cancelHandler = () => {
    setShowModal(false);
    setSelectedCharacter(null);
  };

  const setSelectedCharacterHandler = (e) => {
    setSelectedCharacter(e.target.value);
  };

  return (
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

        {characters && (
          <Radio.Group
            className={classes.charactersCheckboxGroup}
            options={Object.keys(characters).map((cid) => ({
              label: (
                <div
                  className={
                    selectedCharacter === cid
                      ? classes.selectedCharacter
                      : undefined
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
        )}
        <div className={classes.newCharacterOptionWrapper}>
          <Link to="/NewCharacter">
            <Button type="dashed">
              <FontAwesomeIcon icon={faPlus} /> Create a New Character
            </Button>
          </Link>
        </div>
      </Modal>
      {children}
    </>
  );
};
