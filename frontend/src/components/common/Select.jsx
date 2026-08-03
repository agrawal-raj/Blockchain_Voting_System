export default function Select({

    label,

    error,

    options = [],

    ...props

}) {

    return (

        <div className="space-y-1">

            <label className="font-medium">

                {label}

            </label>

            <select

                {...props}

                className="w-full border rounded-lg px-4 py-2"

            >

                <option value="">

                    Select...

                </option>

                {

                    options.map((option) => (

                        <option

                            key={option.value}

                            value={option.value}

                        >

                            {option.label}

                        </option>

                    ))

                }

            </select>

            {

                error && (

                    <p className="text-sm text-red-500">

                        {error}

                    </p>

                )

            }

        </div>

    );

}