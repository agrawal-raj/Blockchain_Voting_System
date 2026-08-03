import Button from "../common/Button";

export default function PositionCard({

    position,

    onVote,

}) {

    return (

        <div className="bg-white rounded-xl shadow-md p-5">

            <h2 className="text-xl font-semibold">

                {position.title}

            </h2>

            <p className="text-gray-500 mt-2">

                Maximum Candidates :

                {position.max_candidates}

            </p>

            <Button

                className="mt-4"

                onClick={() => onVote(position.id)}

            >

                Vote

            </Button>

        </div>

    );

}