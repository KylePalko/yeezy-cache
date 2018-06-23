const { cache, configure, InMemoryStorage } = require('../dist/index')

configure({
    storage: new InMemoryStorage(),
    expiration: 60
})

async function testDelay() {

    const delay = (time) => new Promise((resolve, reject) => setTimeout(() => resolve('Delayed.'), time))
    const delayMemoized = cache(delay)

    console.log('Run #1', await delayMemoized(1000));
    console.log('Run #2', await delayMemoized(1000));
    console.log('Run #3', await delayMemoized(1000));
    console.log('Run #4', await delayMemoized(1000));
    console.log('Run #5', await delayMemoized(1000));
}

async function testIncrement() {

    const increment = (n) => n + 1
    const incrementMemorized = cache(increment)

    console.log('Run #1', await incrementMemorized(1));
    console.log('Run #2', await incrementMemorized(1));
    console.log('Run #3', await incrementMemorized(1));
    console.log('Run #4', await incrementMemorized(1));
    console.log('Run #5', await incrementMemorized(1));
}

async function testDecrement() {

    const decrement = (n) => n - 1
    const decrementMemoized = cache({
        key: 'decrement-key',
        storage: new InMemoryStorage()
    })(decrement)

    console.log('Run #1', await decrementMemoized(1));
    console.log('Run #2', await decrementMemoized(1));
    console.log('Run #3', await decrementMemoized(1));
    console.log('Run #4', await decrementMemoized(1));
    console.log('Run #5', await decrementMemoized(1));
}

async function runTests() {

    try {
        await testIncrement()
        await testDecrement()
        await testDelay()
    } catch (err) {
        console.error(`A test failed: ${err}.`)
    }
}

runTests().catch()