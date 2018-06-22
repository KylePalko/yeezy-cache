import IStorage from "./Storage/IStorage";
export interface ICore {
    storage?: IStorage;
    expiration?: number;
    getStorage: () => IStorage;
    cache: (functionToCacheOrOptions: any) => () => Promise<any>;
    configure: (options: {
        storage: IStorage;
        expiration: number;
    }) => void;
}
declare const Core: ICore;
export default Core;
