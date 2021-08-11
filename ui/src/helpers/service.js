import React, {
    useContext
} from 'react';
import {
    store
} from '../redux/store';
import {
    get as localStorageGet
} from "../helpers/local-storage";

const axios = require("axios");

axios.defaults.baseURL = 'http://localhost:3011' //process.env.REACT_APP_API_URL;
// axios.defaults.headers.common['Authorization'] = `Bearer ${process.env.REACT_APP_API_KEY}`;
axios.defaults.headers.post['Content-Type'] = 'multipart/form-data';

axios.defaults.headers['connectionData'] = JSON.stringify(localStorageGet('connection'));

let dispatchAction;
// const globalState = useContext(store);
// const {
//     dispatch
// } = globalState;

const manageLoading = (status) => {
    dispatchAction && dispatchAction({
        type: 'UPDATE_LOADING_STATUS',
        payload: status
    });
}

axios.interceptors.request.use(function (config) {
    console.log(config, '....config');
    // spinning start to show
    manageLoading(true);
    return config
}, function (error) {
    manageLoading(false);
    return Promise.reject(error);
});

axios.interceptors.response.use(function (response) {
    // spinning hide
    manageLoading(false);
    return response;
}, function (error) {
    manageLoading(false);
    return Promise.reject(error);
});

const get = async ({
    url,
    dispatch = null
}) => {
    if (dispatch) {
        dispatchAction = dispatch;
    }

    return axios
        .get(url);
}

const post = async ({
    url,
    data,
    dispatch = null
}) => {
    if (dispatch) {
        dispatchAction = dispatch;
    }
    return axios.post(url, data);
}

export {
    get,
    post
};