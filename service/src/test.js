const searchFiles = require('./common/searchFilesAsync')
const dirs = require('./data/dirsTobeExplored')
const { findExactItems } =
    require('../libs/raxSearch/raxSearch.dev').exactMatcher

console.log(dirs);
searchFiles(dirs, []).then( data => {
    console.log(data.length);
}).catch( err => {
    console.log(err)
})