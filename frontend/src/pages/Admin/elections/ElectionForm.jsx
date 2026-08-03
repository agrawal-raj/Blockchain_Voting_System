import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import Input from "../../../components/common/Input";
import Select from "../../../components/common/Select";
import Button from "../../../components/common/Button";
import DateTimeInput from "../../../components/common/DateTimeInput";

import organizationService from "../../../services/organizationService";

const formatType = (type) =>
    type
        .toLowerCase()
        .replaceAll("_", " ")
        .replace(/\b\w/g, c => c.toUpperCase());

export default function ElectionForm({

    initialData = null,

    onSubmit,

    loading,

}) {

    const [organizations, setOrganizations] = useState([]);

    const {

        register,

        handleSubmit,

        watch,

        reset,

        formState: { errors },

    } = useForm({

        defaultValues: {

            title: "",

            description: "",

            organization: "",

            election_type: "SCHOOL",

            status: "DRAFT",

            start_date: "",

            end_date: "",

        },

    });

    useEffect(() => {

        loadOrganizations();

    }, []);

    useEffect(() => {

        if (initialData) {

            reset({

                ...initialData,

                start_date: initialData.start_date?.slice(0, 16),

                end_date: initialData.end_date?.slice(0, 16),

            });

        }

    }, [initialData, reset]);

    const loadOrganizations = async () => {

        try {

            const response =
                await organizationService.getOrganizationOptions();

            setOrganizations(

                response.map(org => ({

                    value: org.id,

                    label:
                        `${org.name} (${formatType(org.organization_type)})`

                }))

            );

        } catch (error) {

            console.log(error);

        }

    };

    const startDate = watch("start_date");

    return (

        <form

            onSubmit={handleSubmit(onSubmit)}

            className="space-y-4"

        >

            <Input

                label="Election Title"

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

                    {...register("description", {

                        required:
                            "Description is required",

                    })}

                />

                {

                    errors.description && (

                        <p className="text-red-500 text-sm">

                            {errors.description.message}

                        </p>

                    )

                }

            </div>

            <Select

                label="Organization"

                options={organizations}

                error={errors.organization?.message}

                {...register("organization", {

                    required:
                        "Organization is required",

                })}

            />

            <Select

                label="Election Type"

                {...register("election_type")}

                options={[

                    { value: "CORPORATE", label: "Corporate" },
                    { value: "ACADEMIC", label: "Academic" },
                    { value: "GOVERNMENT", label: "Government" },
                    { value: "SOCIETY", label: "Society / Association" },
                    { value: "NGO", label: "NGO" },
                    { value: "CLUB", label: "Club" },
                    { value: "OTHER", label: "Other" }

                ]}

            />

            <Select

                label="Status"

                {...register("status")}

                options={[

                    {

                        value: "DRAFT",

                        label: "Draft",

                    },

                    {

                        value: "ACTIVE",

                        label: "Active",

                    },

                    {

                        value: "COMPLETED",

                        label: "Completed",

                    },
                    {
                        value: "CANCELLED",
                        label: "Cancelled",
                    }

                ]}

            />

            <DateTimeInput

                label="Start Date"

                error={errors.start_date?.message}

                {...register("start_date", {

                    required: "Start Date is required",

                })}

            />

            <DateTimeInput

                label="End Date"

                error={errors.end_date?.message}

                {...register("end_date", {

                    required: "End Date is required",

                    validate: value =>

                        value > startDate ||

                        "End Date must be after Start Date",

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

                        : "Save Election"

                }

            </Button>

        </form>

    );

}