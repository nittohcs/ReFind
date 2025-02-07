"use client";

import { useEffect, useState } from "react";

export const useTodayYYYYMMDD = () => {
    const [currentDate, setCurrentDate] = useState("");

    useEffect(() => {
        const updateDate = () => {
            const now = new Date();
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, "0");
            const day = String(now.getDate()).padStart(2, "0");
            setCurrentDate(`${year}${month}${day}`);
        };

        updateDate();

        const calculateMsUntilMidnight = () => {
            const now = new Date();
            const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
            return tomorrow.getTime() - now.getTime();
        };

        const timeoutId = setTimeout(() => {
            updateDate();
            setInterval(updateDate, 24 * 60 * 60* 1000);
        }, calculateMsUntilMidnight());

        return () => {
            clearTimeout(timeoutId);
        };
    }, []);
    
    return currentDate;
};
