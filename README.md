# yeezy-cache

> I'ma clear the cache — [Kanye West](https://genius.com/14749235) 😎💲

Yeezy Cache provides simple, light, function result caching. By wrapping a function in the `cache` decorator you can avoid repeatedly reaching out to slower external services (such as a database or external API) or performing intensive processing—assuming your functions are [pure functions](https://en.wikipedia.org/wiki/Pure_function), of course, and therefore can be cached.

## Getting Started

First install Yeezy:

```
npm install --save yeezy-cache 
# or
yarn add yeezy-cache
```

Next you'll need to configure (you only need to do this once in your project), and then you can start caching!
```
import { cache, InMemoryStorage, configure } from "yeezy-cache"

configure({
    storage: new InMemoryStorage(),
    expiration: 60
})

const getUserByID({ id }) => {
    // Do a database lookup. 
}

export default cache(getUserByID)
```

That's it! The first time you call your cached version of `getUserByID()` the result will be fetched from your external service and cached. The next call will return this cached result.

## Configuring

Some options can be set at the global level. The `storage` option informs Yeezy where to store your cached items. The `expiration` option sets the default amount of time (in seconds) to cache results.

```
import { configure, InMemoryStorage } from "yeezy-cache"

configure({
    storage: new InMemoryStorage(),
    expiration: 60
})
```

The `cache` decorator also has optional parameters that can configure `storage` and `expiration` on a per-function cache basis.

```
import { cache } from "yeezy-cache"
import { RedisStorage } from "yeezy-cache-redis"

export default cache({
    storage: RedisStorage(),
    expiration: 120
})(getUserByID)
```

## Key

**Please read this section!**

Yeezy tries to be as simple as possible to use. However, if you cache two functions with the same name **collisions will occur**. By default Yeezy uses the name of the function for internal cache indexing. Therefore, if you are prone to having two functions named the same it is recommended you use the `key` option to prevent collisions.

```
import { cache } from "yeezy-cache"

export default cache({
    key: 'get-user-by-id-mysql'
})(getUserByID)
```

## Storage

Yeezy ships with an `InMemoryStorage` object for experimentation, but also includes an interface (`Storage`) for extending to any caching mechanism of choice.

## Wishlist

- Create Redis Storage module (`yeezy-cache-redis`).
- Tests
- Support specifying key hashing or encoding algorithm (`base-64`, `sha-256`, `sha-512` etc.)
- Support options for encrypting values for sensitive data storage.