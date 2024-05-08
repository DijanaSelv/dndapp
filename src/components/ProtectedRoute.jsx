import { useSelector } from "react-redux";
import { Navigate } from "react-router";

//checks if a user has logged in.
const ProtectedRoute = ({ children }) => {
  //userChecked flag prevents LoginPage flicker on repfresh when a user is Logged in.
  const { userChecked } = useSelector((state) => state.uiSlice);
  const { isLoggedIn } = useSelector((state) => state.userSlice);

  if (!isLoggedIn && userChecked) {
    return <Navigate to="/Login" />;
  }

  return children;
};

export default ProtectedRoute;
