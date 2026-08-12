import { useNavigate } from "react-router-dom";

import DashboardLayout from "../../components/layout/DashboardLayout";
import PageHeader from "../../components/layout/PageHeader";
import Button from "../../components/common/Button";


export default function Dashboard() {

    const navigate = useNavigate();


    return (

        <DashboardLayout>

            <PageHeader
                title="Voter Dashboard"
                subtitle="Welcome to the Blockchain Voting System"
            />


            {/* ================================================= */}
            {/* DASHBOARD CARDS                                  */}
            {/* ================================================= */}

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">


                {/* ================================================= */}
                {/* AVAILABLE ELECTIONS                              */}
                {/* ================================================= */}

                <div className="bg-white rounded-xl shadow p-6">

                    <div className="flex items-center justify-between mb-4">

                        <h2 className="text-xl font-semibold">

                            Available Elections

                        </h2>

                        <span className="text-2xl">

                            🗳️

                        </span>

                    </div>


                    <p className="text-gray-500 mb-5">

                        View elections that are currently available
                        for voting.

                    </p>


                    <Button
                        className="w-full"
                        onClick={() =>
                            navigate(
                                "/voter/elections"
                            )
                        }
                    >

                        View Elections

                    </Button>

                </div>



                {/* ================================================= */}
                {/* MY VOTES                                         */}
                {/* ================================================= */}

                <div className="bg-white rounded-xl shadow p-6">

                    <div className="flex items-center justify-between mb-4">

                        <h2 className="text-xl font-semibold">

                            My Votes

                        </h2>

                        <span className="text-2xl">

                            ✅

                        </span>

                    </div>


                    <p className="text-gray-500 mb-5">

                        View the votes you have already submitted.

                    </p>


                    <Button
                        className="w-full"
                        onClick={() =>
                            navigate(
                                "/voter/vote-history"
                            )
                        }
                    >

                        View Vote History

                    </Button>

                </div>



                {/* ================================================= */}
                {/* RESULTS                                          */}
                {/* ================================================= */}

                <div className="bg-white rounded-xl shadow p-6">

                    <div className="flex items-center justify-between mb-4">

                        <h2 className="text-xl font-semibold">

                            Results

                        </h2>

                        <span className="text-2xl">

                            📊

                        </span>

                    </div>


                    <p className="text-gray-500 mb-5">

                        View election results published by the
                        administrator.

                    </p>


                    <Button
                        className="w-full"
                        onClick={() =>
                            navigate(
                                "/voter/results"
                            )
                        }
                    >

                        View Results

                    </Button>

                </div>



                {/* ================================================= */}
                {/* VOTE HISTORY                                     */}
                {/* ================================================= */}

                <div className="bg-white rounded-xl shadow p-6 border border-blue-100">

                    <div className="flex items-center justify-between mb-4">

                        <h2 className="text-xl font-semibold">

                            Vote History

                        </h2>

                        <span className="text-2xl">

                            📜

                        </span>

                    </div>


                    <p className="text-gray-500 mb-5">

                        Review your previously submitted votes
                        and their recorded details.

                    </p>


                    <Button
                        className="w-full"
                        onClick={() =>
                            navigate(
                                "/voter/vote-history"
                            )
                        }
                    >

                        View Vote History

                    </Button>

                </div>


            </div>


        </DashboardLayout>

    );

}