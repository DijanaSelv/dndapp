import { Button } from "antd";

import { Link } from "react-router-dom";

const CampaignListItem = ({ campaign, type }) => {
  return (
    <div style={{ backgroundImage: `url(${campaign.image})` }}>
      <h4>{campaign.title}</h4>
      <p>
        Number of players: {campaign.players ? campaign.players.length : "0"}
      </p>
      <Link to={`/Campaigns/${type}/${campaign.id}/info`}>
        <Button>Details</Button>
      </Link>

      <Link to={`/Campaigns/${type}/${campaign.id}/play`}>
        <Button type="primary">Play</Button>
      </Link>
    </div>
  );
};

export default CampaignListItem;
