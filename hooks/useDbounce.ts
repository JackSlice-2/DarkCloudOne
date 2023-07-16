import { useEffect, useState } from "react";

function useDebounce<T>(value: T, delay?: number): T {
    const [debouncedValue, setDebounceValue] = useState<T>(value);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebounceValue(value)
        }, delay || 500);
        
        return () => {
            clearTimeout(timer);
        }
    }, [value, delay]);

    return debouncedValue;
};

export default useDebounce;