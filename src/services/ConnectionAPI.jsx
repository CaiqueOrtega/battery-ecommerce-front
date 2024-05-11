import axios from 'axios';

const ConnectionAPI =  axios.create({
    baseURL: 'http://localhost:8080/'
});

export default ConnectionAPI;