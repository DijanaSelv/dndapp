import { useParams } from "react-router";
import STATIC_SHOPS from "../../app/STATIC_SHOPS";
import ShopListItem from "../../components/ShopListItem";

const CampaignShopsPage = () => {
  const params = useParams();

  return (
    <div>
      <h3>SHOPS</h3>
      <ShopListItem shop={STATIC_SHOPS.jkWY3iLz8XqR} type={params.type} />
    </div>
  );
};

export default CampaignShopsPage;
