import { useEffect } from "react";
import { useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import ShopListItem from "../../components/ShopListItem";
import { getShopsData, watchShops } from "../../app/actions/databaseActions";

import NotificationBox from "../../components/NotificationBox";

import classes from "./CampaignShopsPage.module.css";
import { Link } from "react-router-dom";
import { LoadingOutlined, PlusCircleOutlined } from "@ant-design/icons";

const CampaignShopsPage = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.uiSlice);
  const { shops, loading } = useSelector((state) => state.shopsSlice);
  const { creator, dm } = useSelector((state) => state.rolesSlice);
  const { requestSuccess, requestFailed, notification } = useSelector(
    (state) => state.uiSlice
  );

  useEffect(() => {
    const unsubscribe = dispatch(watchShops(params.campaignId));
    return () => {
      if (typeof unsubscribe === "function") unsubscribe();
    };
  }, [dispatch, params.campaignId]);

  useEffect(() => {
    if (!isLoading && shops && Object.keys(shops).length === 0) {
      const cleanup = dispatch(getShopsData(params.campaignId));
      return () => {
        if (typeof cleanup === "function") {
          cleanup();
        }
      };
    }
  }, [dispatch, params.campaignId, isLoading]);

  return (
    <>
      <div className={classes.content}>
        {notification && <NotificationBox />}
        <div className={classes.shopsHeader}>
          <h2 className={classes.title}>Shops</h2>{" "}
          <Link className={classes.createShopLink} to="NewShop">
            Create <PlusCircleOutlined />
          </Link>
        </div>
        <ul className={classes.shopCards}>
          {(loading && !shops.length) || isLoading ? (
            <LoadingOutlined />
          ) : Object.keys(shops).length !== 0 ? (
            Object.values(shops).map((shop) => (
              <ShopListItem
                key={shop.id}
                shop={shop}
                type={creator || dm ? "created" : ""}
              />
            ))
          ) : (
            <div>
              <p>There are no available shops.</p>
              {params.type === "created" && <a>Create a shop</a>}
            </div>
          )}
        </ul>
      </div>
    </>
  );
};

export default CampaignShopsPage;
