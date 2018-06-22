"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const StorageCacheKeyDoesNotExist_1 = require("../core/Storage/Exceptions/StorageCacheKeyDoesNotExist");
class InMemoryStorage {
    constructor() {
        this.storage = {};
    }
    store(hashKey, value) {
        this.storage[hashKey] = value;
    }
    clear(hashKey) {
        delete this.storage[hashKey];
    }
    retrieve(hashKey) {
        if (this.storage[hashKey] === undefined) {
            throw StorageCacheKeyDoesNotExist_1.default;
        }
        return Promise.resolve(this.storage[hashKey]);
    }
}
exports.InMemoryStorage = InMemoryStorage;
