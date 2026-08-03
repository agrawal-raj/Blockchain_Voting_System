import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function DashboardLayout({ children }) {

    return (

        <div className="min-h-screen flex bg-gray-100">

            <Sidebar />

            <div className="flex-1 flex flex-col">

                <Navbar />

                <main className="flex-1 p-6">

                    {children}

                </main>

                <Footer />

            </div>

        </div>

    );

}