"use client";

export function getTodayYYYYMMDD() {
    // const now = new Date();
    // const yyyy = now.getFullYear();
    // const mm = ("00" + (now.getMonth() + 1)).slice(-2);
    // const dd = ("00" + now.getDate()).slice(-2);
    // return `${yyyy}${mm}${dd}`;
    return getDateYYYYMMDD(new Date());
}

export function getDateYYYYMMDD(date: Date) {
    const yyyy = date.getFullYear();
    const mm = ("00" + (date.getMonth() + 1)).slice(-2);
    const dd = ("00" + date.getDate()).slice(-2);
    return `${yyyy}${mm}${dd}`;
}
