import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import Loader from "../../../components/common/LoadingSpinner";
import Button from "../../../components/common/Button";
import resultService from "../../../services/resultService";
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

            <div className="flex justify-between items-center mb-8">

                <div>

                    <h1 className="text-3xl font-bold">

                        {result.election}

                    </h1>

                    <p className="text-gray-500 mt-2">

                        Organization :

                        {" "}

                        {result.organization}

                    </p>

                    <p className="text-gray-500">

                        Status :

                        {" "}

                        {result.status}

                    </p>

                    <p className="mt-2">

                        Blockchain :

                        {" "}

                        {

                            result.blockchain_verified

                                ? "Verified ✅"

                                : "Failed ❌"

                        }

                    </p>

                </div>
                <div className="flex gap-3">
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

                        onClick={() =>
                            navigate(-1)
                        }

                    >

                        Back

                    </Button>
                </div>

            </div>

            {

                result.positions.length === 0 && (

                    <div className="bg-white rounded-xl shadow p-8 text-center">

                        No Positions Found

                    </div>

                )

            }

            <div className="space-y-6">

                {

                    result.positions.map((position, index) => (

                        <div

                            key={index}

                            className="bg-white rounded-xl shadow p-6"

                        >

                            <div className="flex justify-between items-center">

                                <div>

                                    <h2 className="text-xl font-bold">

                                        {position.position}

                                    </h2>

                                    <p className="mt-2">

                                        Total Votes :

                                        {" "}

                                        {position.total_votes}

                                    </p>

                                    <p className="mt-2 text-green-600 font-semibold">

                                        Winner :

                                        {" "}

                                        {

                                            position.winner

                                                ? position.winner.candidate

                                                : "No Winner"

                                        }

                                    </p>

                                </div>
                                {
                                    result.is_result_published && (

                                        <div className="rounded-lg bg-green-100 text-green-700 px-4 py-2 text-sm font-medium">

                                            ✅ Results Published

                                            <div className="text-xs mt-1">

                                                {
                                                    result.result_published_at &&
                                                    new Date(
                                                        result.result_published_at
                                                    ).toLocaleString()
                                                }

                                            </div>

                                        </div>

                                    )
                                }
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

                        </div>

                    ))

                }

            </div>

        </div>

    );

}