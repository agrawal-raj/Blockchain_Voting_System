import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import BarChart from "../../../components/charts/BarChart";
import PieChart from "../../../components/charts/PieChart";
import Loader from "../../../components/common/LoadingSpinner";
import Button from "../../../components/common/Button";
import resultService from "../../../services/resultService";
import { exportPositionResultPDF } from "../../../utils/pdfExport";
import { exportPositionResultExcel } from "../../../utils/excelExport";

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
                await resultService.getPositionResult(positionId);

            console.log("Position Result:", response);

            setResult(response);

        }

        catch (error) {

            console.error(error);

            toast.error("Failed to load position result.");

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

    return (

        <div className="p-6">

            <div className="flex justify-between items-center mb-8">

                <div>


                    <h1 className="text-3xl font-bold">

                        {result.position}

                    </h1>

                    <p className="text-gray-500 mt-2">

                        Total Votes : {result.total_votes}

                    </p>

                </div>
                <div className="flex gap-3">
                    <Button
                        variant="success"
                        onClick={() =>
                            exportPositionResultExcel(result)
                        }
                    >
                        Export Excel
                    </Button>
                    <button
                        onClick={() => exportPositionResultPDF(result)}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                    >
                        Export PDF
                    </button>

                    <Button
                        onClick={() => navigate(-1)}
                    >
                        Back
                    </Button>

                </div>
            </div>


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

                                Votes : {result.winner.votes}

                            </p>

                            <p className="text-lg">

                                Percentage : {result.winner.percentage}%

                            </p>

                        </div>

                    </div>

                )
            }

            <div className="bg-white rounded-xl shadow">

                <div className="p-5 border-b">

                    <h2 className="text-xl font-bold">

                        Candidate Rankings

                    </h2>

                </div>

                <div className="p-6 space-y-6">

                    {
                        result.candidates.map((candidate, index) => (

                            <div
                                key={candidate.id}
                            >

                                <div className="flex justify-between mb-2">

                                    <div>

                                        <span className="font-bold">

                                            {index + 1}.

                                        </span>

                                        {" "}

                                        {candidate.candidate}

                                    </div>

                                    <div>

                                        {candidate.votes} Votes

                                    </div>

                                </div>

                                <div className="w-full bg-gray-200 rounded-full h-4">

                                    <div

                                        className="bg-blue-600 h-4 rounded-full"

                                        style={{
                                            width: `${candidate.percentage}%`
                                        }}

                                    />

                                </div>

                                <div className="text-right mt-2 text-sm text-gray-600">

                                    {candidate.percentage}%

                                </div>

                            </div>

                        ))
                    }

                </div>

            </div>
            <div className="grid lg:grid-cols-2 gap-8 mt-8">

                <div className="bg-white rounded-xl shadow p-6">

                    <BarChart

                        title="Vote Distribution"

                        labels={

                            result.candidates.map(

                                (c) => c.candidate

                            )

                        }

                        values={

                            result.candidates.map(

                                (c) => c.votes

                            )

                        }

                    />

                </div>

                <div className="bg-white rounded-xl shadow p-6">

                    <PieChart

                        labels={

                            result.candidates.map(

                                (c) => c.candidate

                            )

                        }

                        values={

                            result.candidates.map(

                                (c) => c.votes

                            )

                        }

                    />

                </div>

            </div>
            <div className="bg-white rounded-xl shadow mt-8">

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

                                result.candidates.map((candidate, index) => (

                                    <tr
                                        key={candidate.id}
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

                                            {candidate.candidate}

                                        </td>

                                        <td className="p-4">

                                            {candidate.votes}

                                        </td>

                                        <td className="p-4">

                                            {candidate.percentage}%

                                        </td>

                                    </tr>

                                ))

                            }

                        </tbody>

                    </table>

                </div>

            </div>

        </div>

    );

}