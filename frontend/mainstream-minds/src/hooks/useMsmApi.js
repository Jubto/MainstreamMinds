import { useEffect } from "react";
import useAuth from "./useAuth";
import msmAPI from "../api/msmAPI";

const useMsmApi = () => {
    const { auth } = useAuth();

    useEffect(() => {
        msmAPI.defaults.headers.Authorization = `Bearer ${auth.accessToken}`;
        console.log(`Set msmAPI with JWT >${auth.accessToken}<`)
    }, [auth])

    return msmAPI;
}

export default useMsmApi;