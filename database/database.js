import mysql from 'mysql2'
import dotenv from 'dotenv';

dotenv.config()
export const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password:process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
}).promise()

// export const getNotes = async () =>{
//     const [rows] = await pool.query("Select * FROM notes")
//     return rows

// }

// export const getNote = async (id) =>{
//     const [note] = await pool.query(`SELECT * 
//         FROM notes 
//         WHERE id = ?
//         `,[id])
//     return note[0]
// }

// export const createNote = async (title,contents) =>{
//     const [result] = await pool.query(`
//         INSERT INTO notes (title,contents)
//         VALUES (?,?)
//         `,[title,contents])
//     const id = result.insertId
//     return getNote(id)
    
// }

// export const addNewUser = async (userName, uid) => {
//     const result = await pool.query(
//         `INSERT INTO users (DisplayName,Uid)
//         VALUES (?,?)
//         `,[userName,uid])
//         return result;
// }

// export const createUserProfile = async (uid) =>{
//     const result = await pool.query(`
//         CREATE TABLE IF NOT EXISTS ??(
//             ID VARCHAR(100) DEFAULT ?,
//             FirstName VARCHAR(100),
//             LastName VARCHAR(100),
//             ProfileName VARCHAR(100),
//             ProfileImg VARCHAR(100),
//             Bio VARCHAR(150) DEFAULT 'Welcome to my page!',
//             SignUpDate DATE DEFAULT (CURRENT_DATE),
//             PRIMARY KEY (ID)        
//         );`,[`user_${uid}`,uid])
//     return result
// }

// export const addUserName = async (userName,uid)=>{
//     const result = await pool.query(`
//         UPDATE ??
//         SET ProfileName = ?
//         WHERE ID = ?
//         `,[`user_${uid}`,userName,uid])
// }

// export const addFullName = async (FirstName,LastName,Uid)=>{
//     const result = await pool.query(`
//         INSERT INTO ?? (FirstName, LastName)
//         VALUES (?,?)
//         `
//     ,[`user_${Uid}`,FirstName,LastName])
// }

export const updateProfileImg = async (uid,imgName) =>{
    const result = await pool.query(`
        UPDATE app_user
        SET profile_img = ?
        WHERE uid = ?
        `,[imgName,uid])
}

export const configBio = async (uid,bioText)=>{
    const result = await pool.query(`
        UPDATE app_user
        Set bio = ?
        WHERE uid = ?
        `,[bioText,uid])
}

export const addNewUser = async (first_name,last_name,uid)=>{
    const result = await pool.query(`
        UPDATE app_user
        SET first_name = ?, last_name =?
        WHERE uid = ?
        `,[first_name,last_name,uid])
}

export const addProfileName = async (uid,profile_name)=>{
    const result = await pool.query(`
        UPDATE app_user
        SET profile_name = ?
        WHERE uid = ?
        `,[profile_name,uid])
}

export const uid_to_db_id = async (uid)=>{
    const [result] = await pool.query(`
        SELECT ID
        FROM app_user
        WHERE uid = ?
        `,[uid])
    return result[0].ID
}

export const get_app_user_length = async ()=>{
    const result = await pool.query(`
        SELECT count(*) from app_user
        `)
    return Object.values(result[0][0])[0]
}

export const set_caption_and_id = async (db_id,caption)=>{
    const result = await pool.query(`
        INSERT INTO post (created_by_user_id, caption)
        VALUES (?,?)
        `[db_id,caption])
    return result
}

export const update_media_file = async (uri,post_id) =>{
    const result = pool.query(`
        INSERT INTO post_media (post_id,media_file)
        VALUES (?,?)
        `,[post_id,uri])
    return result
} 

export const get_profile_img = async (uid) =>{
    const result = pool.query(`
        SELECT profile_img,
        FROM app_user
        WHERE uid = ?
        `,[uid])
    return result
}

export const upload_uid = async (uid) =>{
    const result = pool.query(`
        INSERT INTO app_user (uid)
        VALUES (?)
        `,[uid])
    return result
} 

/**
 * Sets the created_by_user_id field in post table to db_id. db_id is the converted google uid.
 *
 * @param {number} db_id - The value in the ID column of the post_media table.
 * 
 * 
 */
export const set_post_id = async (db_id)=>{
    const result = await pool.query(`
        INSERT INTO post (created_by_user_id)
        VALUES (?)
        `,[db_id])
    return result
}
/**
 * Adds uri and duration of a video to post_media table via INSERT statement
 * 
 *
 * 
 * @param {number} uri - The uri of the video file.
 * @param {number} duration - The duration in milliseconds of video.
 * 
 */
export const update_vid_uri = async (uri,duration)=>{
    const result = await pool.query(`
        INSERT INTO post_media (media_file,duration)
        VALUES (?,?)
        `,[uri,duration])
    return result
}
/**
 * Adds sheetmusic to post_media table via UPDATE statment
 *
 * @param {number} post_id - The value in the ID column of the post_media table.
 * @param {number} uri - The uri of the sheetmusic file.
 * 
 */
export const update_sheet_music = async (post_id,uri)=>{
    const result = await pool.query(`
        UPDATE post_media
        SET sheet_music_file = ?
        WHERE post_id = ?
        `,[uri,post_id])
    return result
}

/**
 * Sets the post_id field in post_media table via UPDATE statement.
 * This is a foreign key that points to a ID in the post table
 * 
 * @param {number} id - The id of the post table entry (Primary key of post)
 * @param {number} insertId - The id of the post_media table entry (Primary key of post_media)
 * 
 * 
 */
export const set_post_media_id = async (id,insertId)=>{
    const result = await pool.query(`
        UPDATE post_media
        SET post_id = ?
        WHERE ID = ?
        `,[id,insertId])
    return result
}
/**
 * Sets the caption field in post table via UPDATE statement.
 * 
 * 
 * @param {number} post_ID - The id of the post table entry (Primary key of post)
 * @param {string} caption_text - The text of the post's caption
 * 
 * 
 */
export const update_caption = async (post_ID,caption_text)=>{
    const result = await pool.query(`
        UPDATE post
        SET caption = ?
        WHERE ID = ?
        `,[caption_text,post_ID])
    return result
}
/**
 * Grabs all data needed for heading of profile page
 * @param  db_id 
 * @returns 
 */
export const headerData = async(db_id)=>{
   const [result] =  await pool.query(`
        Select following_id
        From follower
        Where following_id = ?
    `,[db_id])
    const [result2] = await pool.query(`
        Select followed_id
        From follower
        Where following_id = ?
        `,[db_id])
    const [[result3]] = await pool.query(`
        Select * FROM app_user
        WHERE id = ?;
        `,[db_id])
    return {followers: result.length, following: result2.length, userData:result3}
}

export const postData = async(db_id)=>{
    const [result] = await pool.query(`
        Select * FROM post
        WHERE id = ?;
        `,[db_id])
    // const [result2] = await pool.query(`
    //     Select
    //     `)
    return {posts:result,}
}

export const update_thumbnail = async (post_id,uri)=>{
    const result = await pool.query(`
        UPDATE post_media
        SET sheet_music_file = ?
        WHERE post_id = ?
        `,[uri,post_id])
    return result
}