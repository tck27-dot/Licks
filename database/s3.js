import dotenv from 'dotenv'
import crypto, { randomBytes } from "crypto"
import {promisify} from "util"
import {
  S3Client,
  ListBucketsCommand,
  PutObjectCommand,
  GetObjectCommand
} from "@aws-sdk/client-s3"
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { Upload } from '@aws-sdk/lib-storage'
import * as fs from 'fs'
import { open } from 'node:fs/promises';

dotenv.config()

const region = 'us-east-1'
const bucketName = process.env.BUCKETNAME
const accessKeyId = process.env.ACCESSKEYID
const secretAccessKey = process.env.SECRETEACCESSKEY

// const s3 = new aws.S3({
//     region,
//     accessKeyId,
//     secretAccessKey,
//     signatureVersion:'v4'
// })

// export async function generateUploadUrl(){
//     const randomBytes = promisify(crypto.randomBytes)
//     const rawBytes = await randomBytes(16)
//     const imageName = rawBytes.toString('hex')
   
//     const params = ({
//         Bucket: bucketName,
//         Key: imageName,
//         Expires:60
//     })

//     const uploadURL = await s3.getSignedUrlPromise('putObject',params)
//     return uploadURL
// }

//v3 code
let client = new S3Client({
    region: region,
    credentials: {
      accessKeyId:accessKeyId ,
      secretAccessKey: secretAccessKey,
    },
  });
/**
 * 
 * @returns Signed url for putObject command and name of image (AWS object key)
 */
export async function generateURL(){
    const randomBytes = promisify(crypto.randomBytes)
    const rawBytes = await randomBytes(16)
    const imageName = rawBytes.toString('hex')
    const input = {
        "Bucket":bucketName,
        "Key":imageName,
    }
    const command = new PutObjectCommand(input)
    const url = await getSignedUrl(client,command,{expiresIn:3600})
    return [url,imageName]
}
const uri = "file:///Users/temaniknight/Library/Developer/CoreSimulator/Devices/BF4A8639-5E39-46E3-906A-09848DBD3FB8/data/Containers/Data/Application/0F7CE742-33DD-4333-9E49-238E2AAE36A0/Library/Caches/ExponentExperienceData/@anonymous/Licks-976714a4-8dd2-41d2-bb09-5085088f5681/ImagePicker/077E941E-B12F-4754-8021-C645CAE40220.jpg"

export const uploadVid = async (bucketName, keyName, filePath) => {
  try {
    // Read the file from the local file system
    // const fileStream = fs.createReadStream(filePath);

    

    // const fd = await open('/dev/input/event0');
    // Create a stream from some character device.
    // const stream = fd.createReadStream();
    const randomBytes = promisify(crypto.randomBytes)
    const rawBytes = await randomBytes(16)
    const imageName = rawBytes.toString('hex')
    const fileStream = fs.createReadStream(filePath);

    // Create an upload object
    const upload = new Upload({
      client: client,
      params: {
        Bucket: bucketName,
        Key: keyName,
        Body: fileStream,
        ContentType: "video/mp4", // change to "image/jpeg" for images
      },
    });

    // Monitor the upload progress
    upload.on("httpUploadProgress", (progress) => {
      console.log(`Progress: ${progress.loaded}/${progress.total}`);
    });

    // Perform the upload
    await upload.done();
    console.log(`File uploaded successfully to ${bucketName}/${keyName}`);
  } catch (error) {
    console.error("Error uploading file:", error);
  }
};

export const uploadImg = async (bucketName, keyName, filePath) => {
  try {
    // Read the file from the local file system
    // const fileStream = fs.createReadStream(filePath);

    

    // const fd = await open('/dev/input/event0');
    // Create a stream from some character device.
    // const stream = fd.createReadStream();
    // Create an upload object
    const fileStream = fs.createReadStream(filePath);
    const upload = new Upload({
      client: client,
      params: {
        Bucket: bucketName,
        Key: keyName,
        Body: fileStream,
        ContentType: "image/jpeg", // change to "image/jpeg" for images
      },
    });

    // Monitor the upload progress
    upload.on("httpUploadProgress", (progress) => {
      console.log(`Progress: ${progress.loaded}/${progress.total}`);
    });

    // Perform the upload
    await upload.done();
    console.log(`File uploaded successfully to ${bucketName}/${keyName}`);
  } catch (error) {
    console.error("Error uploading file:", error);
  }
};

/**
 * 
 * @param {string} object_key - Object Key of the file in S3 bucket
 * 
 * @returns  Url to access specific file
 */
export const generateGetUrl = async (objKey)=>{
    const command = new GetObjectCommand({
    Bucket: process.env.BUCKETNAME,
    Key: objKey,
  });

  try{
    const url = await getSignedUrl(client,command,{expiresIn:3600})
    return url;
  }catch(e){
    console.log(e)
  }
}