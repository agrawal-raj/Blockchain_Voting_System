import React from "react";

export default function ResultStatistics({ statistics }) {

    if (!statistics) {

        return null;

    }

    const cards = [

        {
            title: "Total Elections",
            value: statistics.elections ?? 0,
            color: "bg-blue-500",
        },

        {
            title: "Published Results",
            value: statistics.published_results ?? 0,
            color: "bg-green-500",
        },

        {
            title: "Pending Publish",
            value: statistics.pending_results ?? 0,
            color: "bg-yellow-500",
        },

        {
            title: "Blockchain Verified",
            value: statistics.verified_results ?? 0,
            color: "bg-purple-500",
        },

    ];

    return (

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">

            {

                cards.map((card) => (

                    <div
                        key={card.title}
                        className="bg-white rounded-xl shadow-md border border-gray-200 p-6"
                    >

                        <div className="flex justify-between items-center">

                            <div>

                                <p className="text-sm text-gray-500">

                                    {card.title}

                                </p>

                                <h2 className="text-3xl font-bold mt-2">

                                    {card.value}

                                </h2>

                            </div>

                            <div
                                className={`w-14 h-14 rounded-full ${card.color} flex items-center justify-center`}
                            >

                                <span className="text-white text-xl font-bold">

                                    {card.value}

                                </span>

                            </div>

                        </div>

                    </div>

                ))

            }

        </div>

    );

}