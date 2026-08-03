import { useForm } from "react-hook-form";
import Input from "../../../components/common/Input";
import Select from "../../../components/common/Select";
import Button from "../../../components/common/Button";
import { useEffect } from "react";
export default function OrganizationForm({

    initialData = null,

    onSubmit,

    loading,

}) {

    const {

        register,

        handleSubmit,
        
        reset,

        formState: { errors },

    } = useForm({

        defaultValues:  {

            name: "",

            organization_type: "OTHER",

            email: "",

            phone: "",

            address: "",

            website: "",

        },

    });
    useEffect(() => {

        if (initialData) {

            reset(initialData);

        } else {

            reset({
                name: "",
                organization_type: "OTHER",
                email: "",
                phone: "",
                address: "",
                website: "",
            });

        }

    }, [initialData, reset]);
    const formatType = (type) =>

    type
        .toLowerCase()
        .replace("_", " ")
        .replace(/\b\w/g, c => c.toUpperCase());
    return (

        <form

            onSubmit={handleSubmit(onSubmit)}

            className="space-y-4"

        >

            <Input

                label="Organization Name"

                error={errors.name?.message}

                {...register("name", {

                    required: "Organization name is required",

                })}

            />

            <Select

                label="Organization Type"

                {...register("organization_type")}

                options={[

                    { value: "SCHOOL", label: "School" },

                    { value: "COLLEGE", label: "College" },

                    { value: "COMPANY", label: "Company" },

                    { value: "SOCIETY", label: "Society" },

                    { value: "CLUB", label: "Club" },

                    { value: "GOVERNMENT", label: "Government" },

                    { value: "OTHER", label: "Other" },

                ]}

            />

            <Input

                label="Email"

                type="email"

                {...register("email")}

            />

            <Input

                label="Phone"

                {...register("phone")}

            />

            <Input

                label="Website"

                {...register("website")}

            />

            <div>

                <label className="font-medium">

                    Address

                </label>

                <textarea

                    {...register("address")}

                    className="w-full border rounded-lg px-4 py-2"

                    rows="3"

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

                        : "Save Organization"

                }

            </Button>

        </form>

    );

}