import { useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router";

const LoggedInRoute = ({ children }) => {
  const { isLoggedIn } = useSelector((state) => state.userSliceReducer);
  if (isLoggedIn) {
    return <Navigate to="/" />;
  }

  return children;
};

export default LoggedInRoute;
