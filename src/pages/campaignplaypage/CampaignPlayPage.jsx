import { Link, useParams } from "react-router-dom";

const CampaignPlayPage = () => {
  const params = useParams();
  return (
    <>
      <h1>Campaign title</h1>
      <Link to={`/Campaigns/${params.type}/${params.campaignId}/play/shops`}>
        <div>Shops</div>
      </Link>
      <Link>
        <div>Combat</div>
      </Link>
      <Link>
        <div>Inventory</div>
      </Link>
      <Link>
        <div>Log</div>
      </Link>
      <Link>
        <div>Notes</div>
      </Link>
      <Link>
        <div>My character</div>
      </Link>
    </>
  );
};

export default CampaignPlayPage;
