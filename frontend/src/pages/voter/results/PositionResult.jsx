import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import Loader from "../../../components/common/LoadingSpinner";
import Button from "../../../components/common/Button";

import resultService from "../../../services/resultService";

export default function PositionResult() {

    const { positionId } = useParams();

    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);

    const [result, setResult] = useState(null);

    useEffect(() => {

        loadResult();

    }, [positionId]);

    const loadResult = async () => {

        try {

            setLoading(true);

            const response =
                await resultService.getPositionResult(
                    positionId
                );

            console.log(
                "Voter Position Result:",
                response
            );

            setResult(response);

        }

        catch (error) {

            console.error(error);

            toast.error(
                "Failed to load position result."
            );

        }

        finally {

            setLoading(false);

        }

    };

    if (loading) {

        return <Loader />;

    }

    if (!result) {

        return (

            <div className="p-6">

                No Result Found

            </div>

        );

    }

    const candidates =
        Array.isArray(result.candidates)
            ? result.candidates
            : [];

    return (

        <div className="max-w-6xl mx-auto p-6">

            {/* Header */}

            <div className="flex flex-col sm:flex-row justify-between gap-4 mb-8">

                <div>

                    <h1 className="text-3xl font-bold">

                        {result.position}

                    </h1>

                    <p className="text-gray-500 mt-2">

                        Total Votes:{" "}

                        {result.total_votes ?? 0}

                    </p>

                </div>

                <Button
                    onClick={() => navigate(-1)}
                >

                    Back

                </Button>

            </div>

            {/* Winner */}

            {

                result.winner && (

                    <div className="bg-green-50 border border-green-300 rounded-xl p-6 mb-8">

                        <h2 className="text-2xl font-bold text-green-700">

                            🏆 Winner

                        </h2>

                        <div className="mt-4">

                            <h3 className="text-3xl font-bold">

                                {result.winner.candidate}

                            </h3>

                            <p className="text-lg mt-2">

                                Votes:{" "}

                                {result.winner.votes}

                            </p>

                            <p className="text-lg">

                                Percentage:{" "}

                                {result.winner.percentage}%

                            </p>

                        </div>

                    </div>

                )

            }

            {/* Candidate Rankings */}

            <div className="bg-white rounded-xl shadow-md">

                <div className="p-5 border-b">

                    <h2 className="text-xl font-bold">

                        Candidate Rankings

                    </h2>

                </div>

                <div className="p-6 space-y-6">

                    {

                        candidates.length === 0 && (

                            <p className="text-gray-500">

                                No candidate results available.

                            </p>

                        )

                    }

                    {

                        candidates.map(
                            (candidate, index) => (

                                <div
                                    key={
                                        candidate.id ??
                                        index
                                    }
                                >

                                    <div className="flex justify-between items-center mb-2">

                                        <div>

                                            <span className="font-bold">

                                                {index + 1}.

                                            </span>

                                            {" "}

                                            {candidate.candidate}

                                        </div>

                                        <div className="font-medium">

                                            {candidate.votes} Votes

                                        </div>

                                    </div>

                                    <div className="w-full bg-gray-200 rounded-full h-4">

                                        <div
                                            className="bg-blue-600 h-4 rounded-full"
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

                                    <div className="text-right mt-2 text-sm text-gray-600">

                                        {
                                            candidate.percentage
                                        }%

                                    </div>

                                </div>

                            )
                        )

                    }

                </div>

            </div>

            {/* Candidate Table */}

            <div className="bg-white rounded-xl shadow-md mt-8">

                <div className="p-5 border-b">

                    <h2 className="text-xl font-bold">

                        Candidate Details

                    </h2>

                </div>

                <div className="overflow-x-auto">

                    <table className="w-full">

                        <thead>

                            <tr className="bg-gray-100">

                                <th className="p-4 text-left">

                                    Rank

                                </th>

                                <th className="p-4 text-left">

                                    Candidate

                                </th>

                                <th className="p-4 text-left">

                                    Votes

                                </th>

                                <th className="p-4 text-left">

                                    Percentage

                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {

                                candidates.map(
                                    (candidate, index) => (

                                        <tr
                                            key={
                                                candidate.id ??
                                                index
                                            }
                                            className="border-b"
                                        >

                                            <td className="p-4">

                                                {

                                                    index === 0

                                                        ? "🥇"

                                                        : index === 1

                                                            ? "🥈"

                                                            : index === 2

                                                                ? "🥉"

                                                                : index + 1

                                                }

                                            </td>

                                            <td className="p-4">

                                                {
                                                    candidate.candidate
                                                }

                                            </td>

                                            <td className="p-4">

                                                {
                                                    candidate.votes
                                                }

                                            </td>

                                            <td className="p-4">

                                                {
                                                    candidate.percentage
                                                }%

                                            </td>

                                        </tr>

                                    )
                                )

                            }

                        </tbody>

                    </table>

                </div>

            </div>

        </div>

    );

}