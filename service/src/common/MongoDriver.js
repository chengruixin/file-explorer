const { MongoClient } = require('mongodb')
const searchFiles = require('./searchFilesAsync')
const dirs = require('../data/DirsTobeExplored')

const uri =
    'mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000'

const client = new MongoClient(uri)

const dbName = 'rax'
const collectionName = 'movies'

async function refreshDatabase() {
    try {
        await client.connect()

        const db = client.db(dbName)
        const movies = db.collection(collectionName)

        await movies.deleteMany({})

        const files = await searchFiles(dirs, [])
        let count = 0
        console.log(files.length)
        for (let i = 0; i < files.length; i++) {
            await movies.insertOne({
                ...files[i],
                _id: count,
            })
            count++
        }

        const c = await movies.find().count()
        console.log('succeeded numbers:', c)
    } catch(e) {
        console.error('Catched Error:\n', e);
    } finally {
        await client.close()
    }
}

async function findMovies(arr) {
    try {
        console.time('Retrieve Time')
        await client.connect()

        const db = client.db(dbName)
        const movies = db.collection(collectionName)

        const crusor = movies.find({
            handledFile: {
                $all: arr.map((item) => new RegExp(item, 'i')),
            },
        })

        const res = await crusor.toArray()
        console.timeEnd('Retrieve Time')
        return res
    } finally {
        await client.close()
    }
}

async function findMovieWithID(id) {
    try {
        await client.connect()
        const db = client.db(dbName)
        const movies = db.collection(collectionName)
        return await movies.findOne({ _id: id })
    } finally {
        await client.close()
    }
}
module.exports = {
    findMovies,
    refreshDatabase,
    findMovieWithID,
}
