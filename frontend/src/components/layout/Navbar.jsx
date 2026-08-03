import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
export default function Navbar() {
    const navigate = useNavigate();

    const handleLogout = () => {

        logout();

        navigate("/login");

    };
    const {

        user,

        logout

    } = useContext(AuthContext);

    return (

        <header className="bg-white shadow px-6 py-4 flex justify-between items-center">

            <h2 className="text-xl font-semibold">

                Blockchain Voting System

            </h2>

            <div className="flex items-center gap-4">

                <span>

                    {user?.first_name} {user?.last_name}

                </span>

                <button

                    onClick={handleLogout}

                    className="bg-red-500 text-white px-4 py-2 rounded"

                >

                    Logout

                </button>

            </div>

        </header>

    );

}