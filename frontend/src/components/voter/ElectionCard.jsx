import Button from "../common/Button";

export default function ElectionCard({

    election,

    onView,

}) {

    return (

        <div className="bg-white rounded-xl shadow p-6">

            <h2 className="text-xl font-bold">

                {election.title}

            </h2>

            <p className="text-gray-600 mt-2">

                {election.organization}

            </p>

            <p className="mt-2">

                Status :

                <span className="ml-2 font-semibold text-green-600">

                    {election.status}

                </span>

            </p>

            <Button

                className="mt-5"

                onClick={() => onView(election.id)}

            >

                Vote Now

            </Button>

        </div>

    );

}