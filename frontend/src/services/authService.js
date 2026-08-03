import api from "./api";
import API_ENDPOINTS from "../constants/apiEndpoints";
const authService = {

    async login(data) {
        const response = await api.post(API_ENDPOINTS.LOGIN, data);
        return response.data;
    },

    async register(data) {
        const response = await api.post(API_ENDPOINTS.REGISTER, data);
        return response.data;
    },

    async verifyOTP(data) {
        const response = await api.post(API_ENDPOINTS.VERIFY_OTP, data);
        return response.data;
    },

    async getProfile() {
        const response = await api.get(API_ENDPOINTS.PROFILE);
        return response.data;
    }

};

export default authService;