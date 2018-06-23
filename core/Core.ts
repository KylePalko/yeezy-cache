import { IStorage } from "./Storage/IStorage"
import generateHashKey from "./Key/generateHashKey"
import StorageCacheFailed from "./Storage/Exceptions/StorageCacheFailed"
import StorageCacheKeyDoesNotExist from "./Storage/Exceptions/StorageCacheKeyDoesNotExist"
import isPromise from "./Helpers/isPromise";

export interface ICore {
    defaultStorage?: IStorage
    storages: { [hashKey: string]: IStorage }
    expiration?: number
    getStorage: (hashKey: string) => IStorage
    setStorage: (hashKey: string, storage: IStorage) => void
    cache: (...args: any[]) => (...targetArgs: any[]) => Promise<any>
    configure: (options: { storage: IStorage, expiration: number }) => void
}

const Core: ICore = {

    expiration: undefined,
    defaultStorage: undefined,
    storages: {},

    cache: function(...args: any[]): (...targetArgs: any[]) => Promise<any> {

        if (typeof args[0] === 'function') {

            const target: (...targetArgs: any[]) => Promise<any> = args[0]

            return async function(...targetArgs: any[]): Promise<any> {

                const hashKey = generateHashKey(target.name, targetArgs)
                const storage = Core.getStorage(hashKey)

                try {
                    return await storage.retrieve(hashKey)
                } catch (err) {
                    if (err === StorageCacheFailed || err === StorageCacheKeyDoesNotExist) {

                        if (isPromise(target)) {
                            try {
                                const result = await target(...targetArgs)
                                try {
                                    storage.store(hashKey, result)
                                } catch (err) {
                                    console.warn(`The Storage provided to Yeezy failed to store a result.`)
                                }
                                return Promise.resolve(result)
                            } catch (err) {
                                return Promise.reject(err)
                            }
                        }

                        try {
                            const result = target(...targetArgs)
                            try {
                                storage.store(hashKey, result)
                            } catch (err) {
                                console.warn(`The Storage provided to Yeezy failed to store a result.`)
                            }
                            return Promise.resolve(result)
                        } catch (err) {
                            return Promise.reject(err)
                        }

                    } else {
                        console.warn(`The Storage provided to Yeezy does not correctly handle exceptions when retrieving values.`)
                        throw 'yeezy-invalid-storage'
                    }
                }
            }
        }

        // if (typeof args[0] === 'object') {
        //     Core.setStorage()
        // }

        console.warn(`Yeezy's cache did not receive a function or option parameter.`)
        throw 'yeezy-invalid-parameters'
    },

    configure: function({ storage, expiration }: { storage: IStorage, expiration: number }) {
        Core.defaultStorage = storage
        Core.expiration = expiration
    },

    getStorage: function(hashKey: string): IStorage {

        if (Core.storages[hashKey] !== undefined) {
            return Core.storages[hashKey]
        }

        // if (Core.storage) {
        //     throw { code: 'storage-does-not-implement-interface', message: 'Your global Storage does not correctly implement the IStore interface.' }
        // }

        if (Core.defaultStorage === undefined) {
            throw { code: 'storage-not-set', message: 'You must configure the default Storage or set the Storage option on the cache function call.' }
        }

        return Core.defaultStorage

    },

    setStorage: function(hashKey: string, storage: IStorage) {
        Core.storages[hashKey] = storage
    }
}

export default Core