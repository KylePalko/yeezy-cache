import { IStorage } from "./Storage/IStorage";
export interface ICore {
    defaultStorage?: IStorage;
    storages: {
        [hashKey: string]: IStorage;
    };
    expiration?: number;
    getStorage: (hashKey: string) => IStorage;
    setStorage: (hashKey: string, storage: IStorage) => void;
    cache: (...args: any[]) => (...targetArgs: any[]) => Promise<any>;
    configure: (options: {
        storage: IStorage;
        expiration: number;
    }) => void;
}
declare const Core: ICore;
export default Core;
