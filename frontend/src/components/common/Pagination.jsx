import Button from "./Button";

export default function Pagination({

    previous,

    next,

    onPrevious,

    onNext,

}) {

    return (

        <div className="flex justify-end gap-3 mt-6">

            <Button

                variant="secondary"

                disabled={!previous}

                onClick={onPrevious}

            >

                Previous

            </Button>

            <Button

                disabled={!next}

                onClick={onNext}

            >

                Next

            </Button>

        </div>

    );

}