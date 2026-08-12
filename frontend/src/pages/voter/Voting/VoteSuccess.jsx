import { useLocation, useNavigate } from "react-router-dom";

import Button from "../../../components/common/Button";


export default function VoteSuccess() {

    const { state } = useLocation();

    const navigate = useNavigate();


    /*
     * Hooks are intentionally called before any
     * conditional return.
     */


    if (!state) {

        return (

            <div className="max-w-3xl mx-auto mt-20 px-6">

                <div className="bg-white rounded-xl shadow-lg p-8 text-center">


                    <div className="text-5xl mb-4">

                        ⚠️

                    </div>


                    <h2 className="text-2xl font-bold">

                        Invalid Access

                    </h2>


                    <p className="text-gray-500 mt-2">

                        This page can only be accessed after
                        successfully submitting a vote.

                    </p>


                    <Button

                        className="mt-5"

                        onClick={() =>
                            navigate(
                                "/voter/dashboard"
                            )
                        }

                    >

                        Go to Dashboard

                    </Button>

                </div>

            </div>

        );

    }


    const {
        vote,
        candidate,
    } = state;


    return (

        <div className="max-w-3xl mx-auto mt-10 px-6">

            <div className="bg-white rounded-xl shadow-lg p-8">


                {/* Success Header */}

                <div className="text-center">

                    <div className="text-6xl text-green-600">

                        ✅

                    </div>


                    <h1 className="text-3xl font-bold mt-4">

                        Vote Submitted Successfully

                    </h1>


                    <p className="text-gray-500 mt-2">

                        Your vote has been securely recorded
                        on the blockchain.

                    </p>

                </div>


                {/* Vote Information */}

                <div className="mt-8 space-y-5">


                    <div>

                        <strong>
                            Candidate
                        </strong>

                        <p className="mt-1 text-gray-700">

                            {
                                candidate?.full_name ??
                                "-"
                            }

                        </p>

                    </div>


                    <div>

                        <strong>
                            Block Number
                        </strong>

                        <p className="mt-1 text-gray-700">

                            {
                                vote?.block_number ??
                                "-"
                            }

                        </p>

                    </div>


                    <div>

                        <strong>
                            Block Hash
                        </strong>

                        <p className="mt-1 break-all text-sm text-gray-700">

                            {
                                vote?.block_hash ??
                                "-"
                            }

                        </p>

                    </div>


                    <div>

                        <strong>
                            Message
                        </strong>

                        <p className="mt-1 text-gray-700">

                            {
                                vote?.message ??
                                "Vote cast successfully."
                            }

                        </p>

                    </div>


                </div>


                {/* Actions */}

                <div className="mt-8 flex justify-center gap-3">


                    <Button

                        onClick={() =>
                            navigate(
                                "/voter/dashboard"
                            )
                        }

                    >

                        Back to Dashboard

                    </Button>


                    <Button

                        variant="secondary"

                        onClick={() =>
                            navigate(
                                "/voter/elections"
                            )
                        }

                    >

                        Available Elections

                    </Button>


                </div>


            </div>

        </div>

    );

}