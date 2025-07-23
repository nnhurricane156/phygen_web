"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function SuccessMessage() {
    const searchParams = useSearchParams();
    const successMessage = searchParams.get('message');

    if (!successMessage) return null;

    return (
        <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-md">
            {successMessage}
        </div>
    );
}

export default function SuccessMessageWrapper() {
    return (
        <Suspense fallback={null}>
            <SuccessMessage />
        </Suspense>
    );
}
