import { IStorage } from "./Storage/IStorage";
export interface ICore {
    defaultStorage?: IStorage;
    targetSpecificStorages: {
        [key: string]: IStorage;
    };
    defaultExpiration?: number;
    targetSpecificExpiration?: {
        [key: string]: number;
    };
    getStorage: (hashKey: string) => IStorage;
    setStorage: (hashKey: string, storage: IStorage) => void;
    cache: (...args: any[]) => (...targetArgs: any[]) => any;
    configure: (options: {
        storage: IStorage;
        expiration: number;
    }) => void;
}
declare const Core: ICore;
export default Core;
