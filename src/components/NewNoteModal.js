import { Editor } from "@tinymce/tinymce-react";
import { Modal } from "antd";
import { Radio } from "antd";

import { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { createNotes } from "../app/actions/databaseActions";

import classes from "../pages/notespage/NotesPage.module.css";
import { useParams } from "react-router";

const NewNoteModal = ({ uid, showModal, setShowModal }) => {
  const editorRef = useRef(null);
  const titleRef = useRef(null);
  const dispatch = useDispatch();
  const params = useParams();
  const [backgroundColor, setBackgroundColor] = useState("white");

  const handleOk = async () => {
    if (editorRef.current.getContent()) {
      const notesData = {
        [Date.now()]: {
          content: editorRef.current.getContent(),
          backgroundColor,
          title: titleRef.current.value,
        },
      };
      dispatch(createNotes(params.campaignId, uid, notesData));
      editorRef.current.setContent("");
      titleRef.current.value = " ";
      setShowModal(false);
    }
  };

  const handleCancel = () => {
    editorRef.current.setContent("");
    titleRef.current.value = " ";
    setBackgroundColor("white");
    setShowModal(false);
  };

  const colorChange = (e) => {
    setBackgroundColor(e.target.value);
  };

  return (
    <>
      <Modal
        className={classes.modalWindow}
        title={"Create a note"}
        centered
        open={showModal}
        onOk={handleOk}
        okText="Save"
        onCancel={handleCancel}
        cancelText="Cancel"
      >
        <input
          ref={titleRef}
          placeholder="Title"
          className={classes.modalTitleInput}
        ></input>
        <Editor
          onInit={(evt, editor) => (editorRef.current = editor)}
          apiKey="gj5be9f0p9tpj5ywxgps2tjheydl1pkwhduywiex7no73ux1"
          init={{
            plugins: "autoresize image link lists emoticons save",
            toolbar:
              "undo redo | bold italic underline  | checklist numlist bullist indent outdent | align lineheight | link emoticons ",
            tinycomments_mode: "embedded",
            placeholder: "Your notes here",
            menubar: "",
            statusbar: false,
            skin: "jam",
            autoresize: true,
            min_height: 300,
            content_style: `body { background-color:${backgroundColor}; }`,
          }}
        />
        <Radio.Group
          onChange={colorChange}
          defaultValue={backgroundColor}
          className={classes.radioWrap}
        >
          <Radio.Button
            style={{ backgroundColor: "#FFFCD8" }}
            className={classes.colorRadioButton}
            value="#FFFCD8"
          ></Radio.Button>
          <Radio.Button
            style={{ backgroundColor: "#D4F3FF" }}
            className={classes.colorRadioButton}
            value="#D4F3FF"
          ></Radio.Button>
          <Radio.Button
            style={{ backgroundColor: "#EAFFD1" }}
            className={classes.colorRadioButton}
            value="#EAFFD1"
          ></Radio.Button>
          <Radio.Button
            style={{ backgroundColor: "#ECE9FF" }}
            className={classes.colorRadioButton}
            value="#ECE9FF"
          ></Radio.Button>

          <Radio.Button
            style={{ backgroundColor: "#FFE3E1" }}
            className={classes.colorRadioButton}
            value="#FFE3E1"
          ></Radio.Button>
          <Radio.Button
            style={{ backgroundColor: "white" }}
            className={classes.colorRadioButton}
            value="white"
          ></Radio.Button>
        </Radio.Group>
      </Modal>
    </>
  );
};
export default NewNoteModal;
