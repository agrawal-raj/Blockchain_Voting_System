import DashboardLayout from "../../components/layout/DashboardLayout";
import PageHeader from "../../components/layout/PageHeader";

export default function Dashboard() {

    return (

        <DashboardLayout>

            <PageHeader

                title="Admin Dashboard"

                subtitle="Welcome to Blockchain Voting System"

            />

            <div className="grid grid-cols-4 gap-6">

                <div className="bg-white shadow rounded p-6">

                    Total Elections

                </div>

                <div className="bg-white shadow rounded p-6">

                    Organizations

                </div>

                <div className="bg-white shadow rounded p-6">

                    Candidates

                </div>

                <div className="bg-white shadow rounded p-6">

                    Votes

                </div>

            </div>

        </DashboardLayout>

    );

}