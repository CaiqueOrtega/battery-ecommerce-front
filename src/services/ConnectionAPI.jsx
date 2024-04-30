import axios from 'axios';

const ConnectionAPI =  axios.create({
    baseURL: 'https://c2c0-168-205-148-130.ngrok-free.app/'
});

export default ConnectionAPI;