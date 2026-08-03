import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import Loader from "../../../components/common/LoadingSpinner";
import Button from "../../../components/common/Button";
import resultService from "../../../services/resultService";

export default function ResultDashboard() {

    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);

    const [dashboard, setDashboard] = useState(null);

    useEffect(() => {

        loadDashboard();

    }, []);

    const loadDashboard = async () => {

        try {

            setLoading(true);

            const response = await resultService.getDashboard();

            console.log("Dashboard:", response);

            setDashboard(response);

        }

        catch (error) {

            console.error(error);

            toast.error("Failed to load dashboard.");

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

            <div className="mb-8">

                <h1 className="text-3xl font-bold">

                    Results Dashboard

                </h1>

                <p className="text-gray-500 mt-2">

                    Election Results & Blockchain Statistics

                </p>

            </div>

            {/* Statistics */}

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-5 mb-10">

                <StatCard
                    title="Organizations"
                    value={dashboard.statistics.organizations}
                />

                <StatCard
                    title="Elections"
                    value={dashboard.statistics.elections}
                />

                <StatCard
                    title="Candidates"
                    value={dashboard.statistics.candidates}
                />

                <StatCard
                    title="Votes"
                    value={dashboard.statistics.votes}
                />

                <StatCard
                    title="Blockchain"
                    value={
                        dashboard.statistics.blockchain_verified
                            ? "Verified"
                            : "Failed"
                    }
                />

            </div>

            <h2 className="text-2xl font-bold mb-5">

                Elections

            </h2>

            {

                dashboard.elections.length === 0 && (

                    <div className="bg-white rounded-xl shadow p-8 text-center">

                        No Elections Found

                    </div>

                )

            }

            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

                {

                    dashboard.elections.map((election) => (

                        <div

                            key={election.id}

                            className="bg-white rounded-xl shadow p-6"

                        >

                            <h3 className="text-xl font-bold">

                                {election.title}

                            </h3>

                            <p className="text-gray-500 mt-2">

                                Organization:

                                {" "}

                                {election.organization}

                            </p>

                            <p className="text-gray-500">

                                Status:

                                {" "}

                                {election.status}

                            </p>

                            <p className="text-gray-500">

                                Positions:

                                {" "}

                                {election.positions}

                            </p>

                            <p className="text-gray-500 mb-5">

                                Votes:

                                {" "}

                                {election.votes}

                            </p>

                            <Button

                                className="w-full"

                                onClick={() =>

                                    navigate(

                                        `/admin/results/election/${election.id}`

                                    )

                                }

                            >

                                View Results

                            </Button>

                        </div>

                    ))

                }

            </div>

        </div>

    );

}

function StatCard({

    title,

    value,

}) {

    return (

        <div className="bg-white rounded-xl shadow p-5">

            <p className="text-gray-500">

                {title}

            </p>

            <h2 className="text-3xl font-bold mt-3">

                {value}

            </h2>

        </div>

    );

}