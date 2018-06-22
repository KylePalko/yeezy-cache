import IStorage from "../core/Storage/IStorage";
declare class InMemoryStorage implements IStorage {
    private storage;
    store(hashKey: string, value: string): void;
    clear(hashKey: string): void;
    retrieve(hashKey: string): Promise<string>;
}
export { InMemoryStorage };
