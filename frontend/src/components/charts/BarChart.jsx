import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

import { Bar } from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export default function BarChart({

    labels,

    values,

    title = "Bar Chart",

}) {

    const data = {

        labels,

        datasets: [

            {

                label: "Votes",

                data: values,

                backgroundColor: "#2563eb",

                borderRadius: 6,

            },

        ],

    };

    const options = {

        responsive: true,

        plugins: {

            legend: {

                display: false,

            },

            title: {

                display: true,

                text: title,

                font: {

                    size: 18,

                },

            },

        },

    };

    return (

        <Bar

            data={data}

            options={options}

        />

    );

}