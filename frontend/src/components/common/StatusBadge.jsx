export default function StatusBadge({

    status

}) {

    const colors = {

        ACTIVE:
            "bg-green-100 text-green-700",

        DRAFT:
            "bg-yellow-100 text-yellow-700",

        COMPLETED:
            "bg-gray-100 text-gray-700",

        VERIFIED:
            "bg-green-100 text-green-700",

        PENDING:
            "bg-orange-100 text-orange-700",

    };

    return (

        <span

            className={`

                px-3

                py-1

                rounded-full

                text-sm

                font-medium

                ${colors[status] || "bg-gray-100"}

            `}

        >

            {status}

        </span>

    );

}