import axios from '~/config/axios.js';

// =============================================================================
// HANDLE SIGNUP
export const postSignUp = (userData) => {
    return axios.post(`/api/signup`, userData);
};

// HANDLE SIGNIN
export const postSignIn = (userData) => {
    return axios.post(`/api/signin`, userData);
};

// HANDLE CHANGE PASSWORD
export const postChangePassword = (userData) => {
    return axios.post(`/api/change-password`, userData);
};

// =============================================================================
// CRUD USER INFORMATION

export const readUserInformation = (userId) => {
    return axios.get(`/api/get-user-information?userId=${userId}`);
};

export const updateUserInformation = (data) => {
    return axios.put('/api/put-user-information', data);
};

// =============================================================================
// CRUD PRODUCT

export const createProduct = (userId) => {
    return axios.post(`/api/post-product?userId=${userId}`);
};

export const readProductList = (userId) => {
    return axios.get(`/api/get-product-list?userId=${userId}`);
};

export const updateProduct = (data) => {
    return axios.put(`/api/put-product`, data);
};

export const deleteProduct = (productId) => {
    return axios.delete(`/api/delete-product?productId=${productId}`);
};

export const moveProduct = (data) => {
    return axios.put(`/api/move-product`, data);
};

// =============================================================================
// CRUD TECHNOLOGY

export const readTechnology = (data) => {
    return axios.get(`/api/get-technology`, data);
};

export const createTechnology = (data) => {
    return axios.post('/api/post-technology', data);
};

export const updateTechnology = (data) => {
    return axios.put('/api/put-technology', data);
};

export const deleteTechnology = (technologyId, label) => {
    return axios.delete(`/api/delete-technology?technologyId=${technologyId}&&label=${label}`);
};
