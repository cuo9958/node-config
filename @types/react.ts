export interface iRouter {
    go(name: string): void;
    goBack(): void;
    push(path: string): void;
    replace(path: string): void;
}
