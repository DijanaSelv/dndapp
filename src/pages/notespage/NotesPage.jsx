import { Editor } from "@tinymce/tinymce-react";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createNotes, getNotes } from "../../app/actions/databaseActions";
import { useParams } from "react-router";
import NotesCard from "../../components/NotesCard";

const NotesPage = () => {
  const editorRef = useRef(null);
  const dispatch = useDispatch();
  const params = useParams();
  const { uid } = useSelector((state) => state.userSlice.user);
  const { notes } = useSelector((state) => state.notesSlice);

  useEffect(() => {
    dispatch(getNotes(params.campaignId, uid));
  }, [notes]);

  const saveNotes = () => {
    if (editorRef.current) {
      const notesData = {
        [Date.now()]: editorRef.current.getContent(),
      };
      dispatch(createNotes(params.campaignId, uid, notesData));
      editorRef.current.setContent("");
    }
  };

  return (
    <>
      {Object.keys(notes).lenght !== 0 &&
        Object.keys(notes).map((notesKey) => (
          <NotesCard key={notesKey} notesContent={notes[notesKey]} />
        ))}
      <Editor
        onInit={(evt, editor) => (editorRef.current = editor)}
        apiKey="gj5be9f0p9tpj5ywxgps2tjheydl1pkwhduywiex7no73ux1"
        init={{
          plugins: "autoresize image link lists emoticons save",
          toolbar:
            "undo redo | bold italic underline  | checklist numlist bullist indent outdent | align lineheight | link emoticons ",
          tinycomments_mode: "embedded",

          menubar: "",
          statusbar: false,
          skin: "jam",
          autoresize: true,
          min_height: 300,
          max_height: 500,
          width: 400,
          save_onsavecallback: () => {
            console.log("Saved");
          },
          mergetags_list: [
            { value: "First.Name", title: "First Name" },
            { value: "Email", title: "Email" },
          ],
        }}
        /* initialValue="Welcome to TinyMCE!" */
      />
      <button onClick={saveNotes}>Save</button>
    </>
  );
};
export default NotesPage;
