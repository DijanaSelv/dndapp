import { useParams } from "react-router";
import classes from "../pages/combatpage/CombatPage.module.css";

export const CombatRollWrapper = ({
  character,
  content,
  type,
  uid,
  details,
}) => {
  const params = useParams();

  return (
    <div
      className={`${classes.combatMessageWrapper} ${
        uid === params.uid ? classes.ownMessageWrapper : ""
      }`}
    >
      <p className={classes.messageHeader}>
        {`${character !== "" ? character : "A guest"} ${
          type === "message" ? "wrote" : "rolled"
        }`}{" "}
        :
      </p>{" "}
      {type !== "message" && (
        <div className={classes.rollContent}>
          <p>{content}</p>
          {details && <p>{details}</p>}
        </div>
      )}
      {type === "message" && (
        <div className={classes.messageContent}>"{content}"</div>
      )}
    </div>
  );
};
