import axios from "axios";
import { useAuthStore } from "./store/authStore";


const API_URL = "http://localhost:5000/api";

const api = axios.create({
    baseURL:API_URL,
    headers:{
        "Content-Type":"application/json"
    }
})


api.interceptors.request.use((config) =>{
    const token = useAuthStore.getState().token;

    if(token){
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
})

export default api;
