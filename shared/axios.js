import axios from "axios";

const url = "http://localhost:3000";
const axiosInstance = axios.create({
  baseURL: `${url}/support/api`,
  headers: {
    "Content-type": "application/json"
  },
  withCredentials: true
});

export default axiosInstance;
