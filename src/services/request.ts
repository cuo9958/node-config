import axios from "axios";
import JSON5 from "json5";

axios.defaults.timeout = 5000;

const server = axios.create();

const encoded = (data: any) => {
    if (typeof data === "string") return encodeURIComponent(data);
    if (typeof data === "object") {
        let params = [];
        for (let k in data) {
            if (!data.hasOwnProperty(k)) return;
            params.push(
                `${encodeURIComponent(k)}=${encodeURIComponent(data[k])}`
            );
        }
        return params.join("&");
    }
    return data;
};
class RequestError extends Error {
    constructor(name: string, status: number, msg: string) {
        super(name);
        this.status = status;
        this.msg = msg;
    }
    status: number;
    msg: string;
}
/**
 * 自定义请求库
 */
class Request {
    async _fetch(url: string, opts: any) {
        let res;
        try {
            opts.url = url;
            res = await server(opts);
        } catch (e) {
            console.warn("网络错误", e);
            throw new Error("网络连接失败，请检查网络权限");
        }
        return res;
    }
    async _request(url: string, opts: any) {
        if (url.indexOf("http") !== 0) url = "/api_config" + url;
        let res = await this._fetch(url, opts);
        this._checkStatus(res, url);
        let json = res.data;
        this._checkServerStatus(json);
        return json.data;
    }
    _checkStatus(resp: any, url: string) {
        if (resp.status !== 200) {
            throw new Error("网络连接失败，请检查网络");
        }
    }
    async _parseJSON(resp: any) {
        let json = {};
        try {
            const txt = resp.data;
            json = JSON5.parse(txt);
        } catch (e) {
            console.warn("响应数据格式错误", e);
            throw new Error("连接失败，请重试");
        }
        return json;
    }
    _checkServerStatus(json: any) {
        if (json.status === 4002) {
            console.log("跳转鉴权");
            throw new Error("需要登录才可以哦");
        }
        if (json.status === 403 || json.status === 444) {
            console.log("跳转鉴权");
        }
        if (json.status === 510) {
            console.log("服务器错误");
            throw new Error("响应失败，请稍后再试");
        }
        if (json.status !== 0) {
            console.log("返回状态报错", json.status);
            throw new RequestError(json.msg, json.status, json.data);
        }
    }
    getHeaders(ispost = false) {
        let headers: any = {};
        // if (ispost) {
        //     headers["Content-Type"] = "application/x-www-form-urlencoded";
        // }
        return headers;
    }

    async get(url: string, data: any = {}) {
        if (data) data = encoded(data);
        if (url.indexOf("?") < 0 && data) {
            url += "?" + data;
        } else if (data) {
            url += "&" + data;
        }
        return this._request(url, {
            method: "GET",
            credentials: "include",
            headers: this.getHeaders()
        });
    }

    async post(url: string, data: any = {}) {
        return this._request(url, {
            method: "POST",
            credentials: "include",
            headers: this.getHeaders(true),
            data: encoded(data)
        });
    }
}

export default new Request();
