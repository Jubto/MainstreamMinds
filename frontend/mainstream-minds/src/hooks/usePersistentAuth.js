import { useEffect, useState } from "react"
import { getSavedValue } from "../utils/helpers"

const usePersistentAuth = (key, initalVal) => {
    const [storedAuth, setPersistentAuth] = useState(() => getSavedValue(key, initalVal))

    useEffect(() => {
        // each time val gets updated from outside, save it to local
        localStorage.setItem(key, JSON.stringify(storedAuth))
    }, [storedAuth])

    return [storedAuth, setPersistentAuth]
}

export default usePersistentAuth;