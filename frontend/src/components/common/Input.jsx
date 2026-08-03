export default function Input({

    label,

    error,

    ...props

}) {

    return (

        <div className="space-y-1">

            <label className="font-medium">

                {label}

            </label>

            <input

                {...props}

                className="

                    w-full

                    border

                    rounded-lg

                    px-4

                    py-2

                "

            />

            {

                error && (

                    <p className="text-red-500 text-sm">

                        {error}

                    </p>

                )

            }

        </div>

    );

}