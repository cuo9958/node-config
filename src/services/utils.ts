import PathRegexp from "path-to-regexp";
import url_configs from "../routes/config";
import urlParse from "url-parse";

function DateFormart(time: Date, formart = "yyyy-MM-dd hh:mm:ss") {
    formart = formart.replace("yyyy", time.getFullYear() + "");
    formart = formart.replace("MM", (time.getMonth() + 1 + "").padStart(2, "0"));
    formart = formart.replace("dd", (time.getDate() + "").padStart(2, "0"));
    formart = formart.replace("hh", (time.getHours() + "").padStart(2, "0"));
    formart = formart.replace("mm", (time.getMinutes() + "").padStart(2, "0"));
    formart = formart.replace("ss", (time.getSeconds() + "").padStart(2, "0"));
    return formart;
}

export default {
    checkUrl(url: string) {
        const curr = url_configs.find(item => PathRegexp(item.path).test(url));
        if (!curr) return url_configs[0];
        return curr;
    },
    parseParams(url: string) {
        return urlParse(url, true);
    },
    DateFormartNumber: (ts: number, formart = "yyyy-MM-dd hh:mm:ss") => {
        if (!ts || isNaN(ts)) return "";
        const time = new Date(ts);
        return DateFormart(time, formart);
    },
    DateFormartString: (ts: string, formart = "yyyy-MM-dd hh:mm:ss") => {
        const time = new Date(ts);
        return DateFormart(time, formart);
    }
};
