import Modal from "./Modal";
import Button from "./Button";

export default function ConfirmModal({

    open,

    title,

    message,

    confirmText = "Delete",

    confirmVariant = "danger",

    onConfirm,

    onCancel,

    loading = false,

}) {

    const handleClose = () => {

        if (loading) {
            return;
        }

        onCancel();

    };


    const handleConfirm = () => {

        if (loading) {
            return;
        }

        onConfirm();

    };

    return (

        <Modal

            open={open}

            title={title}

            onClose={handleClose}

        >

            <p className="mb-6">

                {message}

            </p>

            <div className="flex justify-end gap-3">

                <Button

                    variant="secondary"

                    onClick={handleClose}
                    disabled={loading}

                >

                    Cancel

                </Button>

                <Button

                    variant={confirmVariant}
                    onClick={handleConfirm}
                    disabled={loading}

                >

                    {loading ? "Deleting..." : confirmText}

                </Button>

            </div>

        </Modal>

    );

}