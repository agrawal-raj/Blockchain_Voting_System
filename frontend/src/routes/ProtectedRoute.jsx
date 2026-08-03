import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {

    const {
        loading,
        isAuthenticated
    } = useContext(AuthContext);

    if (loading) {

        return (
            <div className="flex items-center justify-center h-screen">
                Loading...
            </div>
        );

    }

    if (!isAuthenticated) {

        return <Navigate to="/login" replace />;

    }

    return children;

}