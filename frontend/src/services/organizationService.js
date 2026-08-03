import api from "./api";

const organizationService = {

    async getOrganizations(params = {}) {

        const response = await api.get(
            "/organizations/",
            {
                params,
            }
        );

        return response.data;

    },

    async getOrganizationsByURL(url) {

    const response = await api.get(url);

    return response.data;

    },

    async getOrganizationOptions() {

    const response = await api.get("/organizations/", {
        params: {
            page_size: 1000,
        },
    });

    return response.data.results;

    },

    async createOrganization(data) {

        const response = await api.post(
            "/organizations/",
            data
        );

        return response.data;

    },

    async updateOrganization(id, data) {

        const response = await api.put(
            `/organizations/${id}/`,
            data
        );

        return response.data;

    },

    async deleteOrganization(id) {

        const response = await api.delete(
            `/organizations/${id}/`
        );

        return response.data;

    },

};

export default organizationService;