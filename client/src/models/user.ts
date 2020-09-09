import { observable, action } from 'mobx';

interface iUser {
    username: string;
    nickname: string;
    token: string;
    headimg: string;
    uid: string;
}

class User {
    @observable
    nickname = 'test';

    @observable
    headimg = '';

    constructor() {
        const model: any = {};
        // this.nickname = model.nickname;
        this.headimg = model.headimg;
    }
    @action
    test() {}
}
export default new User();
