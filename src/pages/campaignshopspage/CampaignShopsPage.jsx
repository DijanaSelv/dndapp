import { useEffect } from "react";
import { useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import ShopListItem from "../../components/ShopListItem";
import { getShopsData } from "../../app/actions/databaseActions";

import { Spin } from "antd";
import NotificationBox from "../../components/NotificationBox";

import classes from "./CampaignShopsPage.module.css";
import { Link } from "react-router-dom";
import { PlusCircleOutlined } from "@ant-design/icons";
import { uiSliceActions } from "../../app/uiSlice";

const CampaignShopsPage = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.uiSlice);
  const { shops } = useSelector((state) => state.shopsSlice);
  const { requestSuccess, requestFailed, notification } = useSelector(
    (state) => state.uiSlice
  );

  useEffect(() => {
    dispatch(getShopsData(params.campaignId));
    dispatch(uiSliceActions.resetRequestState());
  }, [requestSuccess, requestFailed]);

  return (
    <>
      {isLoading && !shops.length ? (
        <Spin />
      ) : (
        <div className={classes.content}>
          {notification && <NotificationBox />}
          <div className={classes.shopsHeader}>
            <h2>SHOPS</h2>{" "}
            <Link className={classes.createShopLink} to="NewShop">
              Create <PlusCircleOutlined />
            </Link>
          </div>
          <ul className={classes.shopCards}>
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
          </ul>
        </div>
      )}
    </>
  );
};

export default CampaignShopsPage;
