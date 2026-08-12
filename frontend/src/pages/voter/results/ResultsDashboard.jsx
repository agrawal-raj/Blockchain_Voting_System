import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import Loader from "../../../components/common/LoadingSpinner";
import Button from "../../../components/common/Button";

import resultService from "../../../services/resultService";
import ResultCard from "../../../components/results/ResultCard";

export default function ResultsDashboard() {

    const navigate = useNavigate();

    const [results, setResults] = useState([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        loadResults();

    }, []);

    const loadResults = async () => {

        try {

            setLoading(true);

            const response =
                await resultService.publishedResults();

            const publishedResults =
                Array.isArray(response?.results)
                    ? response.results
                    : [];

            /*
             * The published-results API returns summary data.
             *
             * Candidate and winner counts are available
             * from the detailed election-result API.
             *
             * Fetch the detailed result for each published
             * election so the dashboard can display:
             *
             * Candidates
             * Winners
             */

            const enrichedResults =
                await Promise.all(

                    publishedResults.map(
                        async (result) => {

                            try {

                                const electionId =
                                    result.id ??
                                    result.election_id;

                                if (!electionId) {

                                    return {
                                        ...result,
                                        candidates: 0,
                                        winners: 0,
                                    };

                                }

                                const detailedResult =
                                    await resultService.getElectionResult(
                                        electionId
                                    );

                                const positions =
                                    Array.isArray(
                                        detailedResult?.positions
                                    )
                                        ? detailedResult.positions
                                        : [];

                                const candidateIds =
                                    new Set();

                                let winnerCount = 0;

                                positions.forEach(
                                    (position) => {

                                        const candidates =
                                            Array.isArray(
                                                position.candidates
                                            )
                                                ? position.candidates
                                                : [];

                                        candidates.forEach(
                                            (candidate) => {

                                                if (
                                                    candidate?.id
                                                ) {

                                                    candidateIds.add(
                                                        candidate.id
                                                    );

                                                }

                                            }
                                        );

                                        if (
                                            position?.winner
                                        ) {

                                            winnerCount += 1;

                                        }

                                    }
                                );

                                return {

                                    ...result,

                                    candidates:
                                        candidateIds.size,

                                    winners:
                                        winnerCount,

                                    is_result_published:
                                        detailedResult
                                            ?.is_result_published ??
                                        true,

                                    result_published_at:
                                        detailedResult
                                            ?.result_published_at,

                                    blockchain_verified:
                                        detailedResult
                                            ?.blockchain_verified,

                                };

                            }

                            catch (error) {

                                console.error(
                                    "Failed to load detailed result:",
                                    error
                                );

                                /*
                                 * If the detailed request fails,
                                 * don't break the complete dashboard.
                                 */

                                return {

                                    ...result,

                                    candidates: 0,

                                    winners: 0,

                                };

                            }

                        }
                    )

                );

            setResults(
                enrichedResults
            );

        }

        catch (error) {

            console.error(error);

            toast.error(
                "Failed to load published results."
            );

        }

        finally {

            setLoading(false);

        }

    };

    if (loading) {

        return <Loader />;

    }

    return (

        <div className="p-6">

            {/* Header */}

            <div className="flex flex-col sm:flex-row justify-between gap-4 mb-8">

                <div>

                    <h1 className="text-3xl font-bold">

                        Election Results

                    </h1>

                    <p className="text-gray-500 mt-2">

                        View published results of completed elections.

                    </p>

                </div>

                <Button
                    onClick={() =>
                        navigate("/voter/dashboard")
                    }
                >

                    Back

                </Button>

            </div>

            {/* Empty State */}

            {

                results.length === 0 && (

                    <div className="bg-white rounded-xl shadow-md p-10 text-center">

                        <h2 className="text-xl font-semibold">

                            No Published Results

                        </h2>

                        <p className="text-gray-500 mt-2">

                            There are currently no published election
                            results available.

                        </p>

                    </div>

                )

            }

            {/* Results */}

            {

                results.length > 0 && (

                    <div className="space-y-6">

                        {

                            results.map((result) => (

                                <ResultCard

                                    key={
                                        result.id ??
                                        result.election_id
                                    }

                                    election={{

                                        id:
                                            result.id ??
                                            result.election_id,

                                        title:
                                            result.title ??
                                            result.election,

                                        organization:
                                            result.organization ??
                                            "-",

                                        status:
                                            result.status ??
                                            "COMPLETED",

                                        positions:
                                            Array.isArray(
                                                result.positions
                                            )
                                                ? result.positions.length
                                                : result.positions ?? 0,

                                        votes:
                                            result.votes ?? 0,

                                        candidates:
                                            result.candidates ?? 0,

                                        winners:
                                            result.winners ?? 0,

                                        is_result_published:
                                            result.is_result_published ??
                                            true,

                                        result_published_at:
                                            result.result_published_at,

                                        blockchain_verified:
                                            result.blockchain_verified,

                                    }}

                                    isAdmin={false}

                                />

                            ))

                        }

                    </div>

                )

            }

        </div>

    );

}