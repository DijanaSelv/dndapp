import { Modal } from "antd";
import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { joinCampaign } from "../app/actions/databaseActions";

import classes from "./JoinCampaignModal.module.css";

const JoinCampaignModal = ({ showModal, setShowModal, uid }) => {
  const dispatch = useDispatch();
  const codeRef = useRef();
  const [invalidCode, setInvalidCode] = useState();

  const { joinedCampaigns, createdCampaigns } = useSelector(
    (state) => state.campaignSlice
  );

  const handleOk = async () => {
    if (!codeRef.current.value || codeRef.current.value.length !== 12) {
      setInvalidCode("Code must contain 12 characters.");
    } else {
      const codeInput = codeRef.current.value;

      const joinedCampaignCodes = Object.values(joinedCampaigns).map(
        (campaign) => campaign.joinCode
      );
      const createdCampaignCodes = Object.values(createdCampaigns).map(
        (campaign) => campaign.joinCode
      );

      if (joinedCampaignCodes.includes(codeInput)) {
        setInvalidCode("You're already a member of this campaign.");
      } else if (createdCampaignCodes.includes(codeInput)) {
        setInvalidCode(
          "You created this campaign yourself. You can change/add roles in Campaign Settings."
        );
      } else {
        try {
          const campaignId = await dispatch(joinCampaign(codeInput, uid));
          codeRef.current.value = "";
          setInvalidCode("");
          setShowModal(false);
        } catch (error) {}
      }
    }
  };

  const handleCancel = () => {
    codeRef.current.value = "";
    setInvalidCode("");
    setShowModal(false);
  };

  return (
    <>
      <Modal
        className={classes.modalWindow}
        title={"Join a campaign"}
        centered
        open={showModal}
        onOk={handleOk}
        okText="Join"
        onCancel={handleCancel}
        cancelText="Cancel"
      >
        <p>Paste the campaign code here:</p>
        <input ref={codeRef} className={classes.modalInput} />
        {invalidCode && <p className={classes.invalidCode}>{invalidCode}</p>}
      </Modal>
    </>
  );
};

export default JoinCampaignModal;
