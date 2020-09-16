import Axios from 'axios';
import QS from 'querystring';

Axios.defaults.timeout = 5000;

const server = Axios.create();

class RequestError extends Error {
    constructor(name: string, status: number) {
        super(name);
        this.status = status;
    }
    status: number;
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
    if (json.status === 4002) {
        console.log('跳转鉴权');
        throw new Error('需要登录才可以哦');
    }
    if (json.status === 403 || json.status === 444) {
        console.log('跳转鉴权');
    }
    if (json.status === 510) {
        console.log('服务器错误');
        throw new Error('响应失败，请稍后再试');
    }
    if (json.status !== 0) {
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

    // headers['uid'] = model.uid;
    // headers['token'] = model.token;
    // headers['nickname'] = encodeURIComponent(model.nickname);
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
