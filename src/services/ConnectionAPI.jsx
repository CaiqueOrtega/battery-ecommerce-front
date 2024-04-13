import axios from 'axios';

const ConnectionAPI =  axios.create({
    baseURL: 'https://aea2-168-205-148-248.ngrok-free.app/'
});


export default ConnectionAPI;