import axios from 'axios';

const ConnectionAPI =  axios.create({
    baseURL: 'https://efd3-168-205-148-130.ngrok-free.app/'
});


export default ConnectionAPI;