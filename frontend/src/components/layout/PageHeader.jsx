export default function PageHeader({

    title,

    subtitle,
    children,

}) {

    return (
        <div className="flex justify-between items-center mb-6">
        <div>

            <h1 className="text-3xl font-bold">

                {title}

            </h1>

            <p className="text-gray-500">

                {subtitle}

            </p>

        </div>
        {children}
    </div>
    );

}