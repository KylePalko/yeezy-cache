export interface IStorage {
    store(hashKey: string, value: any): void;
    clear(hashKey: string): void;
    retrieve(hashKey: string): Promise<any>;
}
