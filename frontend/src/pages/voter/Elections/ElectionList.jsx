import {
    useEffect,
    useState,
} from "react";

import { useNavigate } from "react-router-dom";

import votingService from "../../../services/votingService";

import ElectionCard from "../../../components/voter/ElectionCard";

import Loader from "../../../components/common/LoadingSpinner";
import Button from "../../../components/common/Button";

export default function ElectionList() {

    const navigate = useNavigate();


    const [
        elections,
        setElections,
    ] = useState([]);


    const [
        loading,
        setLoading,
    ] = useState(true);


    const [
        error,
        setError,
    ] = useState("");


    useEffect(() => {

        loadElections();

    }, []);


    const loadElections = async () => {

        try {

            setLoading(true);

            setError("");


            const data =
                await votingService.getAvailableElections();


            setElections(
                Array.isArray(data)
                    ? data
                    : []
            );

        }

        catch (error) {

            console.error(
                "Failed to load elections:",
                error
            );


            setError(
                "Failed to load available elections."
            );

        }

        finally {

            setLoading(false);

        }

    };


    if (loading) {

        return <Loader />;

    }


    return (

        <div className="max-w-7xl mx-auto p-6">


            <div className="flex justify-between items-start mb-8">
            <div className="mb-8">

                <h1 className="text-3xl font-bold">

                    Available Elections

                </h1>


                <p className="text-gray-500 mt-2">

                    View available elections and participate
                    when voting is open.

                </p>

            </div>
            
            
                            <Button
                                onClick={() =>
                                    navigate("/voter/dashboard")
                                }
                            >
            
                                Back
            
                            </Button>
            
                        </div>
            


            {
                error && (

                    <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 mb-6">

                        {error}

                    </div>

                )
            }


            {
                elections.length === 0 ? (

                    <div className="bg-white rounded-xl shadow p-8 text-center">

                        <h2 className="text-xl font-semibold">

                            No Elections Available

                        </h2>


                        <p className="text-gray-500 mt-2">

                            There are currently no active
                            elections available for voting.

                        </p>

                    </div>

                ) : (

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

                        {

                            elections.map(
                                (election) => (

                                    <ElectionCard

                                        key={election.id}

                                        election={election}

                                        onView={(id) =>
                                            navigate(
                                                `/voter/elections/${id}`
                                            )
                                        }

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