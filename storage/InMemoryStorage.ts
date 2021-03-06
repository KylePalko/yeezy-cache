import { IStorage } from "../core/Storage/IStorage"
import StorageCacheKeyDoesNotExist from "../core/Storage/Exceptions/StorageCacheKeyDoesNotExist"

export class InMemoryStorage implements IStorage {

    private storage: { [key: string]: string } = {}

    store(hashKey: string, value: string) {
        this.storage[hashKey] = value
    }

    clear(hashKey: string) {
        delete this.storage[hashKey]
    }

    retrieve(hashKey: string) {
        if (this.storage[hashKey] === undefined) {
            throw StorageCacheKeyDoesNotExist
        }
        return Promise.resolve(this.storage[hashKey])
    }
}