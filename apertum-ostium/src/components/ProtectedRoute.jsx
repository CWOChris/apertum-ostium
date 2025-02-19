import { Navigate } from "react-router-dom";
import { getLoggedInUser } from "../db/indexedDB";

const ProtectedRoute = ({ children }) => {
  return getLoggedInUser() ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
