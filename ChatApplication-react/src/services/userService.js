import axios from '../setup/axios';

const getUsersActive = () => {
    return axios.get('/users');
}

const postLogin = (data) => {
    return axios.post('/login', { ...data });
}

export { postLogin, getUsersActive };