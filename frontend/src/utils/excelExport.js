import * as XLSX from "xlsx";
import { saveAs } from "file-saver";


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

    return "Not Available";

}


/* =========================================================
   POSITION RESULT EXCEL
========================================================= */

export function exportPositionResultExcel(result) {

    const workbook =
        XLSX.utils.book_new();


    /* -----------------------------------------------------
       Summary
    ----------------------------------------------------- */

    const winner =
        result.winner || null;


    const summaryRows = [

        [
            "Blockchain Voting System"
        ],

        [
            "Position Result Report"
        ],

        [],

        [
            "Position",
            result.position || "-"
        ],

        [
            "Total Votes",
            result.total_votes ?? 0
        ],

        [
            "Winner",
            winner
                ? winner.candidate
                : "No Winner"
        ],

        [
            "Winner Votes",
            winner
                ? winner.votes
                : 0
        ],

        [
            "Winner Percentage",
            winner
                ? `${winner.percentage}%`
                : "0%"
        ],

        [
            "Blockchain Verification",
            getBlockchainStatus(result)
        ],

        []

    ];


    const summarySheet =
        XLSX.utils.aoa_to_sheet(
            summaryRows
        );


    XLSX.utils.book_append_sheet(

        workbook,

        summarySheet,

        "Summary"

    );


    /* -----------------------------------------------------
       Candidate Results
    ----------------------------------------------------- */

    const rows = [

        [

            "Rank",

            "Candidate",

            "Votes",

            "Percentage"

        ]

    ];


    if (
        Array.isArray(
            result.candidates
        )
    ) {

        result.candidates.forEach(
            (candidate, index) => {

                rows.push([

                    index + 1,

                    candidate.candidate,

                    candidate.votes,

                    `${candidate.percentage}%`

                ]);

            }
        );

    }


    const resultSheet =
        XLSX.utils.aoa_to_sheet(
            rows
        );


    XLSX.utils.book_append_sheet(

        workbook,

        resultSheet,

        "Position Result"

    );


    /* -----------------------------------------------------
       Export
    ----------------------------------------------------- */

    const excelBuffer =
        XLSX.write(

            workbook,

            {

                bookType: "xlsx",

                type: "array"

            }

        );


    const file = new Blob(

        [excelBuffer],

        {

            type:
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8"

        }

    );


    saveAs(

        file,

        `${result.position}_Result.xlsx`

    );

}


/* =========================================================
   ELECTION RESULT EXCEL
========================================================= */

export function exportElectionResultExcel(result) {

    const workbook =
        XLSX.utils.book_new();


    const positions =
        Array.isArray(result.positions)
            ? result.positions
            : [];


    /* -----------------------------------------------------
       Calculate Total Votes
    ----------------------------------------------------- */

    const totalVotes =
        positions.reduce(

            (total, position) =>

                total +
                Number(
                    position.total_votes || 0
                ),

            0

        );


    /* -----------------------------------------------------
       Calculate Winners
    ----------------------------------------------------- */

    const winnersCount =
        positions.filter(
            (position) =>
                Boolean(position.winner)
        ).length;


    /* -----------------------------------------------------
       Election Summary
    ----------------------------------------------------- */

    const summaryRows = [

        [
            "Blockchain Voting System"
        ],

        [
            "Election Result Report"
        ],

        [],

        [
            "Election",
            result.election || "-"
        ],

        [
            "Organization",
            result.organization || "-"
        ],

        [
            "Status",
            result.status || "-"
        ],

        [
            "Blockchain Verification",
            getBlockchainStatus(result)
        ],

        [
            "Result Published",
            result.is_result_published
                ? "Yes"
                : "No"
        ],

        [
            "Published At",
            result.result_published_at
                ? new Date(
                    result.result_published_at
                ).toLocaleString()
                : "-"
        ],

        [
            "Positions",
            positions.length
        ],

        [
            "Winners",
            winnersCount
        ],

        [
            "Total Votes",
            totalVotes
        ],

        []

    ];


    const summarySheet =
        XLSX.utils.aoa_to_sheet(
            summaryRows
        );


    XLSX.utils.book_append_sheet(

        workbook,

        summarySheet,

        "Summary"

    );


    /* -----------------------------------------------------
       Election Results
    ----------------------------------------------------- */

    const rows = [

        [

            "Position",

            "Winner",

            "Winner Votes",

            "Winner Percentage",

            "Candidate",

            "Votes",

            "Percentage"

        ]

    ];


    positions.forEach(
        (position) => {

            const winner =
                position.winner || null;


            const candidates =
                Array.isArray(
                    position.candidates
                )
                    ? position.candidates
                    : [];


            /*
             * If there are no candidates,
             * still keep the position visible.
             */

            if (candidates.length === 0) {

                rows.push([

                    position.position,

                    winner
                        ? winner.candidate
                        : "No Winner",

                    winner
                        ? winner.votes
                        : 0,

                    winner
                        ? `${winner.percentage}%`
                        : "0%",

                    "-",

                    0,

                    "0%"

                ]);

                return;

            }


            candidates.forEach(
                (candidate) => {

                    rows.push([

                        position.position,

                        winner
                            ? winner.candidate
                            : "No Winner",

                        winner
                            ? winner.votes
                            : 0,

                        winner
                            ? `${winner.percentage}%`
                            : "0%",

                        candidate.candidate,

                        candidate.votes,

                        `${candidate.percentage}%`

                    ]);

                }
            );

        }
    );


    const resultSheet =
        XLSX.utils.aoa_to_sheet(
            rows
        );


    XLSX.utils.book_append_sheet(

        workbook,

        resultSheet,

        "Election Result"

    );


    /* -----------------------------------------------------
       Export
    ----------------------------------------------------- */

    const buffer =
        XLSX.write(

            workbook,

            {

                bookType: "xlsx",

                type: "array"

            }

        );


    const file = new Blob(

        [buffer],

        {

            type:
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8"

        }

    );


    saveAs(

        file,

        `${result.election}_Result.xlsx`

    );

}