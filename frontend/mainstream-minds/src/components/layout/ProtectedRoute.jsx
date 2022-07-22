import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const ProtectedRoute = ({ allowedRole }) => {
  const { auth } = useAuth();
  const location = useLocation();

  return (
    <>
      {(() => {
        if (auth.accessToken && auth.role <= allowedRole) {
          return (
            <Outlet />
          )
        }
        else if (auth.accessToken) {
          return (
            <Navigate to="/unauthorized" replace state={{ from: location }} />
          )
        }
        else {
          return (
            <Navigate to="/login" replace state={{ from: location }} />
          )
        }
      })()}
    </>
  );
}

export default ProtectedRoute;