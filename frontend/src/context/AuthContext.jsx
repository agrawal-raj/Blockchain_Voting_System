import { createContext, useEffect, useState } from "react";
import authService from "../services/authService";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
    const [registrationEmail, setRegistrationEmail] = useState("");
    const [user, setUser] = useState(null);

    const [loading, setLoading] = useState(true);

    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {

        initializeAuth();

    }, []);

    const initializeAuth = async () => {

        const token = localStorage.getItem("accessToken");

        if (!token) {

            setLoading(false);

            return;

        }

        try {

            const profile = await authService.getProfile();

            setUser(profile);

            setIsAuthenticated(true);

        }

        catch {

            logout();

        }

        finally {

            setLoading(false);

        }

    };

    const login = async (email, password) => {

        const response = await authService.login({

            email,

            password,

        });

        localStorage.setItem(

            "accessToken",

            response.access

        );

        localStorage.setItem(

            "refreshToken",

            response.refresh

        );

        const profile = await authService.getProfile();

        setUser(profile);

        setIsAuthenticated(true);

        return profile;

    };

    const logout = () => {

        localStorage.removeItem("accessToken");

        localStorage.removeItem("refreshToken");

        setUser(null);

        setIsAuthenticated(false);

    };

    const registerUser = async (data) => {

    const response = await authService.register(data);

    setRegistrationEmail(data.email);

    return response;

    };

    const verifyOTP = async (data) => {

    return await authService.verifyOTP(data);

    };

    return (

        <AuthContext.Provider

            value={{

                user,

                loading,

                login,

                logout,

                isAuthenticated,
                registerUser,
                verifyOTP,
                registrationEmail,
                setRegistrationEmail,

            }}

        >

            {children}

        </AuthContext.Provider>

    );

}