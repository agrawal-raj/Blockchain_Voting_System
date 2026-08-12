import {
    useEffect,
    useState,
} from "react";

import {
    useNavigate,
} from "react-router-dom";

import {
    toast,
} from "react-toastify";

import votingService
    from "../../services/votingService";

import Loader
    from "../../components/common/LoadingSpinner";

import Button
    from "../../components/common/Button";


export default function VoteHistory() {

    const navigate = useNavigate();


    const [
        history,
        setHistory,
    ] = useState([]);


    const [
        loading,
        setLoading,
    ] = useState(true);


    const [
        verifyingVoteId,
        setVerifyingVoteId,
    ] = useState(null);


    const [
        verification,
        setVerification,
    ] = useState(null);


    const loadVoteHistory = async () => {

        try {

            setLoading(true);


            const response =
                await votingService.getVoteHistory();


            setHistory(
                Array.isArray(response)
                    ? response
                    : []
            );

        }

        catch (error) {

            console.error(
                "Failed to load vote history:",
                error
            );


            toast.error(
                "Failed to load your vote history."
            );

        }

        finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        loadVoteHistory();

    }, []);


    const formatDate = (date) => {

        if (!date) {

            return "—";

        }


        const parsedDate =
            new Date(date);


        if (
            Number.isNaN(
                parsedDate.getTime()
            )
        ) {

            return "—";

        }


        return parsedDate.toLocaleString(
            undefined,
            {
                dateStyle: "medium",
                timeStyle: "short",
            }
        );

    };


    const handleVerifyBlockchain = async (
        voteId
    ) => {

        try {

            setVerifyingVoteId(
                voteId
            );

            setVerification(null);


            const response =
                await votingService.verifyVoteBlockchain(
                    voteId
                );


            setVerification(
                response
            );


            if (response.verified) {

                toast.success(
                    "Blockchain verification successful."
                );

            }

            else {

                toast.error(
                    "Blockchain verification failed."
                );

            }

        }

        catch (error) {

            console.error(
                "Blockchain verification failed:",
                error
            );


            setVerification({
                verified: false,
                message:
                    error?.response?.data?.message ||
                    "Unable to verify this vote.",
            });


            toast.error(
                "Unable to verify this vote."
            );

        }

        finally {

            setVerifyingVoteId(null);

        }

    };


    const closeVerification = () => {

        setVerification(null);

    };


    if (loading) {

        return <Loader />;

    }


    return (

        <div className="max-w-7xl mx-auto p-6">


            {/* ================================================= */}
            {/* HEADER                                            */}
            {/* ================================================= */}

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">


                <div>

                    <h1 className="text-3xl font-bold">

                        Vote History

                    </h1>


                    <p className="text-gray-500 mt-2">

                        View the votes you have submitted
                        and verify their blockchain records.

                    </p>

                </div>


                <Button
                    onClick={() =>
                        navigate(-1)
                    }
                >

                    Back

                </Button>

            </div>



            {/* ================================================= */}
            {/* VERIFICATION RESULT                               */}
            {/* ================================================= */}

            {
                verification && (

                    <div
                        className={
                            `mb-8 rounded-xl border p-6 ` +
                            (
                                verification.verified
                                    ? "bg-green-50 border-green-200"
                                    : "bg-red-50 border-red-200"
                            )
                        }
                    >


                        <div className="flex flex-col md:flex-row justify-between gap-4">


                            <div>

                                <h2
                                    className={
                                        `text-xl font-bold ` +
                                        (
                                            verification.verified
                                                ? "text-green-700"
                                                : "text-red-700"
                                        )
                                    }
                                >

                                    {
                                        verification.verified
                                            ? "✅ Blockchain Verified"
                                            : "❌ Blockchain Verification Failed"
                                    }

                                </h2>


                                <p className="mt-2 text-gray-700">

                                    {
                                        verification.message
                                    }

                                </p>

                            </div>


                            <Button
                                onClick={
                                    closeVerification
                                }
                            >

                                Close

                            </Button>


                        </div>



                        {
                            verification.verified && (

                                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">


                                    <div className="bg-white rounded-lg p-4">

                                        <p className="text-sm text-gray-500">

                                            Election

                                        </p>

                                        <p className="font-semibold mt-1">

                                            {
                                                verification.election ||
                                                "—"
                                            }

                                        </p>

                                    </div>


                                    <div className="bg-white rounded-lg p-4">

                                        <p className="text-sm text-gray-500">

                                            Organization

                                        </p>

                                        <p className="font-semibold mt-1">

                                            {
                                                verification.organization ||
                                                "—"
                                            }

                                        </p>

                                    </div>


                                    <div className="bg-white rounded-lg p-4">

                                        <p className="text-sm text-gray-500">

                                            Position

                                        </p>

                                        <p className="font-semibold mt-1">

                                            {
                                                verification.position ||
                                                "—"
                                            }

                                        </p>

                                    </div>


                                    <div className="bg-white rounded-lg p-4">

                                        <p className="text-sm text-gray-500">

                                            Candidate

                                        </p>

                                        <p className="font-semibold mt-1">

                                            {
                                                verification.candidate ||
                                                "—"
                                            }

                                        </p>

                                    </div>


                                    <div className="bg-white rounded-lg p-4">

                                        <p className="text-sm text-gray-500">

                                            Vote Time

                                        </p>

                                        <p className="font-semibold mt-1">

                                            {
                                                formatDate(
                                                    verification.voted_at
                                                )
                                            }

                                        </p>

                                    </div>


                                    <div className="bg-white rounded-lg p-4">

                                        <p className="text-sm text-gray-500">

                                            Block Number

                                        </p>

                                        <p className="font-semibold mt-1">

                                            #
                                            {
                                                verification.block_number
                                            }

                                        </p>

                                    </div>


                                    <div className="bg-white rounded-lg p-4 md:col-span-2">

                                        <p className="text-sm text-gray-500">

                                            Block Hash

                                        </p>

                                        <p className="font-mono text-sm break-all mt-1">

                                            {
                                                verification.block_hash
                                            }

                                        </p>

                                    </div>


                                    <div className="bg-white rounded-lg p-4 md:col-span-2">

                                        <p className="text-sm text-gray-500">

                                            Previous Hash

                                        </p>

                                        <p className="font-mono text-sm break-all mt-1">

                                            {
                                                verification.previous_hash
                                            }

                                        </p>

                                    </div>


                                    <div className="bg-white rounded-lg p-4 md:col-span-2">

                                        <p className="text-sm text-gray-500">

                                            Merkle Root

                                        </p>

                                        <p className="font-mono text-sm break-all mt-1">

                                            {
                                                verification.merkle_root
                                            }

                                        </p>

                                    </div>


                                </div>

                            )

                        }


                    </div>

                )

            }



            {/* ================================================= */}
            {/* EMPTY STATE                                       */}
            {/* ================================================= */}

            {
                history.length === 0 ? (

                    <div className="bg-white rounded-xl shadow p-10 text-center">


                        <div className="text-5xl mb-4">

                            🗳️

                        </div>


                        <h2 className="text-xl font-semibold">

                            No Votes Found

                        </h2>


                        <p className="text-gray-500 mt-2">

                            You have not cast any votes yet.

                        </p>


                        <div className="mt-6">

                            <Button
                                onClick={() =>
                                    navigate(
                                        "/voter/elections"
                                    )
                                }
                            >

                                View Elections

                            </Button>

                        </div>


                    </div>

                ) : (

                    <>


                        {/* ================================================= */}
                        {/* DESKTOP TABLE                                    */}
                        {/* ================================================= */}

                        <div className="hidden md:block bg-white rounded-xl shadow overflow-hidden">


                            <div className="overflow-x-auto">


                                <table className="w-full">


                                    <thead className="bg-gray-50 border-b">

                                        <tr>

                                            <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">

                                                Election

                                            </th>


                                            <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">

                                                Organization

                                            </th>


                                            <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">

                                                Position

                                            </th>


                                            <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">

                                                Candidate

                                            </th>


                                            <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">

                                                Voted At

                                            </th>


                                            <th className="text-center px-6 py-4 text-sm font-semibold text-gray-700">

                                                Verification

                                            </th>

                                        </tr>

                                    </thead>


                                    <tbody className="divide-y">


                                        {
                                            history.map(
                                                (vote) => (

                                                    <tr
                                                        key={
                                                            vote.vote_id
                                                        }
                                                        className="hover:bg-gray-50"
                                                    >


                                                        <td className="px-6 py-4 font-medium">

                                                            {
                                                                vote.election ||
                                                                "—"
                                                            }

                                                        </td>


                                                        <td className="px-6 py-4 text-gray-600">

                                                            {
                                                                vote.organization ||
                                                                "—"
                                                            }

                                                        </td>


                                                        <td className="px-6 py-4 text-gray-600">

                                                            {
                                                                vote.position ||
                                                                "—"
                                                            }

                                                        </td>


                                                        <td className="px-6 py-4 font-medium">

                                                            {
                                                                vote.candidate ||
                                                                "—"
                                                            }

                                                        </td>


                                                        <td className="px-6 py-4 text-gray-600">

                                                            {
                                                                formatDate(
                                                                    vote.voted_at
                                                                )
                                                            }

                                                        </td>


                                                        <td className="px-6 py-4 text-center">


                                                            <Button
                                                                onClick={() =>
                                                                    handleVerifyBlockchain(
                                                                        vote.vote_id
                                                                    )
                                                                }
                                                                disabled={
                                                                    verifyingVoteId ===
                                                                    vote.vote_id
                                                                }
                                                            >

                                                                {
                                                                    verifyingVoteId ===
                                                                    vote.vote_id
                                                                        ? "Verifying..."
                                                                        : "Verify Blockchain"
                                                                }

                                                            </Button>


                                                        </td>


                                                    </tr>

                                                )
                                            )
                                        }


                                    </tbody>

                                </table>

                            </div>

                        </div>



                        {/* ================================================= */}
                        {/* MOBILE CARDS                                     */}
                        {/* ================================================= */}

                        <div className="md:hidden space-y-4">


                            {
                                history.map(
                                    (vote) => (

                                        <div
                                            key={
                                                vote.vote_id
                                            }
                                            className="bg-white rounded-xl shadow p-5"
                                        >


                                            <div className="flex justify-between items-start gap-3">


                                                <div>

                                                    <h2 className="font-bold text-lg">

                                                        {
                                                            vote.election ||
                                                            "Unknown Election"
                                                        }

                                                    </h2>


                                                    <p className="text-gray-500 text-sm mt-1">

                                                        {
                                                            vote.organization ||
                                                            "—"
                                                        }

                                                    </p>

                                                </div>


                                                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">

                                                    Recorded

                                                </span>


                                            </div>


                                            <div className="border-t mt-4 pt-4 space-y-2">


                                                <p>

                                                    <span className="text-gray-500">

                                                        Position:

                                                    </span>

                                                    <span className="ml-2 font-medium">

                                                        {
                                                            vote.position ||
                                                            "—"
                                                        }

                                                    </span>

                                                </p>


                                                <p>

                                                    <span className="text-gray-500">

                                                        Candidate:

                                                    </span>

                                                    <span className="ml-2 font-medium">

                                                        {
                                                            vote.candidate ||
                                                            "—"
                                                        }

                                                    </span>

                                                </p>


                                                <p>

                                                    <span className="text-gray-500">

                                                        Voted At:

                                                    </span>

                                                    <span className="ml-2">

                                                        {
                                                            formatDate(
                                                                vote.voted_at
                                                            )
                                                        }

                                                    </span>

                                                </p>


                                            </div>


                                            <div className="mt-5">


                                                <Button
                                                    className="w-full"
                                                    onClick={() =>
                                                        handleVerifyBlockchain(
                                                            vote.vote_id
                                                        )
                                                    }
                                                    disabled={
                                                        verifyingVoteId ===
                                                        vote.vote_id
                                                    }
                                                >

                                                    {
                                                        verifyingVoteId ===
                                                        vote.vote_id
                                                            ? "Verifying..."
                                                            : "Verify Blockchain"
                                                    }

                                                </Button>


                                            </div>


                                        </div>

                                    )
                                )
                            }


                        </div>


                    </>

                )

            }


        </div>

    );

}