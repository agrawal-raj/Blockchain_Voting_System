import Button from "../common/Button";


export default function ElectionCard({
    election,
    onView,
}) {

    const now = new Date();

    const startDate = election?.start_date
        ? new Date(election.start_date)
        : null;

    const endDate = election?.end_date
        ? new Date(election.end_date)
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


    let statusText = election?.status || "UNKNOWN";

    let statusClass =
        "text-gray-600";


    let buttonText = "View Election";


    if (election?.status === "CANCELLED") {

        statusText = "CANCELLED";

        statusClass =
            "text-red-600";

        buttonText =
            "Election Cancelled";

    }

    else if (election?.status === "COMPLETED") {

        statusText = "COMPLETED";

        statusClass =
            "text-gray-600";

        buttonText =
            "Voting Ended";

    }

    else if (
        isActive &&
        startDate &&
        now < startDate
    ) {

        statusText =
            "VOTING NOT STARTED";

        statusClass =
            "text-yellow-600";

        buttonText =
            "Voting Not Started";

    }

    else if (
        isActive &&
        hasEnded
    ) {

        statusText =
            "VOTING ENDED";

        statusClass =
            "text-gray-600";

        buttonText =
            "Voting Ended";

    }

    else if (canVote) {

        statusText =
            "ACTIVE";

        statusClass =
            "text-green-600";

        buttonText =
            "Vote Now";

    }


    const formatDate = (date) => {

        if (!date) {
            return null;
        }

        return new Date(date).toLocaleString(
            undefined,
            {
                dateStyle: "medium",
                timeStyle: "short",
            }
        );

    };


    return (

        <div className="bg-white rounded-xl shadow p-6">


            <h2 className="text-xl font-bold">

                {election.title}

            </h2>


            <p className="text-gray-600 mt-2">

                {election.organization}

            </p>


            <p className="mt-3">

                Status:

                <span
                    className={`
                        ml-2
                        font-semibold
                        ${statusClass}
                    `}
                >

                    {statusText}

                </span>

            </p>


            {
                election.start_date && (

                    <p className="text-gray-500 mt-3">

                        Starts:

                        <span className="ml-1">

                            {formatDate(
                                election.start_date
                            )}

                        </span>

                    </p>

                )
            }


            {
                election.end_date && (

                    <p className="text-gray-500 mt-1">

                        Ends:

                        <span className="ml-1">

                            {formatDate(
                                election.end_date
                            )}

                        </span>

                    </p>

                )
            }


            {
                isActive &&
                startDate &&
                now < startDate && (

                    <p className="text-yellow-600 text-sm mt-3">

                        Voting has not started yet.

                    </p>

                )
            }


            {
                isActive &&
                hasEnded && (

                    <p className="text-gray-600 text-sm mt-3">

                        The voting period has ended.

                    </p>

                )
            }


            <Button

                className="mt-5"

                disabled={!canVote}

                onClick={() => {

                    if (!canVote) {
                        return;
                    }

                    onView(election.id);

                }}

            >

                {buttonText}

            </Button>


        </div>

    );

}