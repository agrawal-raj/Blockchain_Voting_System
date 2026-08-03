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

import CandidateForm from "./CandidateForm";

import candidateService from "../../../services/candidateService";

export default function CandidatePage() {

    const [candidates, setCandidates] = useState([]);

    const [loading, setLoading] = useState(false);

    const [saving, setSaving] = useState(false);

    const [search, setSearch] = useState("");

    const [next, setNext] = useState(null);

    const [previous, setPrevious] = useState(null);

    const [openModal, setOpenModal] = useState(false);

    const [editingCandidate, setEditingCandidate] = useState(null);

    const [deleteId, setDeleteId] = useState(null);

    useEffect(() => {

        loadCandidates();

    }, [search]);


    const loadCandidates = async (url = null) => {

        try {

            setLoading(true);

            let response;

            if (url) {

                response =
                    await candidateService.getCandidatesByURL(url);

            } else {

                response =
                    await candidateService.getCandidates({

                        search,

                    });

            }
            // console.log("API Response:", response);
            // console.log("Results:", response.results);
            setCandidates(response.results);

            setNext(response.next);

            setPrevious(response.previous);

        }

        catch (error) {

            console.log(error);

            toast.error("Unable to load candidates");

        }

        finally {

            setLoading(false);

        }

    };


    const createCandidate = async (formData) => {

        try {

            setSaving(true);

            await candidateService.createCandidate(formData);

            toast.success("Candidate Created");

            setOpenModal(false);

            loadCandidates();

        }

        catch (error) {

            console.log(error.response?.data);

            toast.error(

                error.response?.data?.detail ||

                "Unable to create candidate"

            );

        }

        finally {

            setSaving(false);

        }

    };
    const updateCandidate = async (formData) => {

        try {

            setSaving(true);

            await candidateService.updateCandidate(

                editingCandidate.id,

                formData

            );

            toast.success("Candidate Updated");

            setEditingCandidate(null);

            setOpenModal(false);

            loadCandidates();

        }

        catch (error) {

            console.log(error.response?.data);

            toast.error(

                error.response?.data?.detail ||

                "Unable to update candidate"

            );

        }

        finally {

            setSaving(false);

        }

    };

    const deleteCandidate = async () => {

        try {

            await candidateService.deleteCandidate(deleteId);

            toast.success("Candidate Deleted");

            setDeleteId(null);

            loadCandidates();

        }

        catch {

            toast.error("Delete failed");

        }

    }
    const columns = [

        {
            label: "Photo",
            render: (row) => (
                row.photo ? (
                    <img
                        src={row.photo}
                        alt={row.full_name}
                        className="w-12 h-12 rounded-full object-cover"
                    />
                ) : (
                    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                        N/A
                    </div>
                )
            ),
        },

        {
            label: "Candidate",
            key: "full_name",
        },

        {
            label: "Position",
            key: "position_name",
        },

        {
            label: "Election",
            key: "election_name",
        },

        {
            label: "Organization",
            key: "organization_name",
        },

        {
            label: "Gender",
            key: "gender",
        },

        {
            label: "Designation",
            key: "designation",
        },


        {
            name: "Actions",

            cell: row => (

                <div className="flex gap-2">

                    <Button

                        size="sm"

                        onClick={() => {

                            setEditingCandidate(row);

                            setOpenModal(true);

                        }}

                    >

                        Edit

                    </Button>

                    <Button

                        variant="danger"

                        size="sm"

                        onClick={() =>

                            setDeleteId(row.id)

                        }

                    >

                        Delete

                    </Button>

                </div>

            ),
        },

    ];
    return (

        <DashboardLayout>

            <PageHeader

                title="Candidates"

                subtitle="Manage election candidates"

            >

                <Button

                    onClick={() => {

                        setEditingCandidate(null);

                        setOpenModal(true);

                    }}

                >

                    Add Candidate

                </Button>

            </PageHeader>

            <Card>

                <div className="mb-4">

                    <SearchBar

                        value={search}

                        onChange = {setSearch}


                        placeholder="Search Candidate"

                    />

                </div>
                {/* <pre>
                    {JSON.stringify(candidates, null, 2)}
                            </pre> */}
                <Table
    columns={columns}
    data={candidates}
    loading={loading}
    renderActions={(row) => (
        <div className="flex gap-2">

            <Button
                size="sm"
                onClick={() => {
                    setEditingCandidate(row);
                    setOpenModal(true);
                }}
            >
                Edit
            </Button>

            <Button
                variant="danger"
                size="sm"
                onClick={() => setDeleteId(row.id)}
            >
                Delete
            </Button>

        </div>
    )}
/>

                <Pagination

                    next={next}

                    previous={previous}

                    onNext={() =>

                        loadCandidates(next)

                    }

                    onPrevious={() =>

                        loadCandidates(previous)

                    }

                />

            </Card>

            <Modal

                open={openModal}

                onClose={() => {

                    setOpenModal(false);

                    setEditingCandidate(null);

                }}

                title={

                    editingCandidate

                        ? "Edit Candidate"

                        : "Add Candidate"

                }

            >

                <CandidateForm

                    initialData={editingCandidate}

                    loading={saving}

                    onSubmit={

                        editingCandidate

                            ? updateCandidate

                            : createCandidate

                    }

                />

            </Modal>

            <ConfirmModal

                open={!!deleteId}

                title="Delete Candidate"

                message="Are you sure you want to delete this candidate?"

                onConfirm={deleteCandidate}

                onCancel={() =>

                    setDeleteId(null)

                }

            />

        </DashboardLayout>

    );

};