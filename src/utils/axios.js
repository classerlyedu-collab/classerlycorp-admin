import axios from "axios";

import endPoints from "../constant/apiEndpoint";

// setup base thing
const apiRequest = axios.create({
  baseURL: endPoints.BASE_URL,
  responseType: "json",
  headers: {
    "Content-Type": "application/json",
  },
});

apiRequest.interceptors.response.use(
  (response) => {
    if (response.status === 200 || response.status === 201) {
      if (response?.data?.success) {
        return Promise.resolve(response?.data);
      } else {
        // toast.error(response.data.message);
        return Promise.reject(response?.data?.message);
      }
    }
  },
  (error) => {
    if (error.response) {
      // Handle specific response errors here
      if (error.response.status === 401) {
        if (typeof window !== 'undefined') {
          localStorage.removeItem("userData");
        }
      }
      // Return the error message instead of the full response object
      return Promise.reject(error.response?.data?.message || error.response?.statusText || 'An error occurred');
    } else {
      // Handle errors without a response, like network errors
      console.error("Network or server error:", error.message);
      return Promise.reject(error.message || 'Network error occurred');
    }
  }
);


export default apiRequest;
