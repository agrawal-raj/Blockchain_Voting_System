import DashboardLayout from "../../components/layout/DashboardLayout";
import PageHeader from "../../components/layout/PageHeader";

export default function Dashboard() {

    return (

        <DashboardLayout>

            <PageHeader

                title="Voter Dashboard"

                subtitle="Welcome to the Blockchain Voting System"

            />

            <div className="grid grid-cols-3 gap-6">

                <div className="bg-white rounded shadow p-6">

                    Available Elections

                </div>

                <div className="bg-white rounded shadow p-6">

                    My Votes

                </div>

                <div className="bg-white rounded shadow p-6">

                    Results

                </div>

            </div>

        </DashboardLayout>

    );

}