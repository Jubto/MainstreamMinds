import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import usePersistentAuth from "../../hooks/usePersistentAuth";
import useAuth from "../../hooks/useAuth";

const PersistentLogin = () => {
  const [authStored] = usePersistentAuth('auth', '')
  const { auth, setAuth } = useAuth();

  useEffect(() => {
    if (!auth.accessToken) {
      // if this component mounts and localstorage contains auth, then log user back in
      authStored.accessToken && setAuth(authStored)
    }
  }, [])

  return (
    <Outlet /> // All child roots
  );
}

export default PersistentLogin;