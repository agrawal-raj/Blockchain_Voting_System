import Button from "../common/Button";

export default function CandidateCard({

    candidate,

    selected,

    onSelect,

}) {

    return (

        <div
            className={`rounded-xl border p-5 shadow transition ${
                selected
                    ? "border-blue-600 bg-blue-50"
                    : "border-gray-200 bg-white"
            }`}
        >

            <div className="flex items-center gap-4">

                {

                    candidate.photo ? (

                        <img
                            src={candidate.photo}
                            alt={candidate.full_name}
                            className="w-20 h-20 rounded-full object-cover"
                        />

                    ) : (

                        <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">

                            No Photo

                        </div>

                    )

                }

                <div>

                    <h2 className="text-xl font-bold">

                        {candidate.full_name}

                    </h2>

                    <p className="text-gray-600">

                        {candidate.designation}

                    </p>

                </div>

            </div>

            {

                candidate.election_symbol && (

                    <img
                        src={candidate.election_symbol}
                        alt="Election Symbol"
                        className="w-24 h-24 mt-4 object-contain"
                    />

                )

            }

            <p className="mt-4 text-gray-700">

                {candidate.bio}

            </p>

            {

                candidate.manifesto && (

                    <div className="mt-4">

                        <h3 className="font-semibold">

                            Manifesto

                        </h3>

                        <p className="text-gray-600">

                            {candidate.manifesto}

                        </p>

                    </div>

                )

            }

            <Button
                className="mt-5 w-full"
                onClick={() => onSelect(candidate)}
            >

                {

                    selected

                        ? "Selected"

                        : "Select Candidate"

                }

            </Button>

        </div>

    );

}