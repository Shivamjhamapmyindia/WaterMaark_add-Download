import fs from "fs";
import ffmpeg from "fluent-ffmpeg";
import ffmpegInstaller from "@ffmpeg-installer/ffmpeg";
ffmpeg.setFfmpegPath(ffmpegInstaller.path);
import path from "path";

import { Readable } from "node:stream";
import { spawn } from "child_process";
const WATERMARK_PATH = "1.png";

const videoUpload = async (buffer, originalname, req, res) => {
  const videoFile = buffer;
  const size = videoFile.length;
  let fileName = originalname;
  // console.log(videoFile);

  // Create a unique identifier for the watermarked video
  // const watermarkedVideoId = Math.random().toString(36).substring(2, 15); // Generate random ID

  // Convert buffer string to readable stream
  const videoStream = new Readable();
  videoStream.push(videoFile);
  videoStream.push(null); // Signal end of stream

  // Create a temporary directory to store the watermarked video
  // let currentDir = process.cwd();
  let __dirname = path.resolve();
  // console.log(currentDir);
  const tempDirPath = `${__dirname}/tmp`; // Adjust path based on your server's structure


  if (!fs.existsSync(tempDirPath)) {
    fs.mkdirSync(tempDirPath, { recursive: true }); // Create temporary directory if it doesn't exist
  }

  const saveFile = fs.createWriteStream(`${tempDirPath}/${fileName}.mp4`);
  await new ffmpeg()
    .input(videoStream)
    .input(WATERMARK_PATH)
    .complexFilter([
      "[0:v][1:v]overlay='x=800:y=500'[watermarked1]", // Overlay at position (300,300)
      "[watermarked1][1:v]overlay='x=1300:y=500'[watermarked2]", // Overlay at position (400,400)
      "[watermarked2][1:v]overlay=' x=1700:y=500'[watermarked3]",
      "[watermarked3][1:v]overlay='x=250:y=500'",
    ])
    // .videoCodec("libx264") // Set video codec to H.264 (optional)
    // .audioCodec("aac") // Set audio codec to AAC (optional)
    .outputOptions([
      "-movflags frag_keyframe+empty_moov", // Move metadata to the beginning of the file for better streaming
    ])
    .toFormat("mp4")
    .pipe(saveFile);

  await new Promise((resolve, reject) => {
    saveFile.on("error", reject);
    saveFile.on("finish", resolve);
  });

  // Generate a temporary download link (customize based on your server setup)
  // const downloadUrl = `videos/${fileName}.mp4`; // Replace with your download route

  // Respond with success message and download link
  // res.json({ status: "200", message: "Video uploaded successfully", 'fileName': `${fileName}.mp4` });
  res.download(`${tempDirPath}/${fileName}.mp4`, `${fileName}.mp4`, (err) => {
    if (err) {
      console.error("Error downloading video:", err);
      res.status(500).send("Error downloading video");
    }
  })

  // Set up a cleanup mechanism (optional, adjust based on your needs)
  if(fs.existsSync(`${tempDirPath}`)) {
    setTimeout(() => {
      try {
        fs.rmSync(tempDirPath, { recursive: true }); // Delete temporary directory after a predefined time
      } catch (error) {
        console.error("Error deleting temporary directory:", error);
      }
    }, 1 * 60 * 1000); // Example: Delete after 5 Minutes (adjust timeout)
  }
};

export { videoUpload };
