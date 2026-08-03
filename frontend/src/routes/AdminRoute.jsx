import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import ProtectedRoute from "./ProtectedRoute";

export default function AdminRoute({ children }) {

    const { user } = useContext(AuthContext);

    return (

        <ProtectedRoute>

            {
                user?.role === "ADMIN"

                    ? children

                    : <Navigate to="/dashboard" replace />
            }

        </ProtectedRoute>

    );

}