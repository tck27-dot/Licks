import express from 'express'
// import {getNotes,getNote,createNote} from './database.js'
// import { addNewUser,createUserProfile,configBio,addUserName,updateProfileImg , addFullName} from './database.js'
import {generateURL,uploadVid,uploadImg} from './s3.js'
import {
    addNewUser,
    get_app_user_length,
    update_sheet_music,
    update_vid_uri,
    set_post_id,
    upload_uid,
    get_profile_img,
    updateProfileImg,
    update_media_file,
    configBio,
    addProfileName,
    uid_to_db_id,
    set_caption_and_id,
    set_post_media_id,
    update_caption,
    headerData,
    postData,
    update_thumbnail
} from "./database.js"
import {promisify} from "util"
import cors from "cors";
import crypto, { randomBytes } from "crypto"
const app = express()



//Lets us use json arguments in our post req
app.use(express.json())


// app.get("/notes", async (req,res)=>{
//     const notes = await getNotes()
//     res.send( notes)
    
// })

// app.get("/notes/:id", async (req,res)=>{
//     const id = req.params.id
//     const note = await getNote(id)
//     res.send( note)
    
// })

// app.post("/notes", async (req,res)=>{
//     const {title, contents} = req.body
//     const note = await createNote(title,contents)
//     res.status(201).send(note)
// })

app.post("/", async (req,res)=>{
    const {Uid} = req.body
    const result = await upload_uid(Uid);
    res.send(result);
})

app.post("/addFullName", async (req,res)=>{
    const {FirstName,LastName,Uid} = req.body;
    const result2 = await addNewUser(FirstName,LastName,Uid)
    res.send(result2);
})

app.post("/addUserName", async (req,res)=>{
    const {Name, Uid} = req.body;
    const result = await addProfileName(Uid,Name)
    res.send(result);
})



app.get("/s3Url", async (req,res)=>{
    const url = await generateURL()
    res.send({url})
})

app.post("/postVid", async (req,res) =>{
    const randomBytes = promisify(crypto.randomBytes)
    const rawBytes = await randomBytes(16)
    const key = rawBytes.toString('hex')

    const {Filepath} = req.body

    await uploadVid("licks-bucket-2",key,Filepath)
        .then(() => res.send(201) )
        .catch(error => res.send(error))
})

app.post("/postImg", async (req,res) =>{
    const randomBytes = promisify(crypto.randomBytes)
    const rawBytes = await randomBytes(16)
    const key = rawBytes.toString('hex')

    const {Filepath} = req.body

    await uploadImg("licks-bucket-2",key,Filepath)
        .then(() => res.send(201) )
        .catch(error => res.send(error))
    // await updateProfileImg()
})

app.post("/profileImg", async (req,res)=>{
    const {Uid,Uri} = req.body
    await updateProfileImg(Uid,Uri)
})

app.get("/profileImg", async (req,res)=>{
    const {uid} = req.body;
    const uri = get_profile_img(uid);
    res.send(uri)
})

app.post("/updateBio", async(req,res)=>{
    const {Uid,BioText} = req.body
    await configBio(Uid,BioText)
})

app.post("/uploadVideo",async (req,res)=>{
    const {uid,caption,uri} = req.body;
    const db_id = await uid_to_db_id(uid);
    const {insertId} = await set_caption_and_id(db_id,caption);
    await update_media_file(uri,insertId);
})
 //First step in upload
app.post("/update_media_file", async (req,res)=>{
    const {Uid,Uri,Duration} = req.body;
    const db_id = await uid_to_db_id(Uid);
    const [result] = await set_post_id(db_id);
    const [result2] = await update_vid_uri(Uri,Duration);
    const {insertId} = result;
    const post_media_id = result2.insertId
    const [result3] = await set_post_media_id(insertId,post_media_id)
    res.status(201).send([result,result2,result3])
})

 //Second step in upload
app.post("/update_thumbnail", async (req,res)=>{
    const {PostID,ThumbnailUri} = req.body;
    const [result] = await update_thumbnail(PostID,ThumbnailUri);
    res.status(201).send(result)
})

//Third step in upload
app.post("/update_sheet_music", async (req,res)=>{
    const {PostID,Uri} = req.body;
    const [result] = await update_sheet_music(PostID,Uri);
    res.status(201).send(result)
})

 //Fourth step in upload
 app.post("/update_caption", async (req,res)=>{
    const {post_ID,caption_text} = req.body;
    const [result] = await update_caption(post_ID,caption_text);
    res.status(201).send(result)
 })


 //Sends a object with all profile info
app.post("/getUserInfo",async(req,res)=>{
    const {Uid} = req.body;
    const db_id = await uid_to_db_id(Uid);
    const headData = await headerData(db_id);
    const postsData = await postData(db_id);
    res.status(201).send([headData,postsData])
})
app.use((err,req,res,next)=>{
    console.error(err.stack)
    res.status(500).send('Something broke!')
})

app.use(cors());
const PORT = 8084
const HOST = "0.0.0.0"
app.listen(PORT,HOST,()=>{
    console.log(`Server is running on port ${PORT} with host: ${HOST}`)
})



// const x = await get_app_user_length();
// console.log(x)
// const y = await uid_to_db_id("dJmACN1jjjUaDDumWY6CIg3ZQwp2")
// console.log(y)

const num = await headerData(1)
console.log(num.userData.last_name)
const data = await postData(1)
console.log(data)
const val = await uid_to_db_id("dJmACN1jjjUaDDumWY6CIg3ZQwp2")
console.log(val)