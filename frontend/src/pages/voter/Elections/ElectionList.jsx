import {

    useEffect,

    useState,

} from "react";

import { useNavigate } from "react-router-dom";

import votingService from "../../../services/votingService";

import ElectionCard from "../../../components/voter/ElectionCard";

import Loader from "../../../components/common/LoadingSpinner";

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

    useEffect(() => {

        loadElections();

    }, []);

    const loadElections = async () => {

        try {

            const data = await votingService.getAvailableElections();

            setElections(data);

        }

        finally {

            setLoading(false);

        }

    };

    if (loading) {

        return <Loader />;

    }

    return (

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

            {

                elections.map((election) => (

                    <ElectionCard

                        key={election.id}

                        election={election}

                        onView={(id) =>

                            navigate(`/voter/elections/${id}`)

                        }

                    />

                ))

            }

        </div>

    );

}