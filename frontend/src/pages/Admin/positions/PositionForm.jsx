import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import Input from "../../../components/common/Input";
import Select from "../../../components/common/Select";
import Button from "../../../components/common/Button";

import electionService from "../../../services/electionService";

export default function PositionForm({

    initialData = null,

    onSubmit,

    loading,

}) {

    const [elections, setElections] = useState([]);

    const {

        register,

        handleSubmit,

        reset,

        formState: { errors },

    } = useForm({

        defaultValues: {

            election: "",

            title: "",

            description: "",

            max_candidates: 1,

            max_votes_per_voter: 1,

            result_type: "SINGLE",

            display_order: 1,

        },

    });

    useEffect(() => {

        loadElections();

    }, []);

    useEffect(() => {

        if (initialData) {

            reset(initialData);

        } else {

            reset({

                election: "",

                title: "",

                description: "",

                max_candidates: 1,

                max_votes_per_voter: 1,

                result_type: "SINGLE",

                display_order: 1,

            });

        }

    }, [initialData, reset]);

    const loadElections = async () => {

        try {

            const data =
                await electionService.getElectionOptions();

            setElections(

                data.map(item => ({

                    value: item.id,

                    label: item.title,

                }))

            );

        }

        catch (error) {

            console.log(error);

        }

    };

    return (

        <form

            onSubmit={handleSubmit(onSubmit)}

            className="space-y-4"

        >

            <Select

                label="Election"

                options={elections}

                error={errors.election?.message}

                {...register("election", {

                    required: "Election is required",

                })}

            />

            <Input

                label="Position Title"

                error={errors.title?.message}

                {...register("title", {

                    required: "Title is required",

                })}

            />

            <div>

                <label className="font-medium">

                    Description

                </label>

                <textarea

                    rows="4"

                    className="w-full border rounded-lg px-4 py-2"

                    {...register("description")}

                />

            </div>

            <Input

                label="Maximum Candidates"

                type="number"

                error={errors.max_candidates?.message}

                {...register("max_candidates", {

                    required: "Required",

                    min: {

                        value: 1,

                        message: "Minimum is 1",

                    },

                })}

            />

            <Input

                label="Maximum Votes Per Voter"

                type="number"

                error={errors.max_votes_per_voter?.message}

                {...register("max_votes_per_voter", {

                    required: "Required",

                    min: {

                        value: 1,

                        message: "Minimum is 1",

                    },

                })}

            />

            <Select

                label="Result Type"

                {...register("result_type")}

                options={[

                    {

                        value: "SINGLE",

                        label: "Single Winner",

                    },

                    {

                        value: "MULTIPLE",

                        label: "Multiple Winners",

                    },

                ]}

            />

            <Input

                label="Display Order"

                type="number"

                {...register("display_order", {

                    required: true,

                })}

            />

            <Button

                type="submit"

                disabled={loading}

                className="w-full"

            >

                {

                    loading

                        ? "Saving..."

                        : "Save Position"

                }

            </Button>

        </form>

    );

}