import api from "./api";

const candidateService = {

    async getCandidates(params = {}) {

        const response = await api.get(
            "/candidates/",
            {
                params,
            }
        );

        return response.data;

    },

    async getCandidatesByURL(url) {

        const response = await api.get(url);

        return response.data;

    },

    async createCandidate(formData) {

        const response = await api.post(

            "/candidates/",

            formData,

            {

                headers: {

                    "Content-Type": "multipart/form-data",

                },

            }

        );

        return response.data;

    },

    async updateCandidate(id, formData) {

        const response = await api.put(

            `/candidates/${id}/`,

            formData,

            {

                headers: {

                    "Content-Type": "multipart/form-data",

                },

            }

        );

        return response.data;

    },

    async deleteCandidate(id) {

        await api.delete(`/candidates/${id}/`);

    },

};

export default candidateService;