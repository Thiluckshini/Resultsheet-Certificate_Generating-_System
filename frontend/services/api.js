import axios from "axios";

const API_URL = "http://localhost:5000";

export const login = async (email, password) => {
    return axios.post('${API_URL}/login', {email, password});
};

export const getInstitutes = async () => {
    return axios.get('${API_URL}/institutes');
};