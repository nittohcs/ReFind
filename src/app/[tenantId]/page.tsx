"use client";

export default function Page({ params }: { params: { tenantId: string } }) {
    return (
        <>{params.tenantId}</>
    );
}
