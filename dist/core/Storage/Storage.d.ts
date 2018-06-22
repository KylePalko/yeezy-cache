export default interface Storage {
    cache(key: string, value: string): any;
    clear(key: string): void;
}
