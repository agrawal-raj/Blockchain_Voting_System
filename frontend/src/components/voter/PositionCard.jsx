import Button from "../common/Button";


export default function PositionCard({
    position,
    onVote,
    canVote = true,
}) {

    return (

        <div className="bg-white rounded-xl shadow-md p-5">


            <h2 className="text-xl font-semibold">

                {position.title}

            </h2>


            {
                position.max_candidates !== undefined &&
                position.max_candidates !== null && (

                    <p className="text-gray-500 mt-2">

                        Maximum Candidates:

                        <span className="ml-1">

                            {position.max_candidates}

                        </span>

                    </p>

                )
            }


            <Button

                className="mt-4"

                disabled={!canVote}

                onClick={() => {

                    if (!canVote) {
                        return;
                    }

                    onVote(position.id);

                }}

            >

                {canVote
                    ? "Vote"
                    : "Voting Unavailable"
                }

            </Button>


        </div>

    );

}