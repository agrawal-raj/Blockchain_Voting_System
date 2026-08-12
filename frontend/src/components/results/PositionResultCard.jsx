import { useNavigate } from "react-router-dom";

import Button from "../common/Button";

export default function PositionResultCard({
    position,
    isAdmin = true,
}) {

    const navigate = useNavigate();

    if (!position) {
        return null;
    }

    const candidates = Array.isArray(position.candidates)
        ? position.candidates
        : [];

    const handleViewDetails = () => {

        if (!position.position_id) {
            return;
        }

        if (isAdmin) {

            navigate(
                `/admin/results/position/${position.position_id}`
            );

        } else {

            navigate(
                `/voter/results/position/${position.position_id}`
            );

        }

    };

    return (

        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">

            <div className="flex flex-col gap-6">

                {/* Position Header */}

                <div className="flex flex-col md:flex-row justify-between gap-4">

                    <div>

                        <h2 className="text-xl font-bold text-gray-800">

                            {position.position}

                        </h2>

                        <p className="mt-2 text-gray-600">

                            Total Votes:{" "}

                            {position.total_votes ?? 0}

                        </p>

                        <p className="mt-2 text-green-600 font-semibold">

                            Winner:{" "}

                            {

                                position.winner

                                    ? position.winner.candidate

                                    : "No Winner"

                            }

                        </p>

                    </div>

                    <div>

                        <Button
                            onClick={handleViewDetails}
                        >

                            View Details

                        </Button>

                    </div>

                </div>

                {/* Candidate Results */}

                {

                    candidates.length > 0 && (

                        <div className="space-y-5">

                            <h3 className="text-lg font-semibold text-gray-800">

                                Candidate Results

                            </h3>

                            {

                                candidates.map(
                                    (candidate, index) => (

                                        <div
                                            key={
                                                candidate.id ??
                                                `${position.position_id}-${index}`
                                            }
                                        >

                                            <div className="flex justify-between items-center mb-2">

                                                <div className="flex items-center gap-2">

                                                    <span className="font-semibold text-gray-700">

                                                        {index + 1}.

                                                    </span>

                                                    <span>

                                                        {
                                                            candidate.candidate
                                                        }

                                                    </span>

                                                </div>

                                                <div className="text-sm font-medium text-gray-600">

                                                    {
                                                        candidate.votes
                                                    }{" "}

                                                    votes

                                                    {" · "}

                                                    {
                                                        candidate.percentage
                                                    }%

                                                </div>

                                            </div>

                                            <div className="w-full bg-gray-200 rounded-full h-3">

                                                <div
                                                    className="bg-blue-600 h-3 rounded-full transition-all"
                                                    style={{
                                                        width: `${Math.min(
                                                            Math.max(
                                                                Number(
                                                                    candidate.percentage
                                                                ) || 0,
                                                                0
                                                            ),
                                                            100
                                                        )}%`,
                                                    }}
                                                />

                                            </div>

                                        </div>

                                    )
                                )

                            }

                        </div>

                    )

                }

                {

                    candidates.length === 0 && (

                        <div className="text-gray-500 text-sm">

                            No candidate result details available.

                        </div>

                    )

                }

            </div>

        </div>

    );

}