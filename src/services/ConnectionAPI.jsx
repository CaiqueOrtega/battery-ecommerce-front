import axios from 'axios';

const ConnectionAPI =  axios.create({
    baseURL: 'https://4b57-131-100-144-22.ngrok-free.app/'
});

export default ConnectionAPI;