import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import multer from "multer";
import ffmpeg from "fluent-ffmpeg";
import ffmpegInstaller from "@ffmpeg-installer/ffmpeg";
ffmpeg.setFfmpegPath(ffmpegInstaller.path);
import { videoUpload } from "./controller/upload.controller.js";
import { upload } from "./multer.js";
const port =8000;
const app=express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.set("view engine","ejs");
const __dirname = path.resolve();
app.set("views",path.join(__dirname,"views"));
// app.use(rateLimitMiddleware);
app.use(express.static("videos"));
// app.use(express.static("images"));
// app.use(express.static("csv"));



app.get("/",(req,res)=>{
    res.render("index",{root:__dirname});
});

app.post("/upload",(req,res)=>{
    upload(req,res,(err)=>{
        // console.log(req.file) 
        if(req.file===undefined){
            return res.status(204).send("Please select a file");
        }
      const file=req.file;
    //   console.log(file);

    //  files.map((file)=>{
          if(file.mimetype==="video/mp4" || file.mimetype==="video/webm" || file.mimetype==="video/m4v" || file.mimetype==="video/mov"){
            videoUpload(file.buffer,file.originalname,req,res);
          
         }else{
            return res.json({message:"Only mp4 files are allowed"});
         }
        
     })
    // })
})

// app.get("/download/:fileName",(req,res)=>{

//     let fileName=req.params.fileName;

//     res.download(`videos/${fileName}`);
// })
 
app.listen(port,()=>{
    console.log(`Server is running on http://localhost:${port}`);
});

