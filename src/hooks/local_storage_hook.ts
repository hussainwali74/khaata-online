import { useEffect, useState } from "react";

// Create a custom hook for LocalStorage
export function useLocalStorage<T>(key: string, fallbackValue: T) {
    const [value, setValue] = useState(fallbackValue);

    useEffect(() => {
        const stored = localStorage.getItem(key);
        console.log('stored', stored);
        if(stored){
            setValue(stored ? JSON.parse(stored) : fallbackValue);
        }
    }, [fallbackValue, key]);

    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(value));
    }, [key, value]);

    return [value, setValue] as const;
}
