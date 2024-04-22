import axios from 'axios';

const ConnectionAPI =  axios.create({
    baseURL: 'https://0f76-2804-214-85be-96ee-8a2-56a8-8175-3630.ngrok-free.app/'
});


export default ConnectionAPI;