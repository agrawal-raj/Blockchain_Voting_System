import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import ProtectedRoute from "./ProtectedRoute";

export default function VoterRoute({ children }) {

    const { user } = useContext(AuthContext);

    return (

        <ProtectedRoute>

            {
                user?.role === "VOTER"

                    ? children

                    : <Navigate to="/dashboard" replace />
            }

        </ProtectedRoute>

    );

}