import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";

import { getNotes } from "../../app/actions/databaseActions";
import NotesCard from "../../components/NotesCard";
import classes from "./NotesPage.module.css";
import { Link } from "react-router-dom";
import { PlusCircleOutlined } from "@ant-design/icons";
import NewNoteModal from "../../components/NewNoteModal";
import { uiSliceActions } from "../../app/uiSlice";

const NotesPage = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const { uid } = useSelector((state) => state.userSlice.user);
  const { notes } = useSelector((state) => state.notesSlice);
  const { requestSuccess } = useSelector((state) => state.uiSlice);
  const [showModal, setShowModal] = useState(false);
  const [doubleClickedNoteId, setDoubleClickedNoteId] = useState(null);

  useEffect(() => {
    uid && dispatch(getNotes(params.campaignId, uid));
    dispatch(uiSliceActions.resetRequestState());
  }, [requestSuccess, uid]);

  const doubleClickHandler = (notesKey) => {
    setDoubleClickedNoteId(notesKey);
  };

  return (
    <>
      <NewNoteModal
        showModal={showModal}
        setShowModal={setShowModal}
        uid={uid}
      />
      <div className={classes.content}>
        <div className={classes.header}>
          <h2 className={classes.title}>Personal Notes</h2>
          <Link
            className={classes.createNoteLink}
            onClick={() => setShowModal(true)}
          >
            New Note <PlusCircleOutlined />
          </Link>
        </div>
        <div className={classes.noteCards}>
          {Object.keys(notes).lenght !== 0 &&
            Object.keys(notes).map((notesKey) => (
              <div
                key={notesKey}
                onDoubleClick={() => doubleClickHandler(notesKey)}
              >
                <NotesCard
                  doubleClickedNoteId={doubleClickedNoteId}
                  setDoubleClickedNoteId={setDoubleClickedNoteId}
                  notes={notes[notesKey]}
                  noteId={notesKey}
                  uid={uid}
                  campaignId={params.campaignId}
                />
              </div>
            ))}
        </div>
      </div>
    </>
  );
};
export default NotesPage;
