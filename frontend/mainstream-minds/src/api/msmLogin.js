import axios from 'axios';
import { BASE_URL } from '../utils/enums';

const msmLogin = axios.create({
    baseURL: BASE_URL,
    timeout: 13337,
    headers: { 
        'accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
    }
});

export default msmLogin
