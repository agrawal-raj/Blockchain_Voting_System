import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
} from "chart.js";

import { Pie } from "react-chartjs-2";

ChartJS.register(

    ArcElement,

    Tooltip,

    Legend

);

export default function PieChart({

    labels,

    values,

}) {

    const data = {

        labels,

        datasets: [

            {

                data: values,

                backgroundColor: [

                    "#2563eb",

                    "#16a34a",

                    "#f59e0b",

                    "#dc2626",

                    "#9333ea",

                    "#0891b2",

                    "#ea580c",

                ],

            },

        ],

    };

    return (

        <Pie

            data={data}

        />

    );

}