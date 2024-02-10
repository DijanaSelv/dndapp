import { Link } from "react-router-dom";

const CampaignPlayPage = () => {
  return (
    <>
      <h1>Campaign title</h1>
      <Link>
        <div>Shop</div>
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
