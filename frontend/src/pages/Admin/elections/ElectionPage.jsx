import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

import DashboardLayout from "../../../components/layout/DashboardLayout";
import PageHeader from "../../../components/layout/PageHeader";

import Card from "../../../components/common/Card";
import Button from "../../../components/common/Button";
import SearchBar from "../../../components/common/SearchBar";
import Table from "../../../components/common/Table";
import Pagination from "../../../components/common/Pagination";
import Modal from "../../../components/common/Modal";
import ConfirmModal from "../../../components/common/ConfirmModal";
import StatusBadge from "../../../components/common/StatusBadge";

import ElectionForm from "./ElectionForm";

import electionService from "../../../services/electionService";

export default function ElectionPage() {

    const [elections, setElections] = useState([]);

    const [loading, setLoading] = useState(false);

    const [saving, setSaving] = useState(false);

    const [deleting, setDeleting] = useState(false);

    const [search, setSearch] = useState("");

    const [next, setNext] = useState(null);

    const [previous, setPrevious] = useState(null);

    const [openModal, setOpenModal] = useState(false);

    const [editingElection, setEditingElection] =
        useState(null);

    const [deleteElectionId, setDeleteElectionId] =
        useState(null);

    const [deleteElectionData, setDeleteElectionData] =
        useState(null);


    useEffect(() => {

        loadElections();

    }, [search]);


    const loadElections = async (url = null) => {

        try {

            setLoading(true);

            let response;

            if (url) {

                response =
                    await electionService.getElectionsByURL(
                        url
                    );

            } else {

                response =
                    await electionService.getElections({
                        search,
                    });

            }

            setElections(response.results || []);

            setNext(response.next);

            setPrevious(response.previous);

        } catch (error) {

            console.error(
                "Failed to load elections:",
                error
            );

            toast.error(
                error.response?.data?.detail ||
                "Unable to load elections"
            );

        } finally {

            setLoading(false);

        }

    };


    const createElection = async (data) => {

        try {

            setSaving(true);

            await electionService.createElection(
                data
            );

            toast.success(
                "Election created successfully."
            );

            setOpenModal(false);

            setEditingElection(null);

            await loadElections();

        } catch (error) {

            console.error(
                "Create election error:",
                error
            );

            toast.error(
                error.response?.data?.detail ||
                error.response?.data?.message ||
                "Unable to create election"
            );

        } finally {

            setSaving(false);

        }

    };


    const updateElection = async (data) => {

        if (!editingElection) {
            return;
        }

        /*
         * Frontend protection.
         *
         * Backend also enforces this rule, so this is
         * only an additional UX safeguard.
         */
        if (editingElection.is_result_published) {

            toast.error(
                "Published election cannot be modified."
            );

            return;
        }

        try {

            setSaving(true);

            await electionService.updateElection(
                editingElection.id,
                data
            );

            toast.success(
                "Election updated successfully."
            );

            setEditingElection(null);

            setOpenModal(false);

            await loadElections();

        } catch (error) {

            console.error(
                "Update election error:",
                error
            );

            toast.error(
                error.response?.data?.detail ||
                error.response?.data?.message ||
                "Unable to update election"
            );

        } finally {

            setSaving(false);

        }

    };


    const openDeleteConfirmation = (election) => {

        setDeleteElectionId(
            election.id
        );

        setDeleteElectionData(
            election
        );

    };


    const closeDeleteConfirmation = () => {

        if (deleting) {
            return;
        }

        setDeleteElectionId(null);

        setDeleteElectionData(null);

    };


    const deleteElection = async () => {

        if (!deleteElectionId) {
            return;
        }

        try {

            setDeleting(true);

            await electionService.deleteElection(
                deleteElectionId
            );

            toast.success(
                "Election deleted successfully."
            );

            setDeleteElectionId(null);

            setDeleteElectionData(null);

            await loadElections();

        } catch (error) {

            console.error(
                "Delete election error:",
                error
            );

            toast.error(
                error.response?.data?.detail ||
                error.response?.data?.message ||
                "Unable to delete election."
            );

        } finally {

            setDeleting(false);

        }

    };


    const columns = [

        {
            key: "title",
            label: "Title",
        },

        {
            key: "organization_name",
            label: "Organization",
        },

        {
            key: "election_type",
            label: "Type",
        },

        {
            key: "status",
            label: "Status",

            render: (row) => (

                <StatusBadge
                    status={row.status}
                />

            ),

        },

        {
            key: "start_date",
            label: "Start",
        },

        {
            key: "end_date",
            label: "End",
        },

    ];


    return (

        <DashboardLayout>

            <PageHeader
                title="Elections"
                subtitle="Manage Elections"
            />


            <Card>

                <div className="flex justify-between mb-5">

                    <SearchBar
                        value={search}
                        onChange={setSearch}
                        placeholder="Search Election..."
                    />


                    <Button
                        onClick={() => {

                            setEditingElection(null);

                            setOpenModal(true);

                        }}
                    >
                        + Add Election
                    </Button>

                </div>


                <Table

                    columns={columns}

                    data={elections}

                    loading={loading}

                    renderActions={(election) => (

                        <div className="flex gap-2">

                            {/*
                             * Published elections cannot be
                             * modified.
                             *
                             * The backend is still responsible
                             * for enforcing this rule.
                             */}

                            {!election.is_result_published && (

                                <Button

                                    variant="warning"

                                    onClick={() => {

                                        setEditingElection(
                                            election
                                        );

                                        setOpenModal(true);

                                    }}

                                >

                                    Edit

                                </Button>

                            )}


                            <Button

                                variant="danger"

                                onClick={() =>
                                    openDeleteConfirmation(
                                        election
                                    )
                                }

                            >

                                Delete

                            </Button>

                        </div>

                    )}

                />


                <Pagination

                    previous={previous}

                    next={next}

                    onPrevious={() =>
                        loadElections(previous)
                    }

                    onNext={() =>
                        loadElections(next)
                    }

                />

            </Card>


            <Modal

                open={openModal}

                title={
                    editingElection
                        ? "Edit Election"
                        : "Create Election"
                }

                onClose={() => {

                    if (saving) {
                        return;
                    }

                    setEditingElection(null);

                    setOpenModal(false);

                }}

            >

                <ElectionForm

                    initialData={
                        editingElection
                    }

                    loading={saving}

                    onSubmit={
                        editingElection
                            ? updateElection
                            : createElection
                    }

                />

            </Modal>


            <ConfirmModal

                open={
                    !!deleteElectionId
                }

                title="Delete Election"

                message={
                    deleteElectionData
                        ? (
                            deleteElectionData.is_result_published
                                ? (
                                    `This election has published results. ` +
                                    `Deleting "${deleteElectionData.title}" ` +
                                    `will permanently remove the election ` +
                                    `and its related positions, candidates, ` +
                                    `votes, results, and blockchain records. ` +
                                    `This action cannot be undone.`
                                )
                                : (
                                    `Are you sure you want to delete ` +
                                    `"${deleteElectionData.title}"? ` +
                                    `Its related positions, candidates, ` +
                                    `votes, and blockchain records will ` +
                                    `also be removed. This action cannot ` +
                                    `be undone.`
                                )
                        )
                        : "Are you sure you want to delete this election?"
                }

                onConfirm={deleteElection}

                onCancel={
                    closeDeleteConfirmation
                }

                loading={deleting}

            />


        </DashboardLayout>

    );

}