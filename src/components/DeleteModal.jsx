import { useDispatch, useSelector } from "react-redux";
import { deleteCampaign, deleteShop } from "../app/actions/databaseActions";
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

  return content;
};

export default DeleteModal;
