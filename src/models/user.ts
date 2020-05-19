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
        localStorage.setItem('cfg_username', db.username);
        localStorage.setItem('cfg_nickname', db.nickname);
        localStorage.setItem('cfg_token', db.token);
        localStorage.setItem('cfg_headimg', db.headimg);
        console.log(db);
    };

    isLogin = () => {
        this.token = localStorage.getItem('cfg_token');
        return !!this.token;
    };

    @action check = async () => {
        try {
            await request.post('/user/auth');
        } catch (error) {
            console.log('鉴权失败', error);
            localStorage.removeItem('cfg_username');
            localStorage.removeItem('cfg_nickname');
            localStorage.removeItem('cfg_token');
            localStorage.removeItem('cfg_headimg');
        }
    };
}
export default new User();
