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

import PositionCard from "../../../components/voter/PositionCard";

export default function ElectionDetails() {

    const { id } = useParams();

    const navigate = useNavigate();

    const [

        positions,

        setPositions,

    ] = useState([]);

    const [

        loading,

        setLoading,

    ] = useState(true);

    useEffect(() => {

        loadElection();

    }, [id]);

    const loadElection = async () => {

        try {

            const data = await votingService.getElectionDetails(id);

            setPositions(data);

        }

        finally {

            setLoading(false);

        }

    };

    if (loading) {

        return <Loader />;

    }

    return (

        <div>

            <h1 className="text-3xl font-bold mb-6">

                Select Position

            </h1>

            <div className="grid md:grid-cols-2 gap-6">

                {

                    positions.map((position) => (

                        <PositionCard

                            key={position.id}

                            position={position}

                            onVote={(positionId) =>

                                navigate(`/voter/vote/${positionId}`)

                            }

                        />

                    ))

                }

            </div>

        </div>

    );

}