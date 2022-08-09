import { useEffect } from "react";
import useAuth from "./useAuth";
import msmAPI from "../api/msmAPI";

const useMsmApi = () => {
    const { auth } = useAuth();

    useEffect(() => {
        console.log('Resetting AUTH tp: ', auth.accessToken)
        msmAPI.defaults.headers.Authorization = `Bearer ${auth.accessToken}`;
    }, [auth])

    return msmAPI;
}

export default useMsmApi;