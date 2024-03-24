import { Button, Card } from "antd";
import classes from "../pages/notespage/NotesPage.module.css";
import { CloseOutlined, EditOutlined } from "@ant-design/icons";
import { Link, useParams } from "react-router-dom";
import DeleteModal from "./DeleteModal";
import { useRef, useState } from "react";
import Meta from "antd/es/card/Meta";
import { Editor } from "@tinymce/tinymce-react";
import { useDispatch } from "react-redux";
import { updateNotes } from "../app/actions/databaseActions";

const NotesCard = ({
  notes,
  noteId,
  uid,
  campaignId,
  doubleClickedNoteId,
  setDoubleClickedNoteId,
}) => {
  const editorRef = useRef();
  const [showModal, setShowModal] = useState(false);

  const dispatch = useDispatch();
  const date = new Date(+noteId);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  const saveEditHandler = () => {
    const newContent = editorRef.current.getContent();
    dispatch(updateNotes(campaignId, uid, noteId, newContent));
    setDoubleClickedNoteId(false);
  };

  return (
    <>
      <DeleteModal
        type="deleteNote"
        showModal={showModal}
        setShowModal={setShowModal}
        noteId={noteId}
        uid={uid}
        campaignId={campaignId}
      />
      <Card
        className={
          doubleClickedNoteId !== noteId
            ? `${classes.card}`
            : `${classes.card} ${classes.doubleClickedCard}`
        }
        hoverable
        size="small"
        title={notes.title}
        description="www.instagram.com"
        extra={
          doubleClickedNoteId !== noteId && (
            <div className={classes.headerButtons}>
              {" "}
              <Link onClick={() => setDoubleClickedNoteId(noteId)}>
                <EditOutlined />
              </Link>{" "}
              <Link onClick={() => setShowModal(true)}>
                <CloseOutlined />
              </Link>
            </div>
          )
        }
        style={{
          backgroundColor: `${notes.backgroundColor}`,
        }}
      >
        {doubleClickedNoteId !== noteId ? (
          <div
            className={classes.cardContent}
            dangerouslySetInnerHTML={{ __html: notes.content }}
          ></div>
        ) : (
          <Editor
            onInit={(evt, editor) => (editorRef.current = editor)}
            apiKey="gj5be9f0p9tpj5ywxgps2tjheydl1pkwhduywiex7no73ux1"
            init={{
              plugins: "autoresize image link lists emoticons save",
              toolbar:
                " bold italic underline  | checklist numlist bullist indent outdent | align lineheight | link emoticons ",
              tinycomments_mode: "embedded",
              placeholder: "Your notes here",
              menubar: "",
              statusbar: false,
              skin: "jam",
              autoresize: true,
              content_style: `body { background-color:${notes.backgroundColor}; }`,
            }}
            initialValue={notes.content}
          />
        )}
        <Meta
          className={classes.cardFooter}
          description={`${day}/${month}/${year}`}
        />
        {doubleClickedNoteId === noteId && (
          <div className={classes.editButtons}>
            <Button onClick={() => setDoubleClickedNoteId(false)}>
              Cancel
            </Button>
            <Button type="primary" onClick={saveEditHandler}>
              Save
            </Button>
          </div>
        )}
      </Card>
    </>
  );
};

export default NotesCard;
