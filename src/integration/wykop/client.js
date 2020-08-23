import axios from 'axios';
import queryString from 'querystring';
import { calculateMd5Hash } from "../../util/md5-hash-calculator.js";

const API_KEY = process.env.WYKOP_API_KEY;
const API_SECRET = process.env.WYKOP_API_SECRET;
const API_ACCOUNT_KEY = process.env.WYKOP_API_ACCOUNT_KEY;
const API_ACCOUNT_NAME = process.env.WYKOP_API_ACCOUNT_NAME;
const API_BASE_URI = 'https://a2.wykop.pl/';
const API_PATH_CLEAR_OUTPUT = '/output/clear';
const API_PATH_APP_KEY = '/appkey/' + API_KEY;
const HEADER_API_SIGN = 'apisign';

const fetchHotPosts = async (page = 1) => {
    const query = API_BASE_URI + 'Entries/Hot/page/' + page + API_PATH_APP_KEY + API_PATH_CLEAR_OUTPUT;

    return axios.get(query, getAuthHeaders(query));
}

const fetchActivePosts = async (page = 1) => {
    const query = API_BASE_URI + 'Entries/Active/page/' + page + API_PATH_APP_KEY + API_PATH_CLEAR_OUTPUT;

    return axios.get(query, getAuthHeaders(query));
}

const fetchSingleEntry = async (entryId) => {
    const query = API_BASE_URI + 'Entries/Entry/' + entryId + API_PATH_APP_KEY + API_PATH_CLEAR_OUTPUT;

    return axios.get(query, getAuthHeaders(query));
}

const getUserKey = async () => {
    const query = API_BASE_URI + 'Login/Index' + API_PATH_APP_KEY;
    const postParams = {
        accountkey: API_ACCOUNT_KEY,
        login: API_ACCOUNT_NAME,
    };

    return axios.post(query, queryString.stringify(postParams), getAuthHeaders(query, postParams))
        .then(res => res.data.data.userkey)
        .catch(() => null);
}

const getAuthHeaders = (query, postParams = {}) => {
    return {
        headers: {
            [HEADER_API_SIGN]: calculateMd5Hash(API_SECRET, query, Object.values(postParams).join(',')),
        }
    };
}

export default {
    fetchActivePosts,
    fetchHotPosts,
    fetchSingleEntry,
    getUserKey
}