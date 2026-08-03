import api from "./api";

const positionService = {

    async getPositions(params = {}) {

        const response = await api.get(
            "/positions/",
            {
                params,
            }
        );

        return response.data;

    },

    async getPositionsByURL(url) {

        const response = await api.get(url);

        return response.data;

    },

    async getPositionOptions() {

    const response = await api.get(

        "/positions/",

        {

            params: {

                page_size: 1000,

            },

        }

    );

    return response.data.results;

    },
    async createPosition(data) {

        const response = await api.post(
            "/positions/",
            data
        );

        return response.data;

    },

    async updatePosition(id, data) {

        const response = await api.put(
            `/positions/${id}/`,
            data
        );

        return response.data;

    },

    async deletePosition(id) {

        await api.delete(
            `/positions/${id}/`
        );

    },

};

export default positionService;