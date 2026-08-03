import api from "./api";

const electionService = {

    async getElections(params = {}) {

        const response = await api.get(
            "/elections/",
            {
                params,
            }
        );

        return response.data;

    },

    async getElectionsByURL(url) {

        const response = await api.get(url);

        return response.data;

    },

    async getElectionOptions() {

    const response = await api.get(
        "/elections/",
        {
            params: {
                page_size: 1000,
            },
        }
    );

    return response.data.results;

    },
    async createElection(data) {

        const response = await api.post(
            "/elections/",
            data
        );

        return response.data;

    },

    async updateElection(id, data) {

        const response = await api.put(
            `/elections/${id}/`,
            data
        );

        return response.data;

    },

    async deleteElection(id) {

        const response = await api.delete(
            `/elections/${id}/`
        );

        return response.data;

    },

};

export default electionService;