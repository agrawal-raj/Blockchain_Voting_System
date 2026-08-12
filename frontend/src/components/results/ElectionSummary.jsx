import React from "react";
import BlockchainBadge from "./BlockchainBadge";

export default function ElectionSummary({
    organization,
    election,
    status,
    publishedAt,
    blockchainVerified,
    totalPositions,
    totalVotes,
}) {

    return (

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">

            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-6">

                {/* Left Section */}

                <div className="flex-1">

                    <p className="text-sm text-gray-500 mb-1">

                        Organization

                    </p>

                    <h2 className="text-2xl font-bold text-gray-800">

                        {organization || "-"}

                    </h2>

                    <h1 className="text-3xl font-bold text-indigo-600 mt-2">

                        {election || "-"}

                    </h1>

                    <div className="mt-4 flex flex-wrap gap-3">

                        <span
                            className={`px-3 py-1 rounded-full text-sm font-medium
                            ${
                                status === "COMPLETED"
                                    ? "bg-green-100 text-green-700"
                                    : status === "ACTIVE"
                                    ? "bg-blue-100 text-blue-700"
                                    : "bg-gray-100 text-gray-700"
                            }`}
                        >
                            {status}
                        </span>

                        {
                            publishedAt && (

                                <span className="text-sm text-gray-600">

                                    Published on{" "}
                                    {new Date(
                                        publishedAt
                                    ).toLocaleString()}

                                </span>

                            )
                        }

                    </div>

                </div>

                {/* Right Section */}

                <div className="flex flex-col items-start lg:items-end gap-4">

                    <BlockchainBadge
                        verified={blockchainVerified}
                    />

                </div>

            </div>

            <hr className="my-6" />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

                <div className="bg-gray-50 rounded-lg p-4">

                    <p className="text-sm text-gray-500">

                        Total Positions

                    </p>

                    <p className="text-3xl font-bold text-indigo-600">

                        {totalPositions}

                    </p>

                </div>

                <div className="bg-gray-50 rounded-lg p-4">

                    <p className="text-sm text-gray-500">

                        Total Votes

                    </p>

                    <p className="text-3xl font-bold text-green-600">

                        {totalVotes}

                    </p>

                </div>

            </div>

        </div>

    );

}