import { useLocation, useNavigate } from "react-router-dom";
import Button from "../../../components/common/Button";


export default function VoteSuccess() {
    
    const { state } = useLocation();

    if (!state) {

        return (

            <div className="text-center mt-20">

                <h2 className="text-2xl font-bold">

                    Invalid Access

                </h2>

                <Button
                    className="mt-5"
                    onClick={() => navigate("/voter/dashboard")}
                >
                    Go to Dashboard
                </Button>

            </div>

        );

    }
    const navigate = useNavigate();
    const { vote, candidate } = state;

    return (

        <div className="max-w-3xl mx-auto mt-10 bg-white rounded-xl shadow-lg p-8">

            <div className="text-center">

                <div className="text-6xl text-green-600">

                    ✅

                </div>

                <h1 className="text-3xl font-bold mt-4">

                    Vote Submitted Successfully

                </h1>

                <p className="text-gray-500 mt-2">

                    Your vote has been securely recorded on the blockchain.

                </p>

            </div>

            <div className="mt-8 space-y-4">

                <div>

                    <strong>Candidate</strong>

                    <p>{candidate.full_name}</p>

                </div>

                <div>

                    <strong>Block Number</strong>

                    <p>{vote.block_number}</p>

                </div>

                <div>

                    <strong>Block Hash</strong>

                    <p className="break-all text-sm">

                        {vote.block_hash}

                    </p>

                </div>

                <div>

                    <strong>Message</strong>

                    <p>{vote.message}</p>

                </div>

            </div>

            <div className="mt-8 flex justify-center">

                <Button
                    onClick={() => navigate("/voter/dashboard")}
                >
                    Back to Dashboard
                </Button>

            </div>

        </div>

    );

}