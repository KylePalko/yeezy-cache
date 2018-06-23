import { InMemoryStorage } from "./storage/InMemoryStorage";
import { IStorage } from "./core/Storage/IStorage";
declare const cache: (...args: any[]) => (...targetArgs: any[]) => any, configure: (options: {
    storage: IStorage;
    expiration: number;
}) => void;
export { cache, configure, InMemoryStorage };
