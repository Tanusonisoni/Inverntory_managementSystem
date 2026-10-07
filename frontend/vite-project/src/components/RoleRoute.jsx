import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const RoleRoute = ({ roles, children }) => {
  const user = useSelector((state) => state.auth.user);
  const access = user?.role === "admin" ? "admin" : user?.department;

  return roles.includes(access) ? children : <Navigate to="/dashboard" replace />;
};

export default RoleRoute;
