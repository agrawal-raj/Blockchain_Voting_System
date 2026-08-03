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

    const [search, setSearch] = useState("");

    const [next, setNext] = useState(null);

    const [previous, setPrevious] = useState(null);

    const [openModal, setOpenModal] = useState(false);

    const [editingElection, setEditingElection] = useState(null);

    const [deleteElectionId, setDeleteElectionId] = useState(null);

    useEffect(() => {

        loadElections();

    }, [search]);

    const loadElections = async (url = null) => {

        try {

            setLoading(true);

            let response;

            if (url) {

                response =
                    await electionService.getElectionsByURL(url);

            } else {

                response =
                    await electionService.getElections({

                        search,

                    });

            }

            setElections(response.results);

            setNext(response.next);

            setPrevious(response.previous);

        } catch (error) {

            console.log(error);

        } finally {

            setLoading(false);

        }

    };

    const createElection = async (data) => {

        try {

            setSaving(true);

            await electionService.createElection(data);

            toast.success("Election Created");

            setOpenModal(false);

            loadElections();

        } catch (error) {

            toast.error(

                error.response?.data?.detail ||

                "Unable to create election"

            );

        } finally {

            setSaving(false);

        }

    };

    const updateElection = async (data) => {

        try {

            setSaving(true);

            await electionService.updateElection(

                editingElection.id,

                data

            );

            toast.success("Election Updated");

            setEditingElection(null);

            setOpenModal(false);

            loadElections();

        } catch (error) {

            toast.error(

                error.response?.data?.detail ||

                "Unable to update election"

            );

        } finally {

            setSaving(false);

        }

    };

    const deleteElection = async () => {

        try {

            await electionService.deleteElection(

                deleteElectionId

            );

            toast.success("Election Deleted");

            setDeleteElectionId(null);

            loadElections();

        } catch {

            toast.error("Delete failed");

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

            render: row => (

                <StatusBadge status={row.status} />

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

                            <Button

                                variant="warning"

                                onClick={() => {

                                    setEditingElection(election);

                                    setOpenModal(true);

                                }}

                            >

                                Edit

                            </Button>

                            <Button

                                variant="danger"

                                onClick={() =>

                                    setDeleteElectionId(

                                        election.id

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

                    setEditingElection(null);

                    setOpenModal(false);

                }}

            >

                <ElectionForm

                    initialData={editingElection}

                    loading={saving}

                    onSubmit={

                        editingElection

                            ? updateElection

                            : createElection

                    }

                />

            </Modal>

            <ConfirmModal

                open={!!deleteElectionId}

                title="Delete Election"

                message="Are you sure?"

                onConfirm={deleteElection}

                onCancel={() =>

                    setDeleteElectionId(null)

                }

            />

        </DashboardLayout>

    );

}