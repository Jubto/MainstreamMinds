import axios from 'axios';
import { BASE_URL } from '../utils/enums';

const msmAPI = axios.create({
    baseURL: BASE_URL,
    timeout: 13337,
    headers: { 
        'accept': 'application/json',
        'Content-Type': 'application/json'
    }
});

export default msmAPI
