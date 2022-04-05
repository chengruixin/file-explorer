import mysql from 'mysql';
import { FileInfo } from '../types';
import { sizeInGB, turnVideoListTableStruct2FileInfo } from './converter';

export interface VideoListTableStruct {
    id: number;
    file_path: string;
    file_name: string;
    modification_time: number;
    size: number; // in bytes
    extra: Buffer;
    ext_name: string;
}

const CONNECTION_CONFIG = {
    connectionLimit: 100,
    host: '127.0.0.1',
    user: 'root',
    password: '123456',
    database: 'rax_video',
};

const TABLES = {
    VIDEO_LIST: 'video_list'
};

const pool = mysql.createPool(CONNECTION_CONFIG);

const getConnection = (pool: mysql.Pool): Promise<mysql.PoolConnection> => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                reject(err);
            } else {
                resolve(connection);
            }
        });
    });
};

export const query = async <T>(sql: string): Promise<T[]> => {
    const connection = await getConnection(pool);

    return new Promise((resolve, reject) => {
        connection.query(sql, (err, results) => {

            if (err) {
                reject(err);
            } else {
                // no use of fields
                resolve(results);
            }
            connection.release();
        })
    })
}

// +-------------------+------------------+------+-----+---------+----------------+
// | Field             | Type             | Null | Key | Default | Extra          |
// +-------------------+------------------+------+-----+---------+----------------+
// | id                | int(10) unsigned | NO   | PRI | NULL    | auto_increment |
// | file_path         | varchar(500)     | YES  | MUL | NULL    |                |
// | file_name         | varchar(200)     | YES  | MUL | NULL    |                |
// | modification_time | bigint(20)       | YES  | MUL | NULL    |                |
// | size              | bigint(20)       | YES  |     | NULL    |                |
// | extra             | blob             | YES  |     | NULL    |                |
// | ext_name          | varchar(120)     | YES  |     | NULL    |                |
// +-------------------+------------------+------+-----+---------+----------------+

// hard update
export const updateVideosHard = async (videoData: FileInfo[]) => {
    const valueStrs = [];

    for (const data of videoData) {
        valueStrs.push(`("${data.filepath}", "${data.basename}", ${data.birthTime}, ${data.size}, "", "${data.extname}")`)
    }

    await query(`DELETE FROM ${TABLES.VIDEO_LIST}`);

    const values = valueStrs.join(',');
    await query(
        `INSERT INTO ${TABLES.VIDEO_LIST} (file_path, file_name, modification_time, size, extra, ext_name)
            VALUES ${values}`
    );
}

// soft update
export const updateVideosSoft = async (videoData: FileInfo[]) => {
    const data = await query<{latest: number}>(`SELECT max(modification_time) as latest from ${TABLES.VIDEO_LIST}`);
    console.log(data[0].latest);
    // needs implementation

    // sort video data by timestamp

    // for loop video data
    // if current.timestamp > queried timestamp create a VALUES(...)

    // do INSERT at once
}

interface paramsI {
    currentPage: number;
    pageSize: number;
}

export const searchVideos = async (patterns: string[], params?: paramsI): Promise<FileInfo[]> => {
    const likeClause = patterns.map(p => `file_name LIKE "%${p}%"`).join(' AND ');
    
    // TODO: add limit clause here

    const results = await query<VideoListTableStruct>(`SELECT * FROM ${TABLES.VIDEO_LIST} WHERE ${likeClause} ORDER BY modification_time desc`);

    return results.map(turnVideoListTableStruct2FileInfo);
}

export const findVideoByID = async (id: number): Promise<FileInfo> => {
    const results = await query<VideoListTableStruct>(
        `SELECT * FROM ${TABLES.VIDEO_LIST} WHERE id = ${id}`
    );

    return results.length > 0 
        ? turnVideoListTableStruct2FileInfo(results[0]) 
        : null;
}