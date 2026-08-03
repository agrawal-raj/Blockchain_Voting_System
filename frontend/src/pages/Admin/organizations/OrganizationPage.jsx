import { useEffect, useState } from "react";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import PageHeader from "../../../components/layout/PageHeader";
import Card from "../../../components/common/Card";
import Button from "../../../components/common/Button";
import SearchBar from "../../../components/common/SearchBar";
import Table from "../../../components/common/Table";
import Pagination from "../../../components/common/Pagination";
import organizationService from "../../../services/organizationService";
import ConfirmModal from "../../../components/common/ConfirmModal";
import Modal from "../../../components/common/Modal";

import OrganizationForm from "./OrganizationForm";

import { toast } from "react-hot-toast";

export default function OrganizationPage() {

    const [organizations, setOrganizations] = useState([]);

    const [loading, setLoading] = useState(false);

    const [search, setSearch] = useState("");

    const [next, setNext] = useState(null);

    const [previous, setPrevious] = useState(null);
    const [openModal, setOpenModal] = useState(false);

    const [saving, setSaving] = useState(false);

    const [editingOrganization, setEditingOrganization] = useState(null);

    const [deleteOrganizationId, setDeleteOrganizationId] = useState(null);

    const loadOrganizations = async (url = null) => {

        try {

            setLoading(true);

            let response;

            if (url) {

                response = await organizationService.getOrganizationsByURL(url);

            } else {

                response = await organizationService.getOrganizations({
                    search,
                });

            }

            setOrganizations(response.results);

            setNext(response.next);

            setPrevious(response.previous);

        } catch (error) {

            console.error(error);

        } finally {

            setLoading(false);

        }

    };

    const createOrganization = async (data) => {

        try {

            setSaving(true);

            await organizationService.createOrganization(data);

            toast.success("Organization created successfully");

            setOpenModal(false);

            loadOrganizations();

        } catch (error) {

            toast.error(

                error.response?.data?.detail ||

                "Unable to create organization"

            );

        } finally {

            setSaving(false);

        }

    };

    const updateOrganization = async (data) => {

        try {

            setSaving(true);

            await organizationService.updateOrganization(
                editingOrganization.id,
                data
            );

            toast.success("Organization updated successfully");

            setEditingOrganization(null);

            setOpenModal(false);

            loadOrganizations();

        } catch (error) {

            toast.error(
                error.response?.data?.detail ||
                "Unable to update organization"
            );

        } finally {

            setSaving(false);

        }

    };

    const removeOrganization = async () => {

        try {

            await organizationService.deleteOrganization(
                deleteOrganizationId
            );

            toast.success("Organization deleted successfully");

            setDeleteOrganizationId(null);

            loadOrganizations();

        } catch (error) {

            toast.error(
                error.response?.data?.detail ||
                "Unable to delete organization"
            );

        }

    };

    useEffect(() => {

        loadOrganizations();

    }, [search]);

    const columns = [

        {
            key: "name",
            label: "Organization",
        },

        {
            key: "code",
            label: "Code",
        },

        {
            key: "email",
            label: "Email",
        },

        {
            key: "phone",
            label: "Phone",
        },

    ];

    return (

        <DashboardLayout>

            <PageHeader

                title="Organizations"

                subtitle="Manage Organizations"

            />

            <Card>

                <div className="flex justify-between mb-5">

                    <SearchBar

                        value={search}

                        onChange={setSearch}

                        placeholder="Search Organization..."

                    />

                    <Button onClick={() => setOpenModal(true)}>

                        + Add Organization

                    </Button>

                </div>

                <Table

                    columns={columns}

                    data={organizations}

                    loading={loading}

                    renderActions={(organization) => (

                        <div className="flex gap-2">

                            <Button

                                variant="warning"

                                onClick={() => {

                                    setEditingOrganization(organization);

                                    setOpenModal(true);

                                }}

                            >

                                Edit

                            </Button>

                            <Button

                                variant="danger"

                                onClick={() =>

                                    setDeleteOrganizationId(
                                        organization.id
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
                        loadOrganizations(previous)
                    }

                    onNext={() =>
                        loadOrganizations(next)
                    }

                />

            </Card>

            <Modal

                open={openModal}

                title={
                    editingOrganization
                        ? "Edit Organization"
                        : "Create Organization"
                }

                onClose={() => {

                    setEditingOrganization(null);

                    setOpenModal(false);

                }}

            >

                <OrganizationForm

                    initialData={editingOrganization}

                    loading={saving}

                    onSubmit={

                        editingOrganization

                            ? updateOrganization

                            : createOrganization

                    }

                />

            </Modal>
            <ConfirmModal

            open={!!deleteOrganizationId}

            title="Delete Organization"

            message="Are you sure you want to delete this organization?"

            onConfirm={removeOrganization}

            onCancel={() => setDeleteOrganizationId(null)}

        />
        </DashboardLayout>

    );

}