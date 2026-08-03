import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function exportPositionResultPDF(result) {

    const doc = new jsPDF();

    doc.setFontSize(20);

    doc.text("Blockchain Voting System", 14, 20);

    doc.setFontSize(16);

    doc.text("Position Result Report", 14, 32);

    doc.setFontSize(12);

    doc.text(`Position : ${result.position}`, 14, 46);

    doc.text(`Total Votes : ${result.total_votes}`, 14, 54);

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
            `Percentage : ${result.winner.percentage}%`,
            14,
            78
        );

    }

    autoTable(doc, {

        startY: 90,

        head: [

            [

                "Rank",

                "Candidate",

                "Votes",

                "Percentage"

            ]

        ],

        body: result.candidates.map(

            (candidate, index) => [

                index + 1,

                candidate.candidate,

                candidate.votes,

                `${candidate.percentage}%`

            ]

        )

    });

    doc.save(

        `${result.position}_Result.pdf`

    );

}


export function exportElectionResultPDF(result) {

    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.text("Blockchain Voting System", 14, 20);

    doc.setFontSize(16);
    doc.text("Election Result Report", 14, 32);

    doc.setFontSize(12);

    doc.text(`Election : ${result.election}`, 14, 46);
    doc.text(`Organization : ${result.organization}`, 14, 54);
    doc.text(`Status : ${result.status}`, 14, 62);

    let startY = 75;

    result.positions.forEach((position) => {

        doc.setFontSize(14);

        doc.text(
            `Position : ${position.position}`,
            14,
            startY
        );

        autoTable(doc, {

            startY: startY + 5,

            head: [[
                "Candidate",
                "Votes",
                "Percentage"
            ]],

            body: position.candidates.map(candidate => [

                candidate.candidate,

                candidate.votes,

                `${candidate.percentage}%`

            ])

        });

        startY = doc.lastAutoTable.finalY + 15;

    });

    doc.save(
        `${result.election}_Result.pdf`
    );

}