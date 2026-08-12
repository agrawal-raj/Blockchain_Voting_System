import { Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import VerifyOTP from "../pages/auth/VerifyOTP";

import AdminDashboard from "../pages/admin/Dashboard";
import VoterDashboard from "../pages/voter/Dashboard";

import OrganizationPage from "../pages/admin/organizations/OrganizationPage";

import ProtectedRoute from "./ProtectedRoute";
import AdminRoute from "./AdminRoute";
import VoterRoute from "./VoterRoute";

import ElectionPage from "../pages/admin/elections/ElectionPage";
import PositionPage from "../pages/admin/positions/PositionPage";
import CandidatePage from "../pages/admin/candidates/CandidatePage";

import ElectionList from "../pages/voter/Elections/ElectionList";
import ElectionDetails from "../pages/voter/Elections/ElectionDetails";

import VotePage from "../pages/voter/Voting/VotePage";
import VoteSuccess from "../pages/voter/Voting/VoteSuccess";
import VoteHistory from "../pages/voter/VoteHistory";

/* Admin Results */

import ResultDashboard from "../pages/admin/results/ResultDashboard";
import OrganizationResult from "../pages/admin/results/OrganizationResult";
import ElectionResult from "../pages/admin/results/ElectionResult";
import PositionResult from "../pages/admin/results/PositionResult";

/* Voter Results */

import VoterResultDashboard from "../pages/voter/results/ResultsDashboard";
import VoterElectionResult from "../pages/voter/results/ElectionResult";
import VoterPositionResult from "../pages/voter/results/PositionResult";


export default function AppRoutes() {

    return (

        <Routes>

            {/* =====================================================
                PUBLIC ROUTES
            ===================================================== */}

            <Route
                path="/"
                element={
                    <Navigate
                        to="/login"
                        replace
                    />
                }
            />

            <Route
                path="/login"
                element={<Login />}
            />

            <Route
                path="/register"
                element={<Register />}
            />

            <Route
                path="/verify-otp"
                element={<VerifyOTP />}
            />


            {/* =====================================================
                ADMIN DASHBOARD
            ===================================================== */}

            <Route
                path="/admin/dashboard"
                element={
                    <AdminRoute>
                        <AdminDashboard />
                    </AdminRoute>
                }
            />


            {/* =====================================================
                VOTER DASHBOARD
            ===================================================== */}

            <Route
                path="/voter/dashboard"
                element={
                    <VoterRoute>
                        <VoterDashboard />
                    </VoterRoute>
                }
            />


            {/* =====================================================
                ADMIN ORGANIZATIONS
            ===================================================== */}

            <Route
                path="/admin/organizations"
                element={
                    <AdminRoute>
                        <OrganizationPage />
                    </AdminRoute>
                }
            />


            {/* =====================================================
                ADMIN ELECTIONS
            ===================================================== */}

            <Route
                path="/admin/elections"
                element={
                    <AdminRoute>
                        <ElectionPage />
                    </AdminRoute>
                }
            />


            {/* =====================================================
                ADMIN POSITIONS
            ===================================================== */}

            <Route
                path="/admin/positions"
                element={
                    <AdminRoute>
                        <PositionPage />
                    </AdminRoute>
                }
            />


            {/* =====================================================
                ADMIN CANDIDATES
            ===================================================== */}

            <Route
                path="/admin/candidates"
                element={
                    <AdminRoute>
                        <CandidatePage />
                    </AdminRoute>
                }
            />


            {/* =====================================================
                VOTER ELECTIONS
            ===================================================== */}

            <Route
                path="/voter/elections"
                element={
                    <ProtectedRoute roles={["VOTER"]}>
                        <ElectionList />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/voter/elections/:id"
                element={
                    <ProtectedRoute roles={["VOTER"]}>
                        <ElectionDetails />
                    </ProtectedRoute>
                }
            />


            {/* =====================================================
                VOTING
            ===================================================== */}

            <Route
                path="/voter/vote/:positionId"
                element={
                    <ProtectedRoute roles={["VOTER"]}>
                        <VotePage />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/voter/vote-success"
                element={
                    <ProtectedRoute roles={["VOTER"]}>
                        <VoteSuccess />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/voter/vote-history"
                element={
                    <ProtectedRoute roles={["VOTER"]}>
                        <VoteHistory />
                    </ProtectedRoute>
                }
            />

            {/* =====================================================
                ADMIN RESULTS
            ===================================================== */}

            <Route
                path="/admin/results"
                element={
                    <AdminRoute>
                        <ResultDashboard />
                    </AdminRoute>
                }
            />

            <Route
                path="/admin/results/organization/:organizationId"
                element={
                    <AdminRoute>
                        <OrganizationResult />
                    </AdminRoute>
                }
            />

            <Route
                path="/admin/results/election/:electionId"
                element={
                    <AdminRoute>
                        <ElectionResult />
                    </AdminRoute>
                }
            />

            <Route
                path="/admin/results/position/:positionId"
                element={
                    <AdminRoute>
                        <PositionResult />
                    </AdminRoute>
                }
            />


            {/* =====================================================
                VOTER RESULTS
            ===================================================== */}

            <Route
                path="/voter/results"
                element={
                    <VoterRoute>
                        <VoterResultDashboard />
                    </VoterRoute>
                }
            />

            <Route
                path="/voter/results/:electionId"
                element={
                    <VoterRoute>
                        <VoterElectionResult />
                    </VoterRoute>
                }
            />

            <Route
                path="/voter/results/position/:positionId"
                element={
                    <VoterRoute>
                        <VoterPositionResult />
                    </VoterRoute>
                }
            />


            {/* =====================================================
                FALLBACK
            ===================================================== */}

            <Route
                path="*"
                element={
                    <Navigate
                        to="/login"
                        replace
                    />
                }
            />

        </Routes>

    );

}