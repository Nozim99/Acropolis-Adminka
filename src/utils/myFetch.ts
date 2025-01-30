import axios from "axios";
import {BASE_URL} from "./constants.ts";


interface ArgTypes {
    endpoint: string;
    method?: string;
    data?: any;
    cType?: string;
}

export const myFetch = ({endpoint, method, data, cType}: ArgTypes) => {
    const token = localStorage.getItem("token");

    if (method === 'post') {
        return axios.post(BASE_URL + endpoint, data, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': cType || 'application/json'
            }
        });
    }

    return axios.get(BASE_URL + endpoint, {headers: {Authorization: `Bearer ${token}`}});
}