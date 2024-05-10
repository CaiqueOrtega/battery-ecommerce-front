import axios from 'axios';

const ConnectionAPI =  axios.create({
    baseURL: 'https://a412-131-100-146-192.ngrok-free.app/'
});

export default ConnectionAPI;