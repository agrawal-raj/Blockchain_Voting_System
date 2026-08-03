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

    useEffect(() => {

        loadCandidates();

    }, [positionId]);

    const loadCandidates = async () => {

        try {

            setLoading(true);

            const data = await votingService.getCandidates(positionId);

            setCandidates(data);

        } catch (error) {

            toast.error("Failed to load candidates.");

        } finally {

            setLoading(false);

        }

    };

    const submitVote = async () => {

        if (!selectedCandidate) {

            toast.warning("Please select a candidate.");

            return;

        }

        try {

            setSubmitting(true);

            const response = await votingService.castVote(
                selectedCandidate.id
            );

            toast.success("Vote submitted successfully.");

            navigate(
                "/voter/vote-success",
                {
                    state: {
                    vote: response,
                    candidate : selectedCandidate,
                }
            }
            );

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Voting failed."
            );

        } finally {

            setSubmitting(false);

            setConfirmOpen(false);

        }

    };

    if (loading) {

        return <Loader />;

    }

    return (

        <div className="max-w-7xl mx-auto p-6">

            <h1 className="text-3xl font-bold mb-8">

                Select Your Candidate

            </h1>

            {

                candidates.length === 0 ? (

                    <div className="text-center text-gray-500">

                        No active candidates found.

                    </div>

                ) : (

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

                        {

                            candidates.map((candidate) => (

                                <CandidateCard

                                    key={candidate.id}

                                    candidate={candidate}

                                    selected={

                                        selectedCandidate?.id === candidate.id

                                    }

                                    onSelect={setSelectedCandidate}

                                />

                            ))

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

                    onClick={() => setConfirmOpen(true)}

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

                message={`Are you sure you want to vote for "${selectedCandidate?.full_name}"?\n\nOnce submitted, your vote cannot be changed.`}

                confirmText="Cast Vote"

                confirmVariant="primary"

                onConfirm={submitVote}

                onCancel={() => setConfirmOpen(false)}

            />

        </div>

    );

}