import axios from 'axios';

const ConnectionAPI =  axios.create({
    baseURL: 'https://efc5-2804-214-85bd-60a6-84c9-1fc1-ada3-55e2.ngrok-free.app/'
});


export default ConnectionAPI;