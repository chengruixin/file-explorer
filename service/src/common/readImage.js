const fs = require('fs')
const s = fs.createReadStream('../assets/out.png')

s.on('open', () => {
    console.log('file is open');
})

s.on('error', (err) => {
    console.log(err)
})

s.on('data', chunk => {
    console.log("\nchunk data : \n", chunk);
})

s.on('close', () => {
    console.log('close')
})

s.on('end', () => {
    console.log('end')
})