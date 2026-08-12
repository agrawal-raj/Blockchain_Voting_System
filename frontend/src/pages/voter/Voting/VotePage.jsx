import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import votingService from "../../../services/votingService";

import CandidateCard from "../../../components/voter/CandidateCard";
import ConfirmModal from "../../../components/common/ConfirmModal";
import Button from "../../../components/common/Button";
import Loader from "../../../components/common/LoadingSpinner";


export default function VotePage() {

    const { positionId } = useParams();

    const navigate = useNavigate();


    const [candidates, setCandidates] = useState([]);

    const [loading, setLoading] = useState(true);

    const [selectedCandidate, setSelectedCandidate] = useState(null);

    const [confirmOpen, setConfirmOpen] = useState(false);

    const [submitting, setSubmitting] = useState(false);

    const [voteError, setVoteError] = useState("");


    useEffect(() => {

        loadCandidates();

    }, [positionId]);


    const loadCandidates = async () => {

        try {

            setLoading(true);

            setVoteError("");

            const data =
                await votingService.getCandidates(
                    positionId
                );

            setCandidates(
                Array.isArray(data)
                    ? data
                    : []
            );

        }

        catch (error) {

            console.error(
                "Failed to load candidates:",
                error
            );

            toast.error(
                "Failed to load candidates."
            );

        }

        finally {

            setLoading(false);

        }

    };


    const submitVote = async () => {

        if (!selectedCandidate) {

            toast.warning(
                "Please select a candidate."
            );

            return;

        }


        try {

            setSubmitting(true);

            setVoteError("");


            const response =
                await votingService.castVote(
                    selectedCandidate.id
                );


            toast.success(
                "Vote submitted successfully."
            );


            navigate(
                "/voter/vote-success",
                {
                    state: {
                        vote: response,
                        candidate: selectedCandidate,
                    },
                }
            );

        }

        catch (error) {

            console.error(
                "Voting failed:",
                error
            );


            /*
             * The backend returns:
             *
             * {
             *     "success": false,
             *     "message": "..."
             * }
             *
             * when voting fails.
             */

            const backendMessage =
                error?.response?.data?.message;


            const message =
                typeof backendMessage === "string" &&
                backendMessage.trim()
                    ? backendMessage
                    : "Voting failed.";


            /*
             * Handle duplicate voting separately.
             *
             * The current backend prevents a voter from
             * voting more than once for the same position.
             */

            const isAlreadyVoted =
                message
                    .toLowerCase()
                    .includes("already voted");


            if (isAlreadyVoted) {

                const duplicateMessage =
                    "You have already voted for this position.";


                setVoteError(
                    duplicateMessage
                );


                toast.warning(
                    duplicateMessage
                );

            }

            else {

                setVoteError(message);

                toast.error(message);

            }


            /*
             * Close the confirmation modal after
             * the backend rejects the vote.
             */

            setConfirmOpen(false);

        }

        finally {

            setSubmitting(false);

        }

    };


    if (loading) {

        return <Loader />;

    }


    return (

        <div className="max-w-7xl mx-auto p-6">


            <div className="flex justify-between items-center mb-8">

                <div>

                    <h1 className="text-3xl font-bold">

                        Select Your Candidate

                    </h1>


                    <p className="text-gray-500 mt-2">

                        Select one candidate and cast your vote.

                    </p>

                </div>


                <Button
                    variant="secondary"
                    onClick={() =>
                        navigate(-1)
                    }
                >

                    Back

                </Button>

            </div>


            {
                voteError && (

                    <div
                        className="
                            mb-6
                            rounded-lg
                            border
                            border-red-200
                            bg-red-50
                            px-5
                            py-4
                            text-red-700
                        "
                    >

                        <div className="flex items-start gap-3">

                            <span className="text-xl">

                                ⚠️

                            </span>


                            <div>

                                <p className="font-semibold">

                                    Voting Unavailable

                                </p>


                                <p className="mt-1">

                                    {voteError}

                                </p>

                            </div>

                        </div>

                    </div>

                )
            }


            {
                candidates.length === 0 ? (

                    <div className="bg-white rounded-xl shadow p-8 text-center">

                        <h2 className="text-xl font-semibold">

                            No Active Candidates Found

                        </h2>


                        <p className="text-gray-500 mt-2">

                            There are currently no active
                            candidates available for this position.

                        </p>

                    </div>

                ) : (

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

                        {

                            candidates.map(
                                (candidate) => (

                                    <CandidateCard

                                        key={candidate.id}

                                        candidate={candidate}

                                        selected={
                                            selectedCandidate?.id ===
                                            candidate.id
                                        }

                                        onSelect={(
                                            candidate
                                        ) => {

                                            setSelectedCandidate(
                                                candidate
                                            );

                                            setVoteError("");

                                        }}

                                    />

                                )
                            )

                        }

                    </div>

                )
            }


            <div className="mt-8 flex justify-end">

                <Button

                    disabled={
                        !selectedCandidate ||
                        submitting
                    }

                    onClick={() =>
                        setConfirmOpen(true)
                    }

                >

                    {
                        submitting
                            ? "Submitting..."
                            : "Cast Vote"
                    }

                </Button>

            </div>


            <ConfirmModal

                open={confirmOpen}

                title="Confirm Vote"

                message={

                    selectedCandidate

                        ? `Are you sure you want to vote for "${selectedCandidate.full_name}"?\n\nOnce submitted, your vote cannot be changed.`

                        : "Please select a candidate before confirming your vote."

                }

                confirmText="Cast Vote"

                confirmVariant="primary"

                onConfirm={submitVote}

                onCancel={() =>
                    setConfirmOpen(false)
                }

            />

        </div>

    );

}