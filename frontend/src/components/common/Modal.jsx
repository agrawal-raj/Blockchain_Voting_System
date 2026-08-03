export default function Modal({

    open,

    title,

    children,

    onClose,

}) {

    if (!open) return null;

    return (

        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">

            <div className="bg-white rounded-xl w-full max-w-xl p-6">

                <div className="flex justify-between items-center mb-5">

                    <h2 className="text-xl font-bold">

                        {title}

                    </h2>

                    <button

                        onClick={onClose}

                    >

                        ✕

                    </button>

                </div>

                {children}

            </div>

        </div>

    );

}