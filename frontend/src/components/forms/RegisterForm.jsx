import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import useAuth from "../../hooks/useAuth";

export default function RegisterForm() {

    const navigate = useNavigate();

    const { registerUser } = useAuth();

    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm();

    const onSubmit = async (data) => {

        try {

            setLoading(true);

            const response = await registerUser(data);

            toast.success(response.message);

            navigate("/verify-otp");

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Registration Failed"
            );

        } finally {

            setLoading(false);

        }

    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">

            <div className="w-full max-w-lg rounded-xl bg-white p-8 shadow-lg">

                <h1 className="mb-6 text-center text-3xl font-bold">
                    Register
                </h1>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-4"
                >

                    <input
                        placeholder="First Name"
                        className="w-full rounded border p-3"
                        {...register("first_name", {
                            required: "First name is required",
                        })}
                    />

                    {errors.first_name && (
                        <p className="text-red-600 text-sm">
                            {errors.first_name.message}
                        </p>
                    )}

                    <input
                        placeholder="Last Name"
                        className="w-full rounded border p-3"
                        {...register("last_name", {
                            required: "Last name is required",
                        })}
                    />

                    <input
                        placeholder="Email"
                        type="email"
                        className="w-full rounded border p-3"
                        {...register("email", {
                            required: "Email is required",
                        })}
                    />

                    <input
                        placeholder="Student ID"
                        className="w-full rounded border p-3"
                        {...register("student_id", {
                            required: "Student ID is required",
                        })}
                    />

                    <input
                        placeholder="Mobile Number"
                        className="w-full rounded border p-3"
                        {...register("mobile_number", {
                            required: "Mobile number is required",
                        })}
                    />

                    <input
                        placeholder="Password"
                        type="password"
                        className="w-full rounded border p-3"
                        {...register("password", {
                            required: "Password is required",
                            minLength: {
                                value: 8,
                                message: "Minimum 8 characters",
                            },
                        })}
                    />

                    <input
                        placeholder="Confirm Password"
                        type="password"
                        className="w-full rounded border p-3"
                        {...register("confirmPassword", {
                            validate: (value) =>
                                value === watch("password") ||
                                "Passwords do not match",
                        })}
                    />

                    {errors.confirmPassword && (
                        <p className="text-red-600 text-sm">
                            {errors.confirmPassword.message}
                        </p>
                    )}

                    <button
                        disabled={loading}
                        className="w-full rounded bg-green-600 p-3 text-white font-semibold"
                    >
                        {loading ? "Creating Account..." : "Register"}
                    </button>

                </form>

            </div>

        </div>
    );

}