import axios from "axios";
// https://hrbackend-6pfl.onrender.com
//http://localhost:5000
const api = axios.create({
    baseURL : 'https://hrbackend-6pfl.onrender.com/api'
})

export default api