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

import PositionForm from "./PositionForm";
import positionService from "../../../services/positionService";

export default function PositionPage() {

    const [positions, setPositions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    const [search, setSearch] = useState("");

    const [next, setNext] = useState(null);
    const [previous, setPrevious] = useState(null);

    const [openModal, setOpenModal] = useState(false);

    const [editingPosition, setEditingPosition] = useState(null);

    const [deleteId, setDeleteId] = useState(null);

    useEffect(() => {

        loadPositions();

    }, [search]);

    const loadPositions = async (url = null) => {

        try {

            setLoading(true);

            let response;

            if (url) {

                response =
                    await positionService.getPositionsByURL(url);

            } else {

                response =
                    await positionService.getPositions({

                        search,

                    });

            }

            setPositions(response.results);

            setNext(response.next);

            setPrevious(response.previous);

        } catch (error) {

            console.log(error);

        } finally {

            setLoading(false);

        }

    };

    const createPosition = async (data) => {

        try {

            setSaving(true);

            await positionService.createPosition(data);

            toast.success("Position Created");

            setOpenModal(false);

            loadPositions();

        } catch (error) {

            toast.error(

                error.response?.data?.detail ||

                "Unable to create position"

            );

        } finally {

            setSaving(false);

        }

    };

    const updatePosition = async (data) => {

        try {

            setSaving(true);

            await positionService.updatePosition(

                editingPosition.id,

                data

            );

            toast.success("Position Updated");

            setEditingPosition(null);

            setOpenModal(false);

            loadPositions();

        } catch (error) {

            toast.error(

                error.response?.data?.detail ||

                "Unable to update position"

            );

        } finally {

            setSaving(false);

        }

    };

    const deletePosition = async () => {

        try {

            await positionService.deletePosition(deleteId);

            toast.success("Position Deleted");

            setDeleteId(null);

            loadPositions();

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

            key: "election_title",

            label: "Election",

        },

        {

            key: "max_candidates",

            label: "Max Candidates",

        },

        {

            key: "max_votes_per_voter",

            label: "Votes / Voter",

        },

        {

            key: "result_type",

            label: "Result Type",

        },

        {

            key: "display_order",

            label: "Order",

        },

    ];

    return (

        <DashboardLayout>

            <PageHeader

                title="Positions"

                subtitle="Manage Election Positions"

            />

            <Card>

                <div className="flex justify-between mb-5">

                    <SearchBar

                        value={search}

                        onChange={setSearch}

                        placeholder="Search Position..."

                    />

                    <Button

                        onClick={() => {

                            setEditingPosition(null);

                            setOpenModal(true);

                        }}

                    >

                        + Add Position

                    </Button>

                </div>

                <Table

                    columns={columns}

                    data={positions}

                    loading={loading}

                    renderActions={(position) => (

                        <div className="flex gap-2">

                            <Button

                                variant="warning"

                                onClick={() => {

                                    setEditingPosition(position);

                                    setOpenModal(true);

                                }}

                            >

                                Edit

                            </Button>

                            <Button

                                variant="danger"

                                onClick={() =>

                                    setDeleteId(position.id)

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

                        loadPositions(previous)

                    }

                    onNext={() =>

                        loadPositions(next)

                    }

                />

            </Card>

            <Modal

                open={openModal}

                title={

                    editingPosition

                        ? "Edit Position"

                        : "Create Position"

                }

                onClose={() => {

                    setEditingPosition(null);

                    setOpenModal(false);

                }}

            >

                <PositionForm

                    initialData={editingPosition}

                    loading={saving}

                    onSubmit={

                        editingPosition

                            ? updatePosition

                            : createPosition

                    }

                />

            </Modal>

            <ConfirmModal

                open={!!deleteId}

                title="Delete Position"

                message="Are you sure you want to delete this position?"

                onConfirm={deletePosition}

                onCancel={() =>

                    setDeleteId(null)

                }

            />

        </DashboardLayout>

    );

}