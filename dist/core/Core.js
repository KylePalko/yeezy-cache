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
const isPromise_1 = require("./Helpers/isPromise");
const Core = {
    defaultStorage: undefined,
    targetSpecificStorages: {},
    defaultExpiration: undefined,
    targetSpecificExpiration: {},
    cache: function (...args) {
        if (typeof args[0] === 'function') {
            const target = args[0];
            return function (...targetArgs) {
                return __awaiter(this, void 0, void 0, function* () {
                    const key = target.name;
                    const hashKey = generateHashKey_1.default(key, targetArgs);
                    const storage = Core.getTargetStorage(key);
                    try {
                        return yield storage.retrieve(hashKey);
                    }
                    catch (err) {
                        if (err === StorageCacheFailed_1.default || err === StorageCacheKeyDoesNotExist_1.default) {
                            if (isPromise_1.default(target)) {
                                try {
                                    const result = yield target(...targetArgs);
                                    try {
                                        storage.store(hashKey, result);
                                    }
                                    catch (err) {
                                        console.warn(`The Storage provided to Yeezy failed to store a result for ${key}`);
                                    }
                                    return Promise.resolve(result);
                                }
                                catch (err) {
                                    return Promise.reject(err);
                                }
                            }
                            try {
                                const result = target(...targetArgs);
                                try {
                                    storage.store(hashKey, result);
                                }
                                catch (err) {
                                    console.warn(`The Storage provided to Yeezy failed to store a result.`);
                                }
                                return Promise.resolve(result);
                            }
                            catch (err) {
                                return Promise.reject(err);
                            }
                        }
                        else {
                            console.warn(`The Storage provided to Yeezy does not correctly handle exceptions when retrieving values.`);
                            throw 'yeezy-invalid-storage';
                        }
                    }
                });
            };
        }
        if (typeof args[0] === 'object') {
            const { storage: optionStorage, key: optionKey } = args[0];
            return function (...args) {
                const target = args[0];
                let key;
                if (optionKey !== undefined) {
                    key = optionKey === undefined ? target.name : optionKey;
                }
                if (optionStorage !== undefined) {
                    Core.setTargetStorage(key, optionStorage);
                }
                return Core.cache({ [key]: (...args) => target(...args) }[key]);
            };
        }
        console.warn(`Yeezy did not receive a function or option parameter.`);
        throw 'yeezy-invalid-parameters';
    },
    configure: function ({ storage, expiration }) {
        if (storage === undefined || storage === null || storage.store === undefined || storage.clear === undefined || storage.retrieve === undefined) {
            throw { code: 'storage-does-not-implement-interface', message: 'Your default Storage does not correctly implement the IStorage interface.' };
        }
        Core.defaultStorage = storage;
        Core.defaultExpiration = expiration;
    },
    getTargetStorage: function (key) {
        if (Core.targetSpecificStorages[key] !== undefined) {
            return Core.targetSpecificStorages[key];
        }
        if (Core.defaultStorage === undefined) {
            throw { code: 'storage-not-set', message: 'You must configure the default Storage or set the Storage option on the cache function call.' };
        }
        return Core.defaultStorage;
    },
    setTargetStorage: function (key, storage) {
        if (storage === undefined || storage === null || storage.store === undefined || storage.clear === undefined || storage.retrieve === undefined) {
            throw { code: 'storage-does-not-implement-interface', message: `Your target Storage for ${key} does not correctly implement the IStorage interface.` };
        }
        Core.targetSpecificStorages[key] = storage;
    }
};
exports.default = Core;
