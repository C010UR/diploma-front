import axios from "axios";

const url = "https://mtec-support.herokuapp.com";
const axiosInstance = axios.create({
  baseURL: `${url}/support/api`,
  headers: {
    "Content-type": "application/json"
  },
  withCredentials: true
});

export default axiosInstance;
