import { NavLink } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

export default function Sidebar() {

    const { user } = useContext(AuthContext);

    const adminMenu = [

        { name: "Dashboard", path: "/admin/dashboard" },
        { name: "Organizations", path: "/admin/organizations" },
        { name: "Elections", path: "/admin/elections" },
        { name: "Positions", path: "/admin/positions" },
        { name: "Candidates", path: "/admin/candidates" },
        { name: "Results", path: "/admin/results" },
        { name: "Blockchain", path: "/admin/blockchain" },
        { name: "Audit Logs", path: "/admin/audit" },

    ];

    const voterMenu = [

        { name: "Dashboard", path: "/voter/dashboard" },
        { name: "Available Elections", path: "/voter/elections" },
        { name: "Vote", path: "/voter/vote" },
        { name: "Results", path: "/voter/results" },
        { name: "Profile", path: "/voter/profile" },
        

    ];

    const menu =
        user?.role === "ADMIN"
            ? adminMenu
            : voterMenu;

    return (

        <aside className="w-64 bg-slate-900 text-white">

            <div className="text-2xl font-bold p-6 border-b">

                Voting System

            </div>

            <nav className="p-4 space-y-2">

                {

                    menu.map((item) => (

                        <NavLink

                            key={item.path}

                            to={item.path}

                            className={({ isActive }) =>

                                `block rounded px-4 py-2 transition

                                ${isActive
                                    ? "bg-blue-600"
                                    : "hover:bg-slate-700"
                                }`

                            }

                        >

                            {item.name}

                        </NavLink>

                    ))

                }

            </nav>

        </aside>

    );

}