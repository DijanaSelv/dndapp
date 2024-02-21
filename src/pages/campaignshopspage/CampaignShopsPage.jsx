import { useParams } from "react-router";
import ShopListItem from "../../components/ShopListItem";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getShopsData } from "../../app/actions/databaseActions";

const CampaignShopsPage = () => {
  const params = useParams();
  const { shops } = useSelector((state) => state.shopsSlice);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getShopsData(params.campaignId));
  }, []);

  return (
    <div>
      <h3>SHOPS</h3>
      {Object.keys(shops).length !== 0 ? (
        Object.values(shops).map((shop) => (
          <ShopListItem key={shop.id} shop={shop} type={params.type} />
        ))
      ) : (
        <div>
          <p>There are no available shops.</p>
          {params.type === "created" && <a>Create a shop</a>}
        </div>
      )}
    </div>
  );
};

export default CampaignShopsPage;
