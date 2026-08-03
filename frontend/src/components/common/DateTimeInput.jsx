export default function DateTimeInput({

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

                type="datetime-local"

                {...props}

                className="w-full border rounded-lg px-4 py-2"

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