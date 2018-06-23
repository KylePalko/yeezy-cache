# Yeezy Cache
##### Why get cache like other modules? Get cache like Yeezy would.

Yeezy Cache provides simple, light, function result caching ([memoization](https://en.wikipedia.org/wiki/Memoization)). By wrapping a function in the `cache` decorator you can avoid repeatedly reaching out to slower external services (such as a database or external API) or performing intensive processing—assuming your functions are [pure](https://en.wikipedia.org/wiki/Pure_function) or [deterministic](https://en.wikipedia.org/wiki/Deterministic_system), of course, and therefore can be cached.

## Getting Started

First install Yeezy:

```
npm install --save yeezy-cache 
# or
yarn add yeezy-cache
```

Next you'll need to configure Yeezy for your use-case (you only need to do this once in your project).
```
import { InMemoryStorage, configure } from "yeezy-cache"

configure({
    storage: new InMemoryStorage(),
    expiration: 60
})
```

## Caching your first function

The only requirement for memoization is that a function must determine its output solely based on input—that is, the output of a function is the derivative of its input. To do so, simply wrap your function in the `cache` decorator.
```
import { cache } from "yeezy-cache"

const increment(input) => input + 1

export default cache(increment)
```

That's it! The first time you call your cached version of `increment()` the result will be calculated and cached. All subsequent calls, until the expiration, will be retrieved from your Storage.

## Configuring Yeezy

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
})(increment)
```

## Preventing Collisions

Yeezy tries to be as simple as possible to use. However, if you cache two functions with the same name and same number and types of arguments **collisions will occur**. By default Yeezy hashes the function name and arguments to produce a key which references the function's cached result. Therefore, in these edge-cases, it is required you use the `key` option to prevent collisions.

```
import { cache } from "yeezy-cache"

export default cache({
    key: 'plus-one-increment'
})(increment)
```

## Storage

Yeezy ships with an `InMemoryStorage` object for experimentation, but also includes an interface (`IStorage`) for extending to any caching mechanism of choice.

## Wishlist

- Create Redis Storage module (`yeezy-cache-redis`).
- Tests
- Support specifying key hashing or encoding algorithm (`base-64`, `sha-256`, `sha-512` etc.)
- Support options for encrypting values for sensitive data storage.
- Support logging options (e.g., log when caching, log when pulled from cache, etc.)
