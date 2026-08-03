import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export function exportPositionResultExcel(result) {

    const rows = result.candidates.map((candidate, index) => ({

        Rank: index + 1,

        Candidate: candidate.candidate,

        Votes: candidate.votes,

        Percentage: `${candidate.percentage}%`,

    }));

    const worksheet = XLSX.utils.json_to_sheet(rows);

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        "Position Result"
    );

    const excelBuffer = XLSX.write(
        workbook,
        {
            bookType: "xlsx",
            type: "array",
        }
    );

    const file = new Blob(
        [excelBuffer],
        {
            type:
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
        }
    );

    saveAs(
        file,
        `${result.position}_Result.xlsx`
    );

}


export function exportElectionResultExcel(result) {

    const rows = [];

    result.positions.forEach(position => {

        position.candidates.forEach(candidate => {

            rows.push({

                Position: position.position,

                Candidate: candidate.candidate,

                Votes: candidate.votes,

                Percentage: `${candidate.percentage}%`

            });

        });

    });

    const worksheet =
        XLSX.utils.json_to_sheet(rows);

    const workbook =
        XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(

        workbook,

        worksheet,

        "Election Result"

    );

    const buffer =
        XLSX.write(workbook, {

            bookType: "xlsx",

            type: "array"

        });

    saveAs(

        new Blob([buffer]),

        `${result.election}_Result.xlsx`

    );

}