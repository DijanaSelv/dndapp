import { Modal } from "antd";
import { useNavigate } from "react-router";

const CancelModal = ({ showModal, setShowModal }) => {
  const navigate = useNavigate();

  const handleOk = () => {
    navigate(-1);
    setShowModal(false);
  };

  const handleCancel = () => {
    setShowModal(false);
  };

  return (
    <>
      <Modal
        title={"Leaving page"}
        centered
        open={showModal}
        onOk={handleOk}
        okText="Leave page"
        onCancel={handleCancel}
        cancelText="Stay on page"
      >
        <p>Changes that you made will not be saved.</p>
        <p>Are you sure you want to leave this page?</p>
      </Modal>
    </>
  );
};

export default CancelModal;
