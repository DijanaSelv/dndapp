import { Input, Modal } from "antd";
import { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { joinCampaign } from "../app/actions/databaseActions";

const JoinCampaignModal = ({ showModal, setShowModal, uid }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const codeRef = useRef();
  const [invalidCode, setInvalidCode] = useState();

  const handleOk = async () => {
    if (!codeRef.current.value || codeRef.current.value.length !== 12) {
      setInvalidCode("Code must contain 12 characters.");
    } else {
      const joinCode = codeRef.current.value;
      try {
        const campaignId = await dispatch(joinCampaign(joinCode, uid));
      } catch (error) {}
      //check if campaign exists
      //fetch campaign
      //navigate to campaign
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
        title={"Join a campaign"}
        centered
        open={showModal}
        onOk={handleOk}
        okText="Join"
        onCancel={handleCancel}
        cancelText="Cancel"
      >
        <p>Paste the campaign code here:</p>
        <input ref={codeRef} />
        {invalidCode && <p>{invalidCode}</p>}
      </Modal>
    </>
  );
};

export default JoinCampaignModal;
