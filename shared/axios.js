import axios from "axios";

const url =
  process.env.NODE_ENV === "production"
    ? "https://mtec-support.herokuapp.com"
    : "http://localhost:3000";
const axiosInstance = axios.create({
  baseURL: `${url}/support/api/v1`,
  headers: {
    "Content-type": "application/json"
  },
  withCredentials: true
});

export default axiosInstance;
