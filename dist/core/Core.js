"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const generateHashKey_1 = require("./Key/generateHashKey");
const StorageCacheFailed_1 = require("./Storage/Exceptions/StorageCacheFailed");
const StorageCacheKeyDoesNotExist_1 = require("./Storage/Exceptions/StorageCacheKeyDoesNotExist");
const InMemoryStorage_1 = require("../storage/InMemoryStorage");
const Core = {
    cache: function (functionToCacheOrOptions) {
        if (typeof arguments[0] === 'function') {
            const target = arguments[0];
            const storage = Core.getStorage();
            return function (...targetArgs) {
                return __awaiter(this, arguments, void 0, function* () {
                    const hashKey = generateHashKey_1.default(target.name, arguments);
                    try {
                        return yield storage.retrieve(hashKey);
                    }
                    catch (err) {
                        if (err === StorageCacheFailed_1.default) {
                            console.warn(`The Storage provided to Yeezy failed to retrieve the cached value for hash key: ${hashKey}`);
                            return Promise.resolve(target(...targetArgs));
                        }
                        else if (err === StorageCacheKeyDoesNotExist_1.default) {
                            const value = target(...targetArgs);
                            console.warn(`Yeezy is caching a new value.`);
                            storage.store(hashKey, value);
                            return Promise.resolve();
                        }
                        else {
                            console.warn(`The Storage provided to Yeezy does not correctly handle exceptions when retrieving values.`);
                            throw 'yeezy-invalid-storage';
                        }
                    }
                });
            };
        }
        console.warn(`Yeezy's cache did not receive a function or option parameter.`);
        throw 'yeezy-invalid-parameters';
        // TODO: Implement cache() function call with options.
        // if (typeof arguments[0] === 'object') {
        //     return Core.cache
        // }
    },
    configure: function ({ storage, expiration }) {
        Core.storage = storage;
        Core.expiration = expiration;
    },
    getStorage: function () {
        if (Core.storage === undefined) {
            throw { code: 'storage-not-set', message: 'You must configure the default Storage or set the Storage option on the cache function call.' };
        }
        if (Core.storage) {
            throw { code: 'storage-does-not-implement-interface', message: 'Your global Storage does not correctly implement the IStore interface.' };
        }
        return Core.storage;
    }
};
const storage = new InMemoryStorage_1.default();
const expiration = 60 * 60 * 24;
Core.configure({ storage, expiration });
const fn = (input) => {
    return input + 1;
};
const cachedFn = Core.cache(fn);
console.log('Run #1', cachedFn(1));
console.log('Run #2', cachedFn(1));
console.log('Run #3', cachedFn(1));
exports.default = Core;
