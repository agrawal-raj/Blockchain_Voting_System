import {
    useEffect,
    useState,
} from "react";

import {
    useNavigate,
    useParams,
} from "react-router-dom";

import votingService from "../../../services/votingService";

import Loader from "../../../components/common/LoadingSpinner";

import Button from "../../../components/common/Button";

import PositionCard from "../../../components/voter/PositionCard";


export default function ElectionDetails() {

    const { id } = useParams();

    const navigate = useNavigate();


    const [
        positions,
        setPositions,
    ] = useState([]);


    const [
        election,
        setElection,
    ] = useState(null);


    const [
        loading,
        setLoading,
    ] = useState(true);


    const [
        error,
        setError,
    ] = useState("");


    useEffect(() => {

        loadElection();

    }, [id]);


    const loadElection = async () => {

        try {

            setLoading(true);

            setError("");


            /*
             * The current election-detail endpoint returns
             * positions only.
             *
             * The available-elections endpoint already
             * provides:
             *
             * - status
             * - start_date
             * - end_date
             *
             * Therefore we load both pieces of information.
             */

            const [
                electionData,
                positionData,
            ] = await Promise.all([

                votingService.getAvailableElections(),

                votingService.getElectionDetails(id),

            ]);


            const availableElections =
                Array.isArray(electionData)
                    ? electionData
                    : [];


            const currentElection =
                availableElections.find(
                    (item) =>
                        String(item.id) ===
                        String(id)
                );


            setElection(
                currentElection || null
            );


            setPositions(
                Array.isArray(positionData)
                    ? positionData
                    : []
            );

        }

        catch (error) {

            console.error(
                "Failed to load election details:",
                error
            );


            setError(
                "Failed to load election details."
            );

        }

        finally {

            setLoading(false);

        }

    };


    if (loading) {

        return <Loader />;

    }


    if (error) {

        return (

            <div className="max-w-5xl mx-auto p-6">

                <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-5">

                    {error}

                </div>


                <div className="mt-5">

                    <Button
                        onClick={() =>
                            navigate(-1)
                        }
                    >

                        Back

                    </Button>

                </div>

            </div>

        );

    }


    /*
     * Calculate whether voting is currently allowed.
     */

    const now = new Date();


    const startDate =
        election?.start_date
            ? new Date(
                election.start_date
            )
            : null;


    const endDate =
        election?.end_date
            ? new Date(
                election.end_date
            )
            : null;


    const isActive =
        election?.status === "ACTIVE";


    const hasStarted =
        !startDate ||
        now >= startDate;


    const hasEnded =
        endDate &&
        now >= endDate;


    const canVote =
        isActive &&
        hasStarted &&
        !hasEnded;


    let availabilityMessage =
        "Voting is currently unavailable.";


    let availabilityClass =
        "bg-gray-100 text-gray-700";


    if (
        isActive &&
        startDate &&
        now < startDate
    ) {

        availabilityMessage =
            `Voting has not started yet. Voting starts on ${startDate.toLocaleString()}.`;

        availabilityClass =
            "bg-yellow-100 text-yellow-700";

    }

    else if (
        isActive &&
        hasEnded
    ) {

        availabilityMessage =
            "The voting period has ended.";

        availabilityClass =
            "bg-gray-100 text-gray-700";

    }

    else if (canVote) {

        availabilityMessage =
            "Voting is currently active.";

        availabilityClass =
            "bg-green-100 text-green-700";

    }

    else if (
        election?.status === "COMPLETED"
    ) {

        availabilityMessage =
            "This election has been completed.";

        availabilityClass =
            "bg-gray-100 text-gray-700";

    }

    else if (
        election?.status === "CANCELLED"
    ) {

        availabilityMessage =
            "This election has been cancelled.";

        availabilityClass =
            "bg-red-100 text-red-700";

    }


    return (

        <div className="max-w-7xl mx-auto p-6">


            {/* ================================================= */}
            {/* HEADER                                            */}
            {/* ================================================= */}

            <div className="flex flex-col lg:flex-row justify-between gap-5 mb-8">


                <div>

                    <h1 className="text-3xl font-bold">

                        {
                            election?.title ||
                            "Election Details"
                        }

                    </h1>


                    {
                        election?.organization && (

                            <p className="text-gray-500 mt-2">

                                Organization:

                                <span className="ml-1">

                                    {
                                        election.organization
                                    }

                                </span>

                            </p>

                        )
                    }


                    {
                        election?.status && (

                            <p className="text-gray-500 mt-1">

                                Status:

                                <span className="ml-1 font-semibold">

                                    {
                                        election.status
                                    }

                                </span>

                            </p>

                        )
                    }


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
            {/* VOTING AVAILABILITY                                */}
            {/* ================================================= */}

            <div
                className={`
                    rounded-xl
                    px-5
                    py-4
                    mb-8
                    ${availabilityClass}
                `}
            >

                <p className="font-medium">

                    {availabilityMessage}

                </p>


                {
                    election?.start_date && (

                        <p className="text-sm mt-2">

                            Start:

                            <span className="ml-1">

                                {
                                    new Date(
                                        election.start_date
                                    ).toLocaleString()
                                }

                            </span>

                        </p>

                    )
                }


                {
                    election?.end_date && (

                        <p className="text-sm mt-1">

                            End:

                            <span className="ml-1">

                                {
                                    new Date(
                                        election.end_date
                                    ).toLocaleString()
                                }

                            </span>

                        </p>

                    )
                }

            </div>



            {/* ================================================= */}
            {/* POSITIONS                                         */}
            {/* ================================================= */}

            <h2 className="text-2xl font-bold mb-5">

                Positions

            </h2>


            {
                positions.length === 0 ? (

                    <div className="bg-white rounded-xl shadow p-8 text-center">

                        <h3 className="text-xl font-semibold">

                            No Positions Found

                        </h3>


                        <p className="text-gray-500 mt-2">

                            There are no positions available
                            for this election.

                        </p>

                    </div>

                ) : (

                    <div className="grid md:grid-cols-2 gap-6">

                        {

                            positions.map(
                                (position) => (

                                    <PositionCard

                                        key={position.id}

                                        position={position}

                                        canVote={canVote}

                                        onVote={(positionId) => {

                                            if (!canVote) {
                                                return;
                                            }

                                            navigate(
                                                `/voter/vote/${positionId}`
                                            );

                                        }}

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