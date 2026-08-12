import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";


/* =========================================================
   HELPER
========================================================= */

function getBlockchainStatus(result) {

    if (
        result &&
        typeof result.blockchain_verified === "boolean"
    ) {

        return result.blockchain_verified
            ? "Verified"
            : "Failed";

    }

    /*
     * Position Result API currently does not return
     * blockchain_verified.
     *
     * Therefore we do not incorrectly display "Failed"
     * when the value is simply unavailable.
     */

    return "Not Available";

}


/* =========================================================
   POSITION RESULT PDF
========================================================= */

export function exportPositionResultPDF(result) {

    const doc = new jsPDF();


    /* -----------------------------------------------------
       Header
    ----------------------------------------------------- */

    doc.setFontSize(20);

    doc.text(
        "Blockchain Voting System",
        14,
        20
    );


    doc.setFontSize(16);

    doc.text(
        "Position Result Report",
        14,
        32
    );


    doc.setFontSize(12);


    /* -----------------------------------------------------
       Position Information
    ----------------------------------------------------- */

    doc.text(
        `Position : ${result.position}`,
        14,
        46
    );


    doc.text(
        `Total Votes : ${result.total_votes}`,
        14,
        54
    );


    /* -----------------------------------------------------
       Winner
    ----------------------------------------------------- */

    if (result.winner) {

        doc.text(
            `Winner : ${result.winner.candidate}`,
            14,
            62
        );


        doc.text(
            `Winner Votes : ${result.winner.votes}`,
            14,
            70
        );


        doc.text(
            `Winner Percentage : ${result.winner.percentage}%`,
            14,
            78
        );

    }

    else {

        doc.text(
            "Winner : No Winner",
            14,
            62
        );

    }


    /* -----------------------------------------------------
       Blockchain Verification
    ----------------------------------------------------- */

    doc.text(
        `Blockchain Verification : ${getBlockchainStatus(result)}`,
        14,
        86
    );


    /* -----------------------------------------------------
       Candidate Table
    ----------------------------------------------------- */

    autoTable(doc, {

        startY: 98,

        head: [

            [

                "Rank",

                "Candidate",

                "Votes",

                "Percentage"

            ]

        ],

        body:

            Array.isArray(result.candidates)

                ? result.candidates.map(
                    (candidate, index) => [

                        index + 1,

                        candidate.candidate,

                        candidate.votes,

                        `${candidate.percentage}%`

                    ]
                )

                : []

    });


    /* -----------------------------------------------------
       Save
    ----------------------------------------------------- */

    doc.save(

        `${result.position}_Result.pdf`

    );

}


/* =========================================================
   ELECTION RESULT PDF
========================================================= */

export function exportElectionResultPDF(result) {

    const doc = new jsPDF();


    /* -----------------------------------------------------
       Header
    ----------------------------------------------------- */

    doc.setFontSize(20);

    doc.text(
        "Blockchain Voting System",
        14,
        20
    );


    doc.setFontSize(16);

    doc.text(
        "Election Result Report",
        14,
        32
    );


    doc.setFontSize(12);


    /* -----------------------------------------------------
       Election Information
    ----------------------------------------------------- */

    doc.text(
        `Election : ${result.election}`,
        14,
        46
    );


    doc.text(
        `Organization : ${result.organization}`,
        14,
        54
    );


    doc.text(
        `Status : ${result.status}`,
        14,
        62
    );


    /* -----------------------------------------------------
       Blockchain Verification
    ----------------------------------------------------- */

    doc.text(
        `Blockchain Verification : ${getBlockchainStatus(result)}`,
        14,
        70
    );


    /* -----------------------------------------------------
       Published Status
    ----------------------------------------------------- */

    let startY = 82;


    if (result.is_result_published) {

        doc.text(
            "Result Status : Published",
            14,
            startY
        );

        startY += 8;


        if (result.result_published_at) {

            const publishedDate =
                new Date(
                    result.result_published_at
                ).toLocaleString();

            doc.text(
                `Published At : ${publishedDate}`,
                14,
                startY
            );

            startY += 8;

        }

    }


    startY += 5;


    /* -----------------------------------------------------
       Positions
    ----------------------------------------------------- */

    const positions =
        Array.isArray(result.positions)
            ? result.positions
            : [];


    positions.forEach(
        (position) => {

            /*
             * Prevent content from running off the page.
             */

            if (startY > 250) {

                doc.addPage();

                startY = 20;

            }


            /* Position title */

            doc.setFontSize(14);

            doc.text(
                `Position : ${position.position}`,
                14,
                startY
            );


            startY += 8;


            doc.setFontSize(11);


            /* Total votes */

            doc.text(
                `Total Votes : ${position.total_votes}`,
                14,
                startY
            );


            startY += 7;


            /* Winner */

            if (position.winner) {

                doc.text(
                    `Winner : ${position.winner.candidate}`,
                    14,
                    startY
                );


                startY += 7;


                doc.text(
                    `Winner Votes : ${position.winner.votes}`,
                    14,
                    startY
                );


                startY += 7;


                doc.text(
                    `Winner Percentage : ${position.winner.percentage}%`,
                    14,
                    startY
                );


                startY += 8;

            }

            else {

                doc.text(
                    "Winner : No Winner",
                    14,
                    startY
                );


                startY += 8;

            }


            /* Candidate table */

            autoTable(doc, {

                startY,

                head: [

                    [

                        "Candidate",

                        "Votes",

                        "Percentage"

                    ]

                ],

                body:

                    Array.isArray(
                        position.candidates
                    )

                        ? position.candidates.map(
                            (candidate) => [

                                candidate.candidate,

                                candidate.votes,

                                `${candidate.percentage}%`

                            ]
                        )

                        : []

            });


            startY =
                doc.lastAutoTable.finalY + 15;

        }
    );


    /* -----------------------------------------------------
       Save
    ----------------------------------------------------- */

    doc.save(

        `${result.election}_Result.pdf`

    );

}