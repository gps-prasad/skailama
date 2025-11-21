'use client'
import { useState, useEffect } from "react";

export default function useDebounceState(value, delay) {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => clearTimeout(timer);
    }, [value]);
    return debouncedValue;
}