import axios from '../setup/axios';

const getUsersActive = () => {
    return axios.get('/users');
}

const postLogin = (data) => {
    return axios.post('/login', { ...data });
}

const getAllMessages = (senderId, recipientId) => {
    return axios.get(`/messages/${senderId}/${recipientId}`)
}

export { postLogin, getUsersActive, getAllMessages };