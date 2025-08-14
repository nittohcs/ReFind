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

export function downloadCSV<T extends object>(data: T[], filename: string) {
    const convertToCSV = (data: T[]) => {
        const headers = Object.keys(data[0]).join(",");
        const rows = data.map(item => Object.values(item).join(","));
        return [headers, ...rows].join("\n");
    };

    const bom = new Uint8Array([0xEF, 0xBB, 0xBF]);
    const csvData = convertToCSV(data);
    const blob = new Blob([bom, csvData], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

export function convertBMPtoPNG(file: File): Promise<Blob> {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (event: ProgressEvent<FileReader>) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                if (ctx) {
                    ctx.drawImage(img, 0, 0);
                    canvas.toBlob((blob) => {
                        if (blob) {
                            resolve(blob);
                        }
                    }, 'image/png');
                }
            };
            if (event.target && typeof event.target.result === 'string') {
                img.src = event.target.result;
            }
        };
        reader.readAsDataURL(file);
    });
};
