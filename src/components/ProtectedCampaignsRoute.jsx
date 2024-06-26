import { useSelector } from "react-redux";
import { Navigate, useParams } from "react-router";

//so that the user can't manually change created/joined campaigns in url.
//But do i really need campaingType in mu url? Now that i have permissions.
const ProtectedCampaignsRoute = ({ children }) => {
  const params = useParams();
  const { campaigns } = useSelector((state) => state.userSlice.user);
  const { isLoggedIn } = useSelector((state) => state.userSlice);
  const { userChecked } = useSelector((state) => state.uiSlice);

  if (!isLoggedIn) {
    return <Navigate to="/Login" />;
  } else if (
    params.type === "created" &&
    !Object.keys(campaigns.created).includes(params.campaignId)
  ) {
    return <Navigate to="/" />;
  } else if (
    params.type === "joined" &&
    !Object.keys(campaigns.joined).includes(params.campaignId)
  ) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedCampaignsRoute;
