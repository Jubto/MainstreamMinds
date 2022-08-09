import { useEffect, useState } from "react"

const getSavedValue = (key, initalVal) => {
    const savedVal = JSON.parse(localStorage.getItem(key)) // get saved val from local storage
    if (savedVal) {
        return savedVal
    }
    return initalVal
}

const useLocalStorage = (key, initalVal) => {
    const [val, setVal] = useState(() => getSavedValue(key, initalVal)) // this gets called only once since its an anon func
    
    useEffect(() => {
        console.log('SETTING LOCAL STORAGE')
        console.log(val)
        console.log('++++++')
        localStorage.setItem(key, JSON.stringify(val)) // each time val gets updated from outside, save it to local
    }, [val])

    return [val, setVal]
}

export default useLocalStorage;