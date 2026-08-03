import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import useAuth from "../../hooks/useAuth";

export default function LoginForm() {
    const navigate = useNavigate();

    const { login } = useAuth();

    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = async (data) => {
        try {
            setLoading(true);

            const user = await login(
                data.email,
                data.password
            );

            toast.success("Login Successful");

            if (user.role === "ADMIN") {
                navigate("/admin/dashboard");
            } else {
                navigate("/voter/dashboard");
            }
        } catch (error) {
            toast.error(
                error.response?.data?.detail ||
                error.response?.data?.message ||
                "Login Failed"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
            <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">

                <h1 className="mb-6 text-center text-3xl font-bold">
                    Login
                </h1>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-5"
                >

                    <div>
                        <label className="mb-2 block font-medium">
                            Email
                        </label>

                        <input
                            type="email"
                            placeholder="Enter Email"
                            className="w-full rounded border p-3"
                            {...register("email", {
                                required: "Email is required",
                            })}
                        />

                        {errors.email && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.email.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="mb-2 block font-medium">
                            Password
                        </label>

                        <input
                            type="password"
                            placeholder="Enter Password"
                            className="w-full rounded border p-3"
                            {...register("password", {
                                required: "Password is required",
                            })}
                        />

                        {errors.password && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.password.message}
                            </p>
                        )}
                    </div>

                    <button
                        disabled={loading}
                        className="w-full rounded bg-blue-600 p-3 font-semibold text-white hover:bg-blue-700 disabled:bg-gray-400"
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>

                </form>

            </div>
        </div>
    );
}