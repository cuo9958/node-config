import { observable, action } from 'mobx';

export interface IUser {
    username: string;
    nickname: string;
    token: string;
    headimg: string;
    tell: string;
}

class User {
    @observable username = '';
    @observable nickname = '';
    @observable token = '';
    @observable headimg = '';
    @observable tell = '';

    constructor() {
        this.username = localStorage.getItem('username') || '';
        this.nickname = localStorage.getItem('nickname') || '';
        this.token = localStorage.getItem('token') || '';
        this.headimg = localStorage.getItem('headimg') || '';
        this.tell = localStorage.getItem('tell') || '';
    }
    @action
    test() {}

    @action
    login = (data: IUser) => {
        this.username = data.username;
        this.nickname = data.nickname;
        this.token = data.token;
        this.headimg = data.headimg;
        this.tell = data.tell;
        this.updateCache();
    };

    updateCache() {
        localStorage.setItem('username', this.username);
        localStorage.setItem('nickname', this.nickname);
        localStorage.setItem('token', this.token);
        localStorage.setItem('headimg', this.headimg);
        localStorage.setItem('tell', this.tell);
    }
}
export default new User();
