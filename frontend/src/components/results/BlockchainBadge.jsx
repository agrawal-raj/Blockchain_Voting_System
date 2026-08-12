import React from "react";

export default function BlockchainBadge({
    verified = false,
    className = "",
}) {

    return (
        <div
            className={`
                inline-flex
                items-center
                gap-2
                px-4
                py-2
                rounded-lg
                text-sm
                font-medium
                ${
                    verified
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                }
                ${className}
            `}
        >
            <span className="text-lg">
                {verified ? "🟢" : "🔴"}
            </span>

            <span>
                {verified
                    ? "Blockchain Verified"
                    : "Blockchain Verification Failed"}
            </span>
        </div>
    );
}