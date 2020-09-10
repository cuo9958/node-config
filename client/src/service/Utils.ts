import { pathToRegexp } from 'path-to-regexp';
import RouteConfigs from '../route/config';

export default {
    checkUrl(url: string) {
        const curr = RouteConfigs.find((item) => pathToRegexp(item.path).test(url));
        if (!curr) return RouteConfigs[0];
        return curr;
    },
};
