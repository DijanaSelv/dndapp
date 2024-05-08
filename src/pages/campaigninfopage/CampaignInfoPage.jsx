import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { getMembers } from "../../app/actions/databaseActions";

import { Button } from "antd";
import { CheckOutlined, CopyOutlined } from "@ant-design/icons";
import { CopyToClipboard } from "react-copy-to-clipboard";
import classes from "./CampaignInfoPage.module.css";

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
  const [copy, setCopy] = useState({ value: "", copied: false });

  const roles = [
    dm === true && "dm",
    player === true && "player",
    creator === true && "creator",
    loremaster === true && "loremaster",
  ].filter(Boolean);

  console.log(roles);

  const campaign =
    params.type === "created"
      ? createdCampaigns[params.campaignId]
      : joinedCampaigns[params.campaignId];

  const showMembers = async () => {
    const playersData = await dispatch(getMembers(params.campaignId, "player"));
    const dmData = await dispatch(getMembers(params.campaignId, "dm"));

    setPlayerMembers(playersData);
    setDmMembers(dmData);
    console.log("members shown");
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
          <Link to={`/Campaigns/${params.type}/${campaign.id}/play`}>
            <h1 className={classes.title}>{campaign.title}</h1>
          </Link>
        </div>
      </div>
      <div>
        <div className={classes.details}>
          <h3 className={classes.sectionTitle}>Players</h3>
          <div className={classes.playersInfo}>
            {" "}
            {dmMembers.length !== 0 && <p>DM : {dmMembers.join(", ")}</p>}
            {playerMembers.length !== 0 && (
              <p>Players : {playerMembers.join(", ")}</p>
            )}
            <p>
              Your role{roles.length > 1 ? "s" : ""} : {roles.join(", ")}
            </p>
          </div>
          <h3 className={classes.sectionTitle}>Description</h3>
          <div className={classes.description}>{campaign.description}</div>
          {dm === true && (
            <div className={classes.join}>
              <div className={classes.joinContent}>
                {" "}
                <p>Campaign code: </p>
                <p className={classes.joinCode}> {campaign.joinCode} </p>{" "}
                <p className={classes.info}>invite other members to join</p>
              </div>
              <div className={classes.copy}>
                <CopyToClipboard
                  text={campaign.joinCode}
                  onCopy={() =>
                    setCopy({ copied: true, value: campaign.joinCode })
                  }
                >
                  <Button type={copy.copied ? "default" : "dashed"}>
                    {copy.copied ? <CheckOutlined /> : <CopyOutlined />}
                  </Button>
                </CopyToClipboard>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CampaignInfoPage;
