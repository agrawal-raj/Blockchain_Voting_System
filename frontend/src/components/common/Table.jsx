import LoadingSpinner from "./LoadingSpinner";
import EmptyState from "./EmptyState";

export default function Table({

    columns,

    data,

    loading = false,

    renderActions,

}) {

    if (loading) {

        return <LoadingSpinner />;

    }

    if (!loading && data.length === 0) {

        return <EmptyState />;

    }

    return (

        <div className="overflow-x-auto">

            <table className="min-w-full border border-gray-200">

                <thead className="bg-gray-100">

                    <tr>

                        {

                            columns.map((column, index) => (

                                <th

                                    key={column.selector || column.name || index}

                                    className="px-4 py-3 text-left font-semibold"

                                >

                                    {column.label}

                                </th>

                            ))

                        }

                        {

                            renderActions && (

                                <th className="px-4 py-3">

                                    Actions

                                </th>

                            )

                        }

                    </tr>

                </thead>

                <tbody>

                    {

                        data.map((row) => (

                            <tr

                                key={row.id}

                                className="border-t"

                            >

                                {

                                    columns.map((column, index) => (

                                        <td

                                            key={column.selector || column.name || index}

                                            className="px-4 py-3"

                                        >

                                            {

                                                column.render

                                                    ? column.render(row)

                                                    : row[column.key]

                                            }

                                        </td>

                                    ))


                                }

                                {renderActions && (
                                    <td className="px-4 py-3">
                                        {renderActions(row)}
                                    </td>
                                )}



                            </tr>

                        ))

                    }

                </tbody>

            </table>

        </div>

    );

}                                                                                                                                                                                                                                                                                                                                                                                                                                               