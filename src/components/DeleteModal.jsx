import React, { useState } from "react";
import { Button, Modal } from "antd";
import { useDispatch } from "react-redux";
import { deleteCampaign } from "../app/actions/databaseActions";

const DeleteModal = ({ campaign, showModal, setShowModal }) => {
  const dispatch = useDispatch();
  const handleOk = () => {
    //dispatch a function to delete the campaign from the user and from the campaigns base.
    console.log("deleted");
    console.log(campaign, "campaign");
    dispatch(deleteCampaign(campaign.id));
    setShowModal(false);
  };

  const handleCancel = () => {
    setShowModal(false);
  };

  return (
    <>
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
    </>
  );
};

export default DeleteModal;
