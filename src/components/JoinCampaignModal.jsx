import { Input, Modal } from "antd";
import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { joinCampaign } from "../app/actions/databaseActions";
import { uiSliceActions } from "../app/uiSlice";

const JoinCampaignModal = ({ showModal, setShowModal, uid }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const codeRef = useRef();
  const [invalidCode, setInvalidCode] = useState();

  const { joinedCampaigns } = useSelector((state) => state.campaignSlice);

  const handleOk = async () => {
    if (!codeRef.current.value || codeRef.current.value.length !== 12) {
      setInvalidCode("Code must contain 12 characters.");
    } else {
      const codeInput = codeRef.current.value;

      const joinedCampaignCodes = Object.values(joinedCampaigns).map(
        (campaign) => campaign.joinCode
      );
      console.log(joinedCampaignCodes);
      if (joinedCampaignCodes.includes(codeInput)) {
        setInvalidCode("You're already a member of this campaign.");
      } else {
        try {
          const campaignId = await dispatch(joinCampaign(codeInput, uid));
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
