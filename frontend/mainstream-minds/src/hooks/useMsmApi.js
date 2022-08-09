import { useEffect } from "react";
import useLocalStorage from "./useLocalStorage";
import useAuth from "./useAuth";
import msmAPI from "../api/msmAPI";

const useMsmApi = () => {
    const [authStored, setAuthStored] = useLocalStorage('auth', '')
    const { auth, setAuth } = useAuth();

    useEffect(() => {
        if (!auth.accessToken) {
            authStored && setAuth(authStored)
        }
        else {
            setAuthStored(auth)
        }
        msmAPI.defaults.headers.Authorization = `Bearer ${auth.accessToken}`;
        // console.log(`Set msmAPI with JWT >${auth.accessToken}<`)
    }, [auth])

    return msmAPI;
}

export default useMsmApi;