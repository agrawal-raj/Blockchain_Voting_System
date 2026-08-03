import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import useAuth from "../../hooks/useAuth";

export default function VerifyOTPForm() {

    const navigate = useNavigate();

    const {
        verifyOTP,
        registrationEmail,
    } = useAuth();

    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({

        defaultValues: {

            email: registrationEmail,

        },

    });

    const onSubmit = async (data) => {

        try {

            setLoading(true);

            const response = await verifyOTP(data);

            toast.success(response.message);

            navigate("/login");

        }

        catch (error) {

            const err = error.response?.data;

            if (err?.otp) {

                toast.error(err.otp[0]);

            }

            else if (err?.email) {

                toast.error(err.email[0]);

            }

            else {

                toast.error(

                    err?.message ||

                    "OTP Verification Failed"

                );

            }

        }

        finally {

            setLoading(false);

        }

    };

    return (

        <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">

            <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">

                <h1 className="mb-6 text-center text-3xl font-bold">

                    Verify OTP

                </h1>

                <form

                    onSubmit={handleSubmit(onSubmit)}

                    className="space-y-5"

                >

                    <div>

                        <label>Email</label>

                        <input

                            className="mt-2 w-full rounded border p-3"

                            {...register("email", {

                                required: "Email is required",

                            })}

                        />

                        {errors.email && (

                            <p className="text-sm text-red-600">

                                {errors.email.message}

                            </p>

                        )}

                    </div>

                    <div>

                        <label>OTP</label>

                        <input

                            placeholder="Enter 6 Digit OTP"

                            className="mt-2 w-full rounded border p-3"

                            {...register("otp", {

                                required: "OTP is required",

                                minLength: {

                                    value: 6,

                                    message: "OTP must be 6 digits",

                                },

                            })}

                        />

                        {errors.otp && (

                            <p className="text-sm text-red-600">

                                {errors.otp.message}

                            </p>

                        )}

                    </div>

                    <button

                        disabled={loading}

                        className="w-full rounded bg-green-600 p-3 text-white font-semibold"

                    >

                        {

                            loading

                                ? "Verifying..."

                                : "Verify OTP"

                        }

                    </button>

                </form>

            </div>

        </div>

    );

}