import api from "./api";

const resultService = {

    async getDashboard() {

        const response = await api.get(
            "/results/dashboard/"
        );

        return response.data;

    },

    async getOrganizationResult(id) {

        const response = await api.get(
            `/results/organization/${id}/`
        );

        return response.data;

    },

    async getElectionResult(id) {

        const response = await api.get(
            `/results/election/${id}/`
        );

        return response.data;

    },

    async getPositionResult(id) {

        const response = await api.get(
            `/results/position/${id}/`
        );

        return response.data;

    },

    async publishResults(id) {
    const response = await api.post(
        `/elections/${id}/publish-results/`
    );

    return response.data;
},

};

export default resultService;