import { useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router";

//checks if a user has logged in.
const RoleProtectedRoute = ({ children, permittedRoles }) => {
  const roles = useSelector((state) => state.rolesSlice);
  const navigate = useNavigate();

  if (!permittedRoles.some((permittedRole) => roles[permittedRole] === true)) {
    return <Navigate to="/" />;
  }

  return children;
};

export default RoleProtectedRoute;
