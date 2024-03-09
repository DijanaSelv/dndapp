import { useSelector } from "react-redux";
import { Navigate } from "react-router";

//checks if a user has logged in.
const ProtectedRoute = ({ children }) => {
  const { isLoggedIn } = useSelector((state) => state.userSlice);
  if (!isLoggedIn) {
    return <Navigate to="/Login" />;
  }

  return children;
};

export default ProtectedRoute;
