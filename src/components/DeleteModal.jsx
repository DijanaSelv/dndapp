import { useDispatch, useSelector } from "react-redux";
import {
  deleteCampaign,
  deleteCharacter,
  deleteNotes,
  deleteShop,
  leaveCampaign,
  removeCharacterFromCampaign,
} from "../app/actions/databaseActions";
import { Modal } from "antd";
import { useNavigate } from "react-router";

const DeleteModal = (props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { uid } = useSelector((state) => state.userSlice.user);
  let content;

  //DELETE CAMPAIGN
  if (props.type === "campaign") {
    const { campaign, showModal, setShowModal } = props;
    const handleOk = () => {
      dispatch(deleteCampaign(campaign.id, uid));
      setShowModal(false);
      navigate("/");
    };

    const handleCancel = () => {
      setShowModal(false);
    };

    content = (
      <Modal
        title={`Deleting "${campaign.title}"`}
        centered
        open={showModal}
        onOk={handleOk}
        okText="Delete"
        okButtonProps={{
          style: { backgroundColor: "red", borderColor: "red" },
        }}
        onCancel={handleCancel}
      >
        <p>Are you sure you want to permanently delete this campaign?</p>
        <p style={{ fontWeight: "bold" }}></p>
      </Modal>
    );
  }
  if (props.type === "leaveCampaign") {
    const { campaign, showModal, setShowModal } = props;
    const handleOk = () => {
      dispatch(leaveCampaign(campaign.id, uid));
      setShowModal(false);
      navigate("/");
    };
    const handleCancel = () => {
      setShowModal(false);
    };

    content = (
      <Modal
        title={`Leaving "${campaign.title}"`}
        centered
        open={showModal}
        onOk={handleOk}
        okText="Leave"
        okButtonProps={{
          style: { backgroundColor: "red", borderColor: "red" },
        }}
        onCancel={handleCancel}
      >
        <p>Are you sure you want to leave this campaign?</p>
        <p style={{ fontWeight: "bold" }}></p>
      </Modal>
    );
  }

  //DELETE SHOP
  if (props.type === "shop") {
    const {
      campaignId,
      shopId,
      shopTitle,
      showModal,
      setShowModal,
      navigatePath,
    } = props;

    const handleOk = () => {
      dispatch(deleteShop(campaignId, shopId));
      setShowModal(false);
      navigatePath && navigate(navigatePath);
    };
    const handleCancel = () => {
      setShowModal(false);
    };

    content = (
      <Modal
        title={`Deleting shop "${shopTitle}"`}
        centered
        open={showModal}
        onOk={handleOk}
        okText="Delete"
        okButtonProps={{
          style: { backgroundColor: "red", borderColor: "red" },
        }}
        onCancel={handleCancel}
      >
        <p>Are you sure you want to permanently delete this shop?</p>
        <p style={{ fontWeight: "bold" }}></p>
      </Modal>
    );
  }

  if (props.type === "deleteNote") {
    const { uid, campaignId, noteId, showModal, setShowModal } = props;

    const handleOk = () => {
      dispatch(deleteNotes(campaignId, uid, noteId));
      setShowModal(false);
    };
    const handleCancel = () => {
      setShowModal(false);
    };
    content = (
      <Modal
        title={`Deleting note`}
        centered
        open={showModal}
        onOk={handleOk}
        okText="Delete"
        okButtonProps={{
          style: { backgroundColor: "red", borderColor: "red" },
        }}
        onCancel={handleCancel}
      >
        <p>Are you sure you want to permanently delete this note?</p>
        <p style={{ fontWeight: "bold" }}></p>
      </Modal>
    );
  }
  if (props.type === "deleteCharacter") {
    const { uid, characterId, showModal, setShowModal } = props;

    const handleOk = () => {
      dispatch(deleteCharacter(uid, characterId));
      setShowModal(false);
      navigate("/");
    };
    const handleCancel = () => {
      setShowModal(false);
    };
    content = (
      <Modal
        title={`Deleting character`}
        centered
        open={showModal}
        onOk={handleOk}
        okText="Delete"
        okButtonProps={{
          style: { backgroundColor: "red", borderColor: "red" },
        }}
        onCancel={handleCancel}
      >
        <p>Are you sure you want to permanently delete this character?</p>
        <p style={{ fontWeight: "bold" }}></p>
      </Modal>
    );
  }
  if (props.type === "removeCharacter") {
    const { uid, campaignId, showModal, setShowModal } = props;

    const handleOk = () => {
      dispatch(removeCharacterFromCampaign(uid, campaignId));
      setShowModal(false);
      navigate(`/Campaigns/${campaignId}/play`);
    };
    const handleCancel = () => {
      setShowModal(false);
    };
    content = (
      <Modal
        title={`Removing character`}
        centered
        open={showModal}
        onOk={handleOk}
        okText="Remove"
        okButtonProps={{
          style: { backgroundColor: "red", borderColor: "red" },
        }}
        onCancel={handleCancel}
      >
        <p>
          You're about to remove your character from this campaign. You can
          still access your character in your Characters section, but not as
          part of this campaign.
        </p>
        <p style={{ fontWeight: "bold" }}></p>
      </Modal>
    );
  }

  return content;
};

export default DeleteModal;
