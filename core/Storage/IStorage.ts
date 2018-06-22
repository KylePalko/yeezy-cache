export interface IStorage {

    /*
     * Caches a key/value pair in Storage.
     * If the cache cannot retrieve the key then the StorageCacheFailed should be thrown.
     * If the cache key did not yet exist in Storage StorageCacheKeyDoesNotExist should be thrown.
     */
    store(hashKey: string, value: any): void

    /*
     * Takes a key and removes the key/value pair from Storage. If Storage cannot clear a key/value pair an exception should be thrown.
     */
    clear(hashKey: string): void

    /*
     * Retrieve a value for a key from the Storage.
     */
    retrieve(hashKey: string): Promise<any>
}