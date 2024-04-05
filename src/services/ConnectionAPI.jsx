import axios from 'axios';

const ConnectionAPI =  axios.create({
    baseURL: 'https://8392-168-205-151-114.ngrok-free.app/'
});

export default ConnectionAPI;