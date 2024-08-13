const uploadFile = async (bucketName, keyName, filePath) => {
  try {
    // Read the file from the local file system
    // const fileStream = fs.createReadStream(filePath);

    

    // const fd = await open('/dev/input/event0');
    // Create a stream from some character device.
    // const stream = fd.createReadStream();
    const filePath = '/Users/temaniknight/Downloads/HeadShots/ProHeadShot3.JPG';
    const fileStream = fs.createReadStream(filePath);

    // Create an upload object
    const upload = new Upload({
      client: S3Client,
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
