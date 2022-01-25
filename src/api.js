import axios from 'axios';

export default axios.create({
    baseURL : "http://dev1.itpw.ru:8004/",
    headers : {
        'Authorization': localStorage.getItem('token') ? "Bearer " + localStorage.getItem('token') : null,

    }
});