import { useSelector } from "react-redux";
import { Navigate, useParams } from "react-router";

const ProtectedCampaignsRoute = ({ children }) => {
  const params = useParams();
  const { campaigns } = useSelector((state) => state.userSlice.user);
  const { isLoggedIn } = useSelector((state) => state.userSlice);

  if (!isLoggedIn) {
    return <Navigate to="/Login" />;
  } else if (
    params.type === "created" &&
    !Object.keys(campaigns.created).includes(params.campaignId)
  ) {
    return <Navigate to="/Login" />;
  } else if (
    params.type === "joined" &&
    !Object.keys(campaigns.joined).includes(params.campaignId)
  ) {
    return <Navigate to="/Login" />;
  }

  return children;
};

export default ProtectedCampaignsRoute;
