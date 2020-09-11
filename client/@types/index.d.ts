interface IRoute {
    history: IHistory;
    location: ILocation;
    match: any;
}
interface IHistory {
    action: string;
    block(prompt: any): void;
    createHref(location: any): any;
    go(name: string): void;
    goBack(): void;
    goForward(): void;
    length: number;
    listen(listener: any): any;
    push(path: string, state?: any): void;
    replace(path: string, state?: any): void;
}
interface ILocation {
    hash: string;
    pathname: string;
    search: string;
    state: any;
}
interface IMatch {
    isExact: boolean;
    params: any;
    path: string;
    url: string;
}
