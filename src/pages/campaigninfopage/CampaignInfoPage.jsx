import { Button } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Link } from "react-router-dom";
import classes from "./CampaignInfoPage.module.css";
import { useEffect, useState } from "react";
import { getMembers } from "../../app/actions/databaseActions";
//TODO: add to clipboard functionality for the join code

const CampaignInfoPage = () => {
  const params = useParams();
  const dispatch = useDispatch();

  const { createdCampaigns, joinedCampaigns } = useSelector(
    (state) => state.campaignSlice
  );
  const { dm, player, creator, loremaster } = useSelector(
    (state) => state.rolesSlice
  );

  const [playerMembers, setPlayerMembers] = useState([]);
  const [dmMembers, setDmMembers] = useState([]);

  const roles = [
    dm === true && "dm",
    player === true && "player",
    creator === true && "creator",
    loremaster === true && "loremaster",
  ].filter(Boolean);

  const campaign =
    params.type === "created"
      ? createdCampaigns[params.campaignId]
      : joinedCampaigns[params.campaignId];

  const showMembers = async () => {
    const playersData = await dispatch(getMembers(params.campaignId, "player"));
    const dmData = await dispatch(getMembers(params.campaignId, "dm"));

    setPlayerMembers(playersData);
    setDmMembers(dmData);
  };

  useEffect(() => {
    showMembers();
  }, []);

  return (
    <div className={classes.content}>
      <div
        className={classes.header}
        style={{
          backgroundImage: `url(${campaign.image})`,
        }}
      >
        <div className={classes.headerContent}>
          <h1 className={classes.title}>{campaign.title}</h1>
          {dmMembers.length !== 0 && <p>DM : {dmMembers.join(", ")}</p>}
          {playerMembers.length !== 0 && (
            <p>Players : {playerMembers.join(", ")}</p>
          )}
          <Link
            className={classes.button}
            to={`/Campaigns/${params.type}/${campaign.id}/play`}
          >
            Play
          </Link>
        </div>
      </div>
      <div>
        <div className={classes.details}>
          <p className={classes.roles}>
            Your role{roles.lenght > 1 ? "s" : ""} : {roles.join(", ")}
          </p>
          <div className={classes.description}>{campaign.description}</div>
          {dm === true && (
            <div className={classes.join}>
              {" "}
              <p>
                Campaign code:
                <span className={classes.joinCode}> {campaign.joinCode}</span>
              </p>
              <p className={classes.info}>invite other members to join</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CampaignInfoPage;
