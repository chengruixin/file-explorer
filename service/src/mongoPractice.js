const { MongoClient } = require('mongodb')
const searchFiles = require('./common/searchFilesAsync')
const dirs = require('./data/dirsTobeExplored')

const uri =
    'mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000'

const client = new MongoClient(uri)

const allowedExt = ['.mp4', '.MP4']

const lookUp = new Set(allowedExt)
console.log(lookUp)
async function run() {
    try {
        let res
        await client.connect()

        const db = client.db('rax')
        const movies = db.collection('movies')

        res = await movies.deleteMany({})

        const files = await searchFiles(dirs, [])

        for (let i = 0; i < files.length; i++) {
            if (lookUp.has(files[i].extname)) {
                await movies.insertOne(files[i])
                console.log(files[i].fileName)
            }
        }
    } finally {
        await client.close()
    }
}

run().catch((err) => {
    console.log(err)
})
