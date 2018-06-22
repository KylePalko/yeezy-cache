const { cache, configure, InMemoryStorage } = require('../dist/index')
const { readFileSync } = require('fs')

configure({
    storage: new InMemoryStorage(),
    expiration: 60
})

const read = cache((path) => new Promise((resolve) => resolve(readFileSync(`${__dirname}/${path}`, 'utf8'))))

async function test() {
    console.log('Run #1', await read('./file.md'));
    console.log('Run #2', await read('./file.md'));
    console.log('Run #3', await read('./file2.md'));
    console.log('Run #4', await read('./file.md'));
    console.log('Run #5', await read('./file2.md'));
}

test().catch((err) => {
    console.log(`Test failed.`, err)
})