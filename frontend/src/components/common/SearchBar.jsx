export default function SearchBar({

    value,

    onChange,

    placeholder = "Search..."

}) {

    return (

        <input

            type="text"

            value={value}

            onChange={(e) =>

                onChange(e.target.value)

            }

            placeholder={placeholder}

            className="

                w-full

                md:w-72

                border

                rounded-lg

                px-4

                py-2

            "

        />

    );

}