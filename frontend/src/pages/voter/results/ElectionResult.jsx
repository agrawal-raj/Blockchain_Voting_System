import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import Loader from "../../../components/common/LoadingSpinner";
import Button from "../../../components/common/Button";

import resultService from "../../../services/resultService";
import PositionResultCard from "../../../components/results/PositionResultCard";


export default function ElectionResult() {

    const { electionId } = useParams();

    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);

    const [result, setResult] = useState(null);

    const [accessDenied, setAccessDenied] = useState(false);


    useEffect(() => {

        loadResult();

    }, [electionId]);


    const loadResult = async () => {

        try {

            setLoading(true);

            setAccessDenied(false);

            const response =
                await resultService.getElectionResult(
                    electionId
                );

            console.log(
                "Voter Election Result:",
                response
            );

            setResult(response);

        }

        catch (error) {

            console.error(
                "Failed to load voter election result:",
                error
            );


            /*
             * The backend returns 403 when a voter tries
             * to access an election whose results have
             * not been published yet.
             *
             * We handle that case separately so the voter
             * gets a clear explanation instead of seeing
             * a generic "Failed to load" message.
             */

            const status =
                error?.response?.status;


            if (status === 403) {

                setAccessDenied(true);

                setResult(null);

                return;

            }


            /*
             * Some API implementations may return the
             * permission information inside the response
             * body instead of exposing the status directly.
             */

            const errorMessage =
                error?.response?.data?.detail ||
                error?.response?.data?.message ||
                "";


            if (
                typeof errorMessage === "string" &&
                errorMessage
                    .toLowerCase()
                    .includes("not been published")
            ) {

                setAccessDenied(true);

                setResult(null);

                return;

            }


            toast.error(
                "Failed to load election results."
            );

            setResult(null);

        }

        finally {

            setLoading(false);

        }

    };


    /*
     * Loading state
     */

    if (loading) {

        return <Loader />;

    }


    /*
     * Results have not been published.
     *
     * This can happen when the voter manually opens
     * an election-result URL instead of coming through
     * the published-results dashboard.
     */

    if (accessDenied) {

        return (

            <div className="max-w-3xl mx-auto p-6">

                <div className="bg-white rounded-xl shadow-md p-10 text-center">


                    <div className="text-5xl mb-5">

                        🔒

                    </div>


                    <h1 className="text-2xl font-bold text-gray-800">

                        Results Not Published

                    </h1>


                    <p className="text-gray-500 mt-3">

                        The administrator has not published
                        the results for this election yet.

                    </p>


                    <p className="text-gray-500 mt-2">

                        Please check again after the results
                        have been officially published.

                    </p>


                    <div className="mt-6">

                        <Button
                            onClick={() =>
                                navigate(
                                    "/voter/results"
                                )
                            }
                        >

                            Back to Results

                        </Button>

                    </div>

                </div>

            </div>

        );

    }


    /*
     * No result returned.
     */

    if (!result) {

        return (

            <div className="max-w-3xl mx-auto p-6">

                <div className="bg-white rounded-xl shadow p-8 text-center">

                    <h2 className="text-xl font-semibold">

                        No Result Found

                    </h2>


                    <p className="text-gray-500 mt-2">

                        The requested election result
                        could not be found.

                    </p>


                    <div className="mt-5">

                        <Button
                            onClick={() =>
                                navigate(
                                    "/voter/results"
                                )
                            }
                        >

                            Back to Results

                        </Button>

                    </div>

                </div>

            </div>

        );

    }


    /*
     * Make sure positions is always an array.
     */

    const positions =
        Array.isArray(result.positions)
            ? result.positions
            : [];


    /*
     * Calculate total votes across all positions.
     */

    const totalVotes =
        positions.reduce(
            (total, position) =>
                total +
                (
                    Number(
                        position.total_votes
                    ) || 0
                ),
            0
        );


    /*
     * Count unique candidates across all positions.
     */

    const totalCandidates =
        new Set(

            positions.flatMap(

                (position) =>

                    Array.isArray(
                        position.candidates
                    )

                        ? position.candidates
                            .map(
                                (candidate) =>
                                    candidate.id
                            )
                            .filter(Boolean)

                        : []

            )

        ).size;


    /*
     * Count winners.
     *
     * Each position can have one winner.
     */

    const totalWinners =
        positions.filter(
            (position) =>
                Boolean(position.winner)
        ).length;


    return (

        <div className="max-w-7xl mx-auto p-6">


            {/* ================================================= */}
            {/* HEADER                                            */}
            {/* ================================================= */}

            <div className="flex flex-col lg:flex-row justify-between gap-6 mb-8">

                <div>

                    <h1 className="text-3xl font-bold">

                        {result.election}

                    </h1>


                    <p className="text-gray-500 mt-2">

                        Organization:

                        {" "}

                        {result.organization ?? "-"}

                    </p>


                    <p className="text-gray-500">

                        Status:

                        {" "}

                        {result.status}

                    </p>


                    <p className="mt-2 font-medium">

                        Blockchain:

                        {" "}

                        {

                            result.blockchain_verified

                                ? "Verified ✅"

                                : "Verification Failed ❌"

                        }

                    </p>

                </div>


                <div>

                    <Button
                        onClick={() =>
                            navigate(-1)
                        }
                    >

                        Back

                    </Button>

                </div>

            </div>



            {/* ================================================= */}
            {/* STATISTICS                                        */}
            {/* ================================================= */}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">


                {/* Positions */}

                <div className="bg-white rounded-xl shadow-md p-6 text-center">

                    <p className="text-sm text-gray-500">

                        Positions

                    </p>


                    <p className="text-3xl font-bold text-indigo-600 mt-2">

                        {positions.length}

                    </p>

                </div>



                {/* Votes */}

                <div className="bg-white rounded-xl shadow-md p-6 text-center">

                    <p className="text-sm text-gray-500">

                        Votes

                    </p>


                    <p className="text-3xl font-bold text-indigo-600 mt-2">

                        {totalVotes}

                    </p>

                </div>



                {/* Candidates */}

                <div className="bg-white rounded-xl shadow-md p-6 text-center">

                    <p className="text-sm text-gray-500">

                        Candidates

                    </p>


                    <p className="text-3xl font-bold text-indigo-600 mt-2">

                        {totalCandidates}

                    </p>

                </div>



                {/* Winners */}

                <div className="bg-white rounded-xl shadow-md p-6 text-center">

                    <p className="text-sm text-gray-500">

                        Winners

                    </p>


                    <p className="text-3xl font-bold text-green-600 mt-2">

                        {totalWinners}

                    </p>

                </div>

            </div>



            {/* ================================================= */}
            {/* NO POSITIONS                                      */}
            {/* ================================================= */}

            {
                positions.length === 0 && (

                    <div className="bg-white rounded-xl shadow p-8 text-center">

                        <h2 className="text-xl font-semibold">

                            No Positions Found

                        </h2>


                        <p className="text-gray-500 mt-2">

                            No position results are available.

                        </p>

                    </div>

                )
            }



            {/* ================================================= */}
            {/* POSITION RESULTS                                  */}
            {/* ================================================= */}

            {
                positions.length > 0 && (

                    <div className="space-y-6">

                        {

                            positions.map(
                                (position) => (

                                    <PositionResultCard
                                        key={
                                            position.position_id
                                        }
                                        position={position}
                                        isAdmin={false}
                                    />

                                )
                            )

                        }

                    </div>

                )
            }


        </div>

    );

}