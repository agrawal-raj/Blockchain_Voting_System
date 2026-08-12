import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import Loader from "../../../components/common/LoadingSpinner";
import Button from "../../../components/common/Button";

import resultService from "../../../services/resultService";

import ElectionSummary from "../../../components/results/ElectionSummary";
import PositionResultCard from "../../../components/results/PositionResultCard";

import { exportElectionResultPDF } from "../../../utils/pdfExport";
import { exportElectionResultExcel } from "../../../utils/excelExport";


export default function ElectionResult() {

    const { electionId } = useParams();

    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);

    const [result, setResult] = useState(null);
    const [publishing, setPublishing] = useState(false);

    useEffect(() => {

        loadResult();

    }, [electionId]);

    const loadResult = async () => {

        try {

            setLoading(true);

            const response =
                await resultService.getElectionResult(
                    electionId
                );

            console.log("Election Result:", response);

            setResult(response);

        }

        catch (error) {

            console.error(error);

            toast.error(
                "Failed to load election results."
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

    const handlePublishResults = async () => {

        const confirmed = window.confirm(
            `Publish Election Results?\n\n` +
            `This action cannot be undone.\n\n` +
            `After publishing:\n` +
            `• Results become visible to voters.\n` +
            `• Election becomes read-only.\n` +
            `• Positions become read-only.\n` +
            `• Candidates become read-only.`
        );

        if (!confirmed) return;

        try {

            setPublishing(true);

            await resultService.publishResults(
                result.election_id
            );

            toast.success(
                "Results published successfully."
            );

            await loadResult();

        } catch (error) {

            console.error(error);

            toast.error(
                "Failed to publish results."
            );

        } finally {

            setPublishing(false);

        }

    };

    return (

        <div className="p-6">

            <div className="max-w-7xl mx-auto space-y-8">

                <div className="flex flex-col lg:flex-row justify-between gap-5">

                    <ElectionSummary

                        organization={result.organization}

                        election={result.election}

                        status={result.status}

                        publishedAt={result.result_published_at}

                        blockchainVerified={result.blockchain_verified}

                        totalPositions={result.positions.length}

                        totalVotes={
                            result.positions.reduce(

                                (total, position) =>

                                    total + position.total_votes,

                                0

                            )
                        }

                    />

                    <div className="flex flex-wrap gap-3 h-fit">

                        {

                            result.status === "COMPLETED" &&
                            !result.is_result_published && (

                                <Button
                                    onClick={handlePublishResults}
                                    disabled={publishing}
                                >

                                    {

                                        publishing

                                            ? "Publishing..."

                                            : "Publish Results"

                                    }

                                </Button>

                            )

                        }

                        <Button

                            variant="success"

                            onClick={() =>
                                exportElectionResultExcel(result)
                            }

                        >

                            Export Excel

                        </Button>

                        <Button

                            onClick={() =>
                                exportElectionResultPDF(result)
                            }

                        >

                            Export PDF

                        </Button>

                        <Button
                            onClick={() => navigate(-1)}
                        >

                            Back

                        </Button>

                    </div>

                </div>

                {

                    result.positions.length === 0 && (

                        <div className="bg-white rounded-xl shadow-lg p-12 text-center">

                            <h2 className="text-xl font-semibold">

                                No Positions Found

                            </h2>

                            <p className="text-gray-500 mt-2">

                                There are no positions available for this election.

                            </p>

                        </div>

                    )

                }

                <div className="space-y-8">

                    {

                        result.positions.map((position) => (

                            <PositionResultCard

                                key={position.position_id}

                                position={position}

                                footer={

                                    <div className="flex justify-end">

                                        <Button

                                            onClick={() =>

                                                navigate(

                                                    `/admin/results/position/${position.position_id}`

                                                )

                                            }

                                        >

                                            View Details

                                        </Button>

                                    </div>

                                }

                            />

                        ))

                    }

                </div>

            </div>
        </div>

    );

}