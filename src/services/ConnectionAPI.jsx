import axios from 'axios';

const ConnectionAPI =  axios.create({
    baseURL: 'https://59c4-2804-389-c058-8fd6-8126-11d4-3921-aeec.ngrok-free.app/'
});

export default ConnectionAPI;