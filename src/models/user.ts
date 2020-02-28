import { observable, action } from 'mobx';
import request from '../services/request';

interface iUser {
    username: string;
    nickname: string;
    token: string;
    headimg: string;
}

class User {
    @observable username = localStorage.getItem('username');
    @observable nickname = localStorage.getItem('nickname');
    @observable token = localStorage.getItem('token');
    @observable headimg = localStorage.getItem('headimg');

    @action login = (db: iUser) => {
        this.username = db.username;
        this.nickname = db.nickname;
        this.token = db.token;
        this.headimg = db.headimg;
        localStorage.setItem('username', db.username);
        localStorage.setItem('nickname', db.nickname);
        localStorage.setItem('token', db.token);
        localStorage.setItem('headimg', db.headimg);
    };

    isLogin = () => {
        return !!this.token;
    };

    @action check = async () => {
        try {
            await request.post('/user/auth');
        } catch (error) {
            localStorage.removeItem('username');
            localStorage.removeItem('nickname');
            localStorage.removeItem('token');
            localStorage.removeItem('headimg');
        }
    };

    getToken() {
        return this.token;
    }
}
export default new User();
