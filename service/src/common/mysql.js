const mysql = require('mysql')

const connectionConfig = {
    connectionLimit: 100,
    host: '127.0.0.1',
    user: 'root',
    password: '123456',
    database: 'rax_video',
}
// const connection = mysql.createConnection()

const TABLES = {
    VIDEO_LIST: 'video_list'
}
const pool = mysql.createPool(connectionConfig)

function getConnection() {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                reject(err);
            } else {
                resolve(connection);
            }
        })
    })
}


async function query(sql) {
    const connection = await getConnection();

    return new Promise((resolve, reject) => {    
        connection.query(sql, (err, results, fields) => {
            
            if (err) {
                reject(err);
            } else {
                resolve({
                    results,
                    fields
                })
            }
            connection.release()
        })
    })
}

// +-------------------+------------------+------+-----+---------+----------------+
// | Field             | Type             | Null | Key | Default | Extra          |
// +-------------------+------------------+------+-----+---------+----------------+
// | id                | int(10) unsigned | NO   | PRI | NULL    | auto_increment |
// | file_path         | varchar(500)     | YES  |     | NULL    |                |
// | file_name         | varchar(200)     | YES  |     | NULL    |                |
// | modification_time | bigint(20)       | YES  |     | NULL    |                |
// | size              | bigint(20)       | YES  |     | NULL    |                |
// | extra             | blob             | YES  |     | NULL    |                |
// +-------------------+------------------+------+-----+---------+----------------+
const saveVideos = async (videoData) => {
    for (const data of videoData) {
        await query(
            `INSERT INTO ${TABLES.VIDEO_LIST}
                SELECT 0, "${data.filepath}", "${data.basename}", "${data.birthTime}", "${data.size}", "", "${data.extname}"
                    FROM ${TABLES.VIDEO_LIST} WHERE file_path = "${data.filepath}" AND file_name = "${data.basename}"
                    HAVING COUNT(*) = 0
            `
        );
    }
}
module.exports = {
    query,
    saveVideos
};