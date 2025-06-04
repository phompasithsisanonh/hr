import axios from "axios";

const api = axios.create({
    baseURL : 'https://my-worker.kingsatur16.workers.dev/api'
})

export default api