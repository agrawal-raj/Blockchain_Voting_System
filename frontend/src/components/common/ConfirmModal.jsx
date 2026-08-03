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

}) {

    return (

        <Modal

            open={open}

            title={title}

            onClose={onCancel}

        >

            <p className="mb-6">

                {message}

            </p>

            <div className="flex justify-end gap-3">

                <Button

                    variant="secondary"

                    onClick={onCancel}

                >

                    Cancel

                </Button>

                <Button

                    variant="danger"

                    onClick={onConfirm}

                >

                    {confirmText}

                </Button>

            </div>

        </Modal>

    );

}