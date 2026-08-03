import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import Loader from "../../../components/common/LoadingSpinner";
import Button from "../../../components/common/Button";
import resultService from "../../../services/resultService";

export default function OrganizationResult() {

    const { organizationId } = useParams();

    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);

    const [data, setData] = useState(null);

    useEffect(() => {

        loadResults();

    }, [organizationId]);

    const loadResults = async () => {

        try {

            setLoading(true);

            const response =
                await resultService.getOrganizationResult(
                    organizationId
                );

            console.log(response);

            setData(response);

        }

        catch (error) {

            console.error(error);

            toast.error(
                "Failed to load organization results."
            );

        }

        finally {

            setLoading(false);

        }

    };

    if (loading) {

        return <Loader />;

    }

    if (!data) {

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

                        {data.organization}

                    </h1>

                    <p className="text-gray-500 mt-2">

                        Total Elections :

                        {" "}

                        {data.total_elections}

                    </p>

                </div>

                <Button

                    onClick={() =>
                        navigate("/admin/results")
                    }

                >

                    Back

                </Button>

            </div>

            {

                data.results.length === 0 && (

                    <div className="bg-white rounded-xl shadow p-8 text-center">

                        No Elections Found

                    </div>

                )

            }

            <div className="space-y-6">

                {

                    data.results.map((election) => (

                        <div

                            key={election.election_id}

                            className="bg-white rounded-xl shadow p-6"

                        >

                            <div className="flex justify-between items-center">

                                <div>

                                    <h2 className="text-xl font-bold">

                                        {election.election}

                                    </h2>

                                    <p className="text-gray-500 mt-2">

                                        Status :

                                        {" "}

                                        <span className="font-medium">

                                            {election.status}

                                        </span>

                                    </p>

                                    <p className="mt-2">

                                        Blockchain :

                                        {" "}

                                        {

                                            election.blockchain_verified

                                                ? "Verified ✅"

                                                : "Failed ❌"

                                        }

                                    </p>

                                    <p className="mt-2">

                                        Positions :

                                        {" "}

                                        {election.positions.length}

                                    </p>

                                </div>

                                <Button

                                    onClick={() =>

                                        navigate(

                                            `/admin/results/election/${election.election_id}`

                                        )

                                    }

                                >

                                    View Results

                                </Button>

                            </div>

                        </div>

                    ))

                }

            </div>

        </div>

    );

}