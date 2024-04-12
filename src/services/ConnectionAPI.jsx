import axios from 'axios';

const ConnectionAPI =  axios.create({
    baseURL: 'https://ad85-168-205-148-248.ngrok-free.app/'
});


export default ConnectionAPI;