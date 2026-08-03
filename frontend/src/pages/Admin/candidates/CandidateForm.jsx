import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import Input from "../../../components/common/Input";
import Select from "../../../components/common/Select";
import Button from "../../../components/common/Button";

import positionService from "../../../services/positionService";

export default function CandidateForm({

    initialData = null,

    onSubmit,

    loading,

}) {

    const [positions, setPositions] = useState([]);

    const {

        register,

        handleSubmit,

        reset,

        watch,

        formState: { errors },

    } = useForm({

        defaultValues: {

            first_name: "",

            last_name: "",

            gender: "MALE",

            designation: "",

            biography: "",

            manifesto: "",

            position: "",

            election_symbol: null,

            profile_photo: null,

        },

    });

    useEffect(() => {

        loadPositions();

    }, []);

    useEffect(() => {

        if (initialData) {

            reset({

                ...initialData,

                election_symbol: null,

                profile_photo: null,

            });

        }

    }, [initialData, reset]);

    const loadPositions = async () => {

        try {

            const data =
                await positionService.getPositionOptions();

            setPositions(

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

    const submitForm = (data) => {

        const formData = new FormData();

        Object.keys(data).forEach(key => {

            if (

                key === "profile_photo" ||

                key === "election_symbol"

            ) {

                if (data[key][0]) {

                    formData.append(

                        key,

                        data[key][0]

                    );

                }

            }

            else {

                formData.append(

                    key,

                    data[key]

                );

            }

        });

        onSubmit(formData);

    };

    return (

        <form

            onSubmit={handleSubmit(submitForm)}

            className="space-y-4"

        >

            <Input

                label="First Name"

                error={errors.first_name?.message}

                {...register(

                    "first_name",

                    {

                        required:

                            "First name is required",

                    }

                )}

            />

            <Input

                label="Last Name"

                error={errors.last_name?.message}

                {...register(

                    "last_name",

                    {

                        required:

                            "Last name is required",

                    }

                )}

            />

            <Select

                label="Gender"

                {...register("gender")}

                options={[

                    {

                        value: "MALE",

                        label: "Male",

                    },

                    {

                        value: "FEMALE",

                        label: "Female",

                    },

                    {

                        value: "OTHER",

                        label: "Other",

                    },

                ]}

            />

            <Input

                label="Designation"

                {...register("designation")}

            />

            <Select

                label="Position"

                options={positions}

                error={errors.position?.message}

                {...register(

                    "position",

                    {

                        required:

                            "Position is required",

                    }

                )}

            />

            <div>

                <label className="font-medium">

                    Biography

                </label>

                <textarea

                    rows="4"

                    className="w-full border rounded-lg px-4 py-2"

                    {...register("biography")}

                />

            </div>

            <div>

                <label className="font-medium">

                    Manifesto

                </label>

                <textarea

                    rows="4"

                    className="w-full border rounded-lg px-4 py-2"

                    {...register("manifesto")}

                />

            </div>

            <div>

                <label className="font-medium">

                    Profile Photo

                </label>

                <input

                    type="file"

                    accept="image/*"

                    {...register("profile_photo")}

                />

            </div>

            <div>

                <label className="font-medium">

                    Election Symbol

                </label>

                <input

                    type="file"

                    accept="image/*"

                    {...register("election_symbol")}

                />

            </div>

            <Button

                type="submit"

                disabled={loading}

                className="w-full"

            >

                {

                    loading

                        ? "Saving..."

                        : "Save Candidate"

                }

            </Button>

        </form>

    );

}