import { IStorage } from "./Storage/IStorage"
import generateHashKey from "./Key/generateHashKey"
import StorageCacheFailed from "./Storage/Exceptions/StorageCacheFailed"
import StorageCacheKeyDoesNotExist from "./Storage/Exceptions/StorageCacheKeyDoesNotExist"
import isPromise from "./Helpers/isPromise";

type TargetFn = (...targetArgs: any[]) => any

export interface ICore {
    defaultStorage?: IStorage
    targetSpecificStorages: { [key: string]: IStorage }
    defaultExpiration?: number
    targetSpecificExpiration?: { [key: string]: number }
    getStorage: (hashKey: string) => IStorage
    setStorage: (hashKey: string, storage: IStorage) => void
    cache: (...args: any[]) => (...targetArgs: any[]) => any
    configure: (options: { storage: IStorage, expiration: number }) => void
}

const Core: ICore = {

    defaultStorage: undefined,
    targetSpecificStorages: {},

    defaultExpiration: undefined,
    targetSpecificExpiration: {},

    cache: function(...args: any[]): (...targetArgs: any[]) => any {

        if (typeof args[0] === 'function') {

            const target: TargetFn = args[0]

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

        if (typeof args[0] === 'object') {

            const { storage: optionStorage, key: optionKey } = args[0]

            return function(...args: any[]) {

                const target: TargetFn = args[0]

                let key
                if (optionKey !== undefined) {
                    key = optionKey === undefined ? target.name : optionKey
                }

                if (optionStorage !== undefined) {
                    Core.setStorage(key, optionStorage)
                }

                return Core.cache({ [key]: (...args: any[]) => target(...args) }[key])
            }
        }

        console.warn(`Yeezy did not receive a function or option parameter.`)
        throw 'yeezy-invalid-parameters'
    },

    configure: function({ storage, expiration }: { storage: IStorage, expiration: number }) {
        Core.defaultStorage = storage
        Core.defaultExpiration = expiration
    },

    getStorage: function(key: string): IStorage {

        if (Core.targetSpecificStorages[key] !== undefined) {
            return Core.targetSpecificStorages[key]
        }

        // if (Core.storage) {
        //     throw { code: 'storage-does-not-implement-interface', message: 'Your global Storage does not correctly implement the IStore interface.' }
        // }

        if (Core.defaultStorage === undefined) {
            throw { code: 'storage-not-set', message: 'You must configure the default Storage or set the Storage option on the cache function call.' }
        }

        return Core.defaultStorage

    },

    setStorage: function(key: string, storage: IStorage) {
        Core.targetSpecificStorages[key] = storage
    }
}

export default Core