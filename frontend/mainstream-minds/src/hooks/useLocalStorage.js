import { useEffect, useState } from "react"

const getSavedValue = (key, initalVal) => {
    const savedVal = JSON.parse(localStorage.getItem(key))
    if (savedVal) {
        return savedVal
    }
    return initalVal
}

const useLocalStorage = (key, initalVal) => {
    const [val, setVal] = useState(() => getSavedValue(key, initalVal))

    
}

export default useLocalStorage;