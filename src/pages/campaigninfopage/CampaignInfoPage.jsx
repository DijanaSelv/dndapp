import { Button } from "antd";
import { useSelector } from "react-redux";
import { useParams } from "react-router";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Link } from "react-router-dom";
import classes from "./CampaignInfoPage.module.css";
//TODO: add to clipboard functionality for the join code

const CampaignInfoPage = () => {
  const params = useParams();

  const { createdCampaigns, joinedCampaigns } = useSelector(
    (state) => state.campaignSlice
  );

  const campaign =
    params.type === "created"
      ? createdCampaigns[params.campaignId]
      : joinedCampaigns[params.campaignId];

  return (
    <div className={classes.content}>
      {/*  <img
        className={classes.image}
        src={campaign.image}
        style={{ maxHeight: "500px" }}
      /> */}
      <div
        className={classes.header}
        style={{
          backgroundImage: `url(${campaign.image})`,
        }}
      >
        <div className={classes.headerContent}>
          <h1 className={classes.title}>{campaign.title}</h1>
          {campaign.players !== 0 && <p>Players: {campaign.players}</p>}
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
          <div className={classes.description}>{campaign.description}</div>
          <div className={classes.join}>
            {" "}
            <p>
              Campaign code:
              <span className={classes.joinCode}> {campaign.joinCode}</span>
            </p>
            <p className={classes.info}>invite other members to join</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignInfoPage;
