import { useNavigate } from "react-router-dom";

import Button from "../common/Button";
import BlockchainBadge from "./BlockchainBadge";

export default function ResultCard({
    election,
    isAdmin = false,
}) {

    const navigate = useNavigate();

    const handleViewResult = () => {

        if (!election?.id) {
            return;
        }

        if (isAdmin) {

            navigate(
                `/admin/results/election/${election.id}`
            );

        } else {

            navigate(
                `/voter/results/${election.id}`
            );

        }

    };

    const getStatusColor = (status) => {

        switch (status) {

            case "COMPLETED":
                return "bg-green-100 text-green-700";

            case "ACTIVE":
                return "bg-blue-100 text-blue-700";

            case "UPCOMING":
                return "bg-yellow-100 text-yellow-700";

            case "DRAFT":
                return "bg-gray-100 text-gray-700";

            default:
                return "bg-gray-100 text-gray-700";

        }

    };

    return (

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-6">

            <div className="flex flex-col gap-6">

                {/* Election Information */}

                <div>

                    <h2 className="text-2xl font-bold text-gray-800">

                        {election.title}

                    </h2>

                    <p className="text-gray-500 mt-2">

                        {election.organization}

                    </p>

                    {

                        election.result_published_at && (

                            <p className="text-sm text-gray-500 mt-1">

                                Published on{" "}

                                {new Date(
                                    election.result_published_at
                                ).toLocaleString()}

                            </p>

                        )

                    }

                    {/* Status Badges */}

                    <div className="flex flex-wrap gap-3 mt-4">

                        <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                                election.status
                            )}`}
                        >

                            {election.status}

                        </span>

                        {

                            election.is_result_published && (

                                <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-medium">

                                    Published

                                </span>

                            )

                        }

                        {

                            election.blockchain_verified !==
                                undefined && (

                                <BlockchainBadge
                                    verified={
                                        election.blockchain_verified
                                    }
                                />

                            )

                        }

                    </div>

                </div>

                {/* Election Statistics */}

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">

                    <div>

                        <p className="text-sm text-gray-500">

                            Positions

                        </p>

                        <p className="text-2xl font-bold text-indigo-600">

                            {election.positions ?? 0}

                        </p>

                    </div>

                    <div>

                        <p className="text-sm text-gray-500">

                            Votes

                        </p>

                        <p className="text-2xl font-bold text-indigo-600">

                            {election.votes ?? 0}

                        </p>

                    </div>

                    <div>

                        <p className="text-sm text-gray-500">

                            Candidates

                        </p>

                        <p className="text-2xl font-bold text-indigo-600">

                            {election.candidates ?? "-"}

                        </p>

                    </div>

                    <div>

                        <p className="text-sm text-gray-500">

                            Winners

                        </p>

                        <p className="text-2xl font-bold text-green-600">

                            {election.winners ?? "-"}

                        </p>

                    </div>

                </div>

                {/* Actions */}

                <div className="flex flex-wrap justify-end gap-3 pt-4 border-t border-gray-200">

                    <Button
                        onClick={handleViewResult}
                    >

                        View Results

                    </Button>

                    {

                        isAdmin &&
                        election.is_result_published && (

                            <Button
                                variant="success"
                                onClick={handleViewResult}
                            >

                                Manage

                            </Button>

                        )

                    }

                </div>

            </div>

        </div>

    );

}