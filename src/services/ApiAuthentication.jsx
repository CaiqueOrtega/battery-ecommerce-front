import axios from 'axios';

const ApiAuthentication =  axios.create({
    baseURL: 'https://2810-168-205-151-114.ngrok-free.app/auth'
});

export default ApiAuthentication;