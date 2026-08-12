import api from "./api";


const votingService = {

    async getAvailableElections() {

        const response =
            await api.get(
                "/voting/elections/"
            );

        return response.data;

    },


    async getElectionDetails(id) {

        const response =
            await api.get(
                `/voting/elections/${id}/`
            );

        return response.data;

    },


    async getCandidates(positionId) {

        const response =
            await api.get(
                `/voting/positions/${positionId}/candidates/`
            );

        return response.data;

    },


    async castVote(candidateId) {

        const response =
            await api.post(
                "/voting/cast/",
                {
                    candidate: candidateId,
                }
            );

        return response.data;

    },


    async getVoteHistory() {

        const response =
            await api.get(
                "/voting/history/"
            );

        return response.data;

    },


    async verifyVoteBlockchain(voteId) {

        const response =
            await api.get(
                `/voting/history/${voteId}/verify/`
            );

        return response.data;

    },

};


export default votingService;