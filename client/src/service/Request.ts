import Axios from 'axios';
import QS from 'querystring';
import user from '../models/user';

Axios.defaults.timeout = 5000;

const server = Axios.create();

class RequestError extends Error {
    constructor(name: string, code: number) {
        super(name);
        this.code = code;
    }
    code: number;
}

async function _request(url: string, opts: any) {
    if (url.indexOf('http') !== 0) url = '/api_config' + url;
    let res = await server(url, opts);
    _checkStatus(res, url);
    let json = res.data;
    _checkServerStatus(json);
    return json.data;
}
function _checkServerStatus(json: any) {
    if (json.code !== 1) {
        console.log('返回状态报错', json.status);
        throw new RequestError(json.msg, json.status);
    }
}
function _checkStatus(resp: any, url: string) {
    if (resp.status !== 200) {
        throw new Error('网络连接失败，请检查网络');
    }
}
function getHeaders(ispost = false) {
    let headers: any = {};

    headers['token'] = user.token;
    headers['nickname'] = encodeURIComponent(user.nickname);
    headers['username'] = user.username;
    return headers;
}
export async function get(url: string, data: any = {}) {
    if (data) data = QS.stringify(data);
    if (url.indexOf('?') < 0 && data) {
        url += '?' + data;
    } else if (data) {
        url += '&' + data;
    }
    return _request(url, {
        method: 'GET',
        credentials: 'include',
        headers: getHeaders(),
    });
}
export async function post(url: string, data: any = {}) {
    if (data) data = QS.stringify(data);
    if (url.indexOf('?') < 0 && data) {
        url += '?' + data;
    } else if (data) {
        url += '&' + data;
    }
    return _request(url, {
        method: 'POST',
        credentials: 'include',
        headers: getHeaders(true),
        data: data,
    });
}
