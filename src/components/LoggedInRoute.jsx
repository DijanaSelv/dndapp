import { useSelector } from "react-redux";
import { Navigate } from "react-router";

const LoggedInRoute = ({ children }) => {
  const { isLoggedIn } = useSelector((state) => state.userSlice);
  if (isLoggedIn) {
    return <Navigate to="/" />;
  }

  return children;
};

export default LoggedInRoute;
