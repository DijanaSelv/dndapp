import { useSelector } from "react-redux";
import { Navigate } from "react-router";

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn } = useSelector((state) => state.userSliceReducer);
  if (!isLoggedIn) {
    return <Navigate to="/Login" />;
  }

  return children;
};

export default ProtectedRoute;
