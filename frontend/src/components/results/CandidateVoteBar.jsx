import React from "react";

export default function CandidateVoteBar({
    candidate,
    isWinner = false,
}) {

    const percentage = Number(candidate?.percentage || 0);

    return (

        <div
            className={`
                rounded-lg
                border
                p-4
                transition-all
                duration-300
                ${
                    isWinner
                        ? "border-green-300 bg-green-50"
                        : "border-gray-200 bg-white"
                }
            `}
        >

            <div className="flex items-center justify-between">

                <div>

                    <div className="flex items-center gap-2">

                        {
                            isWinner && (

                                <span className="text-xl">

                                    🏆

                                </span>

                            )
                        }

                        <h4 className="font-semibold text-gray-800">

                            {candidate.candidate}

                        </h4>

                    </div>

                </div>

                <div className="text-right">

                    <p className="text-lg font-bold text-indigo-600">

                        {candidate.votes}

                    </p>

                    <p className="text-xs text-gray-500">

                        Votes

                    </p>

                </div>

            </div>

            <div className="mt-4">

                <div className="flex justify-between text-sm mb-2">

                    <span className="text-gray-600">

                        Vote Percentage

                    </span>

                    <span className="font-semibold">

                        {percentage.toFixed(1)}%

                    </span>

                </div>

                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">

                    <div
                        className={`
                            h-3
                            rounded-full
                            transition-all
                            duration-700
                            ${
                                isWinner
                                    ? "bg-green-500"
                                    : "bg-indigo-500"
                            }
                        `}
                        style={{
                            width: `${percentage}%`,
                        }}
                    />

                </div>

            </div>

        </div>

    );

}