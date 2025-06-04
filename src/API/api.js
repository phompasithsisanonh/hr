import axios from "axios";

const api = axios.create({
    baseURL : 'https://hrbackend-6pfl.onrender.com/api'
})

export default api