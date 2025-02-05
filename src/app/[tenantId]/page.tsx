"use client";

export default function Page({ params }: { params: { tenantId: string } }) {
    const tenantId = decodeURIComponent(params.tenantId);

    return (
        <>{tenantId}</>
    );
}
