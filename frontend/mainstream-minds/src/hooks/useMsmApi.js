import { useEffect } from "react";
import useAuth from "./useAuth";
import msmAPI from "../api/msmAPI";

const useMsmApi = () => {
    const { auth } = useAuth();

    useEffect(() => {
        msmAPI.defaults.headers.Authorization = `Bearer ${auth.accessToken}`;
    }, [auth])

    return msmAPI;
}

export default useMsmApi;