import IStorage from "./Storage/IStorage"
import generateHashKey from "./Key/generateHashKey"
import StorageCacheFailed from "./Storage/Exceptions/StorageCacheFailed"
import StorageCacheKeyDoesNotExist from "./Storage/Exceptions/StorageCacheKeyDoesNotExist"
import InMemoryStorage from "../storage/InMemoryStorage";

export interface ICore {
    storage?: IStorage
    expiration?: number
    getStorage: () => IStorage
    cache: (functionToCacheOrOptions: any) => () => Promise<any>
    configure: (options: { storage: IStorage, expiration: number }) => void
}

const Core: ICore = {

    cache: function(functionToCacheOrOptions: any) {

        if (typeof arguments[0] === 'function') {

            const target = arguments[0]
            const storage = Core.getStorage()

            return async function(...targetArgs: Array<any>) {

                const hashKey = generateHashKey(target.name, arguments)

                try {
                    return await storage.retrieve(hashKey)
                } catch (err) {
                    if (err === StorageCacheFailed) {
                        console.warn(`The Storage provided to Yeezy failed to retrieve the cached value for hash key: ${hashKey}`)
                        return Promise.resolve(target(...targetArgs))
                    } else if (err === StorageCacheKeyDoesNotExist) {
                        const value = target(...targetArgs)
                        console.warn(`Yeezy is caching a new value.`)
                        storage.store(hashKey, value)
                        return Promise.resolve()
                    } else {
                        console.warn(`The Storage provided to Yeezy does not correctly handle exceptions when retrieving values.`)
                        throw 'yeezy-invalid-storage'
                    }
                }
            }
        }

        console.warn(`Yeezy's cache did not receive a function or option parameter.`)
        throw 'yeezy-invalid-parameters'

        // TODO: Implement cache() function call with options.
        // if (typeof arguments[0] === 'object') {
        //     return Core.cache
        // }
    },

    configure: function({ storage, expiration }) {
        Core.storage = storage
        Core.expiration = expiration
    },

    getStorage: function() {

        if (Core.storage === undefined) {
            throw { code: 'storage-not-set', message: 'You must configure the default Storage or set the Storage option on the cache function call.' }
        }

        if (Core.storage) {
            throw { code: 'storage-does-not-implement-interface', message: 'Your global Storage does not correctly implement the IStore interface.' }
        }

        return Core.storage
    }
}

const storage = new InMemoryStorage()
const expiration = 60 * 60 * 24

Core.configure({ storage, expiration })

const fn = (input: number) => {
    return input + 1
}

const cachedFn = Core.cache(fn)

(async () => {
    console.log('Run #1', await cachedFn(1))
    console.log('Run #2', await cachedFn(1))
    console.log('Run #3', await cachedFn(1))
})()

export default Core