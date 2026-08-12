// admin/results/ResultDashboard.jsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import Loader from "../../../components/common/LoadingSpinner";
import Button from "../../../components/common/Button";
import resultService from "../../../services/resultService";
import ResultStatistics from "../../../components/results/ResultStatistics";


export default function ResultDashboard() {

    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);

    const [dashboard, setDashboard] = useState(null);

    const [search, setSearch] = useState("");

    const [statusFilter, setStatusFilter] = useState("ALL");

    const [sortBy, setSortBy] = useState("NEWEST");


    useEffect(() => {

        loadDashboard();

    }, []);


    const loadDashboard = async () => {

        try {

            setLoading(true);

            const response =
                await resultService.getDashboard();

            console.log(
                "Results Dashboard:",
                response
            );

            setDashboard(response);

        }

        catch (error) {

            console.error(
                "Failed to load results dashboard:",
                error
            );

            toast.error(
                "Failed to load dashboard."
            );

        }

        finally {

            setLoading(false);

        }

    };


    if (loading) {

        return <Loader />;

    }


    if (!dashboard) {

        return (

            <div className="p-6">

                <div className="bg-white rounded-xl shadow p-8 text-center">

                    <h2 className="text-xl font-bold">

                        Unable to Load Results Dashboard

                    </h2>

                    <p className="text-gray-500 mt-2">

                        Please try again.

                    </p>

                    <Button
                        className="mt-5"
                        onClick={loadDashboard}
                    >

                        Retry

                    </Button>

                </div>

            </div>

        );

    }


    const elections =
        Array.isArray(dashboard.elections)
            ? dashboard.elections
            : [];


    const statistics =
        dashboard.statistics || {};


    const filteredResults =
        elections
            .filter((election) => {

                const title =
                    election.title || "";

                const organization =
                    election.organization || "";

                const searchValue =
                    search.toLowerCase().trim();

                const matchesSearch =
                    title
                        .toLowerCase()
                        .includes(searchValue)
                    ||
                    organization
                        .toLowerCase()
                        .includes(searchValue);


                const matchesStatus =
                    statusFilter === "ALL"
                    ||
                    election.status === statusFilter;


                return (
                    matchesSearch &&
                    matchesStatus
                );

            })
            .sort((a, b) => {

                if (sortBy === "A_Z") {

                    return (
                        (a.title || "")
                            .localeCompare(
                                b.title || ""
                            )
                    );

                }


                if (sortBy === "Z_A") {

                    return (
                        (b.title || "")
                            .localeCompare(
                                a.title || ""
                            )
                    );

                }


                /*
                 * The dashboard API currently does not
                 * provide an election creation date.
                 *
                 * Therefore NEWEST keeps the backend
                 * response order.
                 */

                return 0;

            });


    return (

        <div className="p-6">


            {/* ===================================================== */}
            {/* PAGE HEADER                                           */}
            {/* ===================================================== */}

            <div className="flex justify-between items-start mb-8">

                <div>

                    <h1 className="text-3xl font-bold">

                        Results Dashboard

                    </h1>

                    <p className="text-gray-500 mt-2">

                        Election Results & Blockchain Statistics

                    </p>

                </div>


                <Button
                    onClick={() =>
                        navigate("/admin/dashboard")
                    }
                >

                    Back

                </Button>

            </div>



            {/* ===================================================== */}
            {/* RESULT STATISTICS                                     */}
            {/* ===================================================== */}

            <div className="mb-10">

                <h2 className="text-2xl font-bold mb-5">

                    Result Statistics

                </h2>


                <ResultStatistics
                    statistics={statistics}
                />

            </div>



            {/* ===================================================== */}
            {/* GENERAL STATISTICS                                    */}
            {/* ===================================================== */}

            <div className="mb-10">

                <h2 className="text-2xl font-bold mb-5">

                    General Statistics

                </h2>


                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">


                    <StatCard
                        title="Organizations"
                        value={
                            statistics.organizations ?? 0
                        }
                    />


                    <StatCard
                        title="Positions"
                        value={
                            statistics.positions ?? 0
                        }
                    />


                    <StatCard
                        title="Candidates"
                        value={
                            statistics.candidates ?? 0
                        }
                    />


                    <StatCard
                        title="Votes"
                        value={
                            statistics.votes ?? 0
                        }
                    />


                    <StatCard
                        title="Blockchain"
                        value={
                            statistics.blockchain_verified
                                ? "Verified"
                                : "Failed"
                        }
                    />

                </div>

            </div>



            {/* ===================================================== */}
            {/* ELECTIONS SECTION                                     */}
            {/* ===================================================== */}

            <div className="flex justify-between items-center mb-5">

                <h2 className="text-2xl font-bold">

                    Elections

                </h2>

            </div>



            {/* ===================================================== */}
            {/* NO ELECTIONS FROM BACKEND                             */}
            {/* ===================================================== */}

            {
                elections.length === 0 && (

                    <div className="bg-white rounded-xl shadow p-8 text-center mb-8">

                        <h2 className="text-xl font-bold">

                            No Elections Found

                        </h2>

                        <p className="text-gray-500 mt-2">

                            There are currently no elections
                            available in the results dashboard.

                        </p>

                    </div>

                )
            }



            {/* ===================================================== */}
            {/* SEARCH / FILTER / SORT                                */}
            {/* ===================================================== */}

            {
                elections.length > 0 && (

                    <div className="bg-white rounded-xl shadow-md p-5 mb-8">

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">


                            {/* Search */}

                            <input
                                type="text"
                                placeholder="Search election..."
                                value={search}
                                onChange={(e) =>
                                    setSearch(
                                        e.target.value
                                    )
                                }
                                className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />


                            {/* Status Filter */}

                            <select
                                value={statusFilter}
                                onChange={(e) =>
                                    setStatusFilter(
                                        e.target.value
                                    )
                                }
                                className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >

                                <option value="ALL">

                                    All Status

                                </option>

                                <option value="ACTIVE">

                                    Active

                                </option>

                                <option value="COMPLETED">

                                    Completed

                                </option>

                                <option value="UPCOMING">

                                    Upcoming

                                </option>

                            </select>


                            {/* Sort */}

                            <select
                                value={sortBy}
                                onChange={(e) =>
                                    setSortBy(
                                        e.target.value
                                    )
                                }
                                className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >

                                <option value="NEWEST">

                                    Default

                                </option>

                                <option value="A_Z">

                                    A → Z

                                </option>

                                <option value="Z_A">

                                    Z → A

                                </option>

                            </select>


                        </div>

                    </div>

                )
            }



            {/* ===================================================== */}
            {/* NO FILTERED RESULTS                                   */}
            {/* ===================================================== */}

            {
                elections.length > 0 &&
                filteredResults.length === 0 && (

                    <div className="bg-white rounded-xl shadow-md p-12 text-center">

                        <h2 className="text-xl font-bold">

                            No Results Found

                        </h2>

                        <p className="text-gray-500 mt-2">

                            Try changing the search or filters.

                        </p>

                    </div>

                )
            }



            {/* ===================================================== */}
            {/* ELECTION CARDS                                        */}
            {/* ===================================================== */}

            {
                filteredResults.length > 0 && (

                    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

                        {
                            filteredResults.map(
                                (election) => (

                                    <div
                                        key={election.id}
                                        className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition-shadow"
                                    >


                                        {/* Election Title */}

                                        <h3 className="text-xl font-bold">

                                            {election.title}

                                        </h3>


                                        {/* Organization */}

                                        <p className="text-gray-500 mt-2">

                                            Organization:

                                            {" "}

                                            {election.organization}

                                        </p>


                                        {/* Status */}

                                        <p className="text-gray-500">

                                            Status:

                                            {" "}

                                            <span className="font-medium">

                                                {election.status}

                                            </span>

                                        </p>


                                        {/* Positions */}

                                        <p className="text-gray-500">

                                            Positions:

                                            {" "}

                                            {election.positions ?? 0}

                                        </p>


                                        {/* Votes */}

                                        <p className="text-gray-500 mb-5">

                                            Votes:

                                            {" "}

                                            {election.votes ?? 0}

                                        </p>


                                        {/* View Results */}

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

                                )
                            )
                        }

                    </div>

                )
            }


        </div>

    );

}



/* ========================================================= */
/* STAT CARD                                                  */
/* ========================================================= */

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