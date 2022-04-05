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
        connection.query(sql, (err, results) => {
            
            if (err) {
                reject(err);
            } else {
                // no use of fields
                resolve(results);
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

// `INSERT INTO ${TABLES.VIDEO_LIST}(file_path, file_name, modificatoin_time, size, extra)
// SELECT 0, "${data.filepath}", "${data.basename}", "${data.birthTime}", "${data.size}", "", "${data.extname}"
//     FROM ${TABLES.VIDEO_LIST} WHERE file_path = "${data.filepath}" AND file_name = "${data.basename}"
//     HAVING COUNT(*) = 0
// `
const reloadAllVideos = async (videoData) => {
    const valueStrs = [];

    const deleteQuery = query(`DELETE FROM ${TABLES.VIDEO_LIST}`);

    for (const data of videoData) {
        valueStrs.push(`("${data.filepath}", "${data.basename}", ${data.birthTime}, ${data.size}, "", "${data.extname}")`)        
    }

    await deleteQuery;

    const values = valueStrs.join(',');
    await query(
       `INSERT INTO ${TABLES.VIDEO_LIST} (file_path, file_name, modification_time, size, extra, ext_name)
            VALUES ${values}`
    );
}

const updateNewVideos = async (videoData) => {
    const data = await query(`SELECT max(modification_time) as latest from ${TABLES.VIDEO_LIST}`);
    console.log(data[0].latest);
}
module.exports = {
    query,
    reloadAllVideos,
    updateNewVideos
};