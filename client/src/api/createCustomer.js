import axios from "axios";

export const createCustomer = async () =>
  axios.post("/customers/", {
    orgId: process.env.REACT_APP_CLIENT_ID || "60950820243fa47248cf3b1f",
  });
export const getCustomer = async (cusId) =>
  axios.get(`/customers/one/${cusId}`, {
    orgId: process.env.REACT_APP_CLIENT_ID || "60950820243fa47248cf3b1f",
  });
