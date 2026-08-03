export default function Button({

    children,

    type = "button",

    variant = "primary",

    onClick,

    disabled = false,

    className = "",

}) {

    const variants = {

        primary:
            "bg-blue-600 hover:bg-blue-700 text-white",

        secondary:
            "bg-gray-500 hover:bg-gray-600 text-white",

        success:
            "bg-green-600 hover:bg-green-700 text-white",

        danger:
            "bg-red-600 hover:bg-red-700 text-white",

        warning:
            "bg-yellow-500 hover:bg-yellow-600 text-black",

    };

    return (

        <button

            type={type}

            disabled={disabled}

            onClick={onClick}

            className={`

                px-4

                py-2

                rounded-lg

                transition

                font-medium

                disabled:opacity-50

                ${variants[variant]}

                ${className}

            `}

        >

            {children}

        </button>

    );

}