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
const Core = {
    cache: function (...args) {
        if (typeof args[0] === 'function') {
            const target = args[0];
            const storage = Core.getStorage();
            return function (...targetArgs) {
                return __awaiter(this, void 0, void 0, function* () {
                    const hashKey = generateHashKey_1.default(target.name, targetArgs);
                    try {
                        return yield storage.retrieve(hashKey);
                    }
                    catch (err) {
                        if (err === StorageCacheFailed_1.default) {
                            console.warn(`The Storage provided to Yeezy failed to retrieve the cached value for Hash Key: ${hashKey}`);
                            return yield target(...targetArgs);
                        }
                        else if (err === StorageCacheKeyDoesNotExist_1.default) {
                            const value = yield target(...targetArgs);
                            console.warn(`Yeezy is caching a new value with Hash Key: ${hashKey}`);
                            storage.store(hashKey, value);
                            return value;
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
        // if (typeof args[0] === 'object') {
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
        // if (Core.storage) {
        //     throw { code: 'storage-does-not-implement-interface', message: 'Your global Storage does not correctly implement the IStore interface.' }
        // }
        return Core.storage;
    }
};
//
// import { InMemoryStorage } from "../storage/InMemoryStorage"
//
// const fn = (input: number) => new Promise((resolve) => resolve(input + 1))
//
// const storage = new InMemoryStorage()
// const expiration = 60 * 60 * 24
// Core.configure({ storage, expiration })
//
// const run = async () => {
//     const cfn = Core.cache(fn)
//     console.log('Run #1:', await cfn(1))
//     console.log('Run #2:', await cfn(1))
//     console.log('Run #3:', await cfn(2))
//     console.log('Run #4:', await cfn(1))
//     console.log('Run #5:', await cfn(1))
//     console.log('Run #6:', await cfn(1))
//     console.log('Run #7:', await cfn(1))
//     console.log('Run #8:', await cfn(2))
//     console.log('Run #9:', await cfn(3))
// }
//
// run().then().catch()
exports.default = Core;
