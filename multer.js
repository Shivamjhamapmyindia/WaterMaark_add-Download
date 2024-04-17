import multer from "multer";

// const storage = multer.diskStorage({
    
//     destination: (req, file, cb) => {
//         console.log(file);
//         if (file.mimetype === "video/mp4") {
            
//             return cb(null, "videos");
//         }
//         else if (file.mimetype === "image/png") {
//             return cb(null, "images");
//         }
//         else if(file.mimetype==="test/csv"){
//             return cb(null, "csv");
//         }
        
//     },
//     filename: (req, file, cb) => {
//       if(file.mimetype==="video/mp4"){
//         return cb(null, file.originalname + ".mp4");
//       }
//       else if(file.mimetype==="image/png"){
//         return cb(null, file.originalname + ".png");
//       }
//       else if(file.mimetype==="text/csv"){
//         return cb(null, file.originalname + ".csv");
//       }
//     },
// });
const storage = multer.memoryStorage({
    fileFilter: (req, file, cb) => {
        console.log(file);
        if (file.mimetype === "video/mp4" || file.mimetype === "image/png" || file.mimetype==="text/csv") {
            cb(null, true);
        } else {
            cb(null, false);
        }
    }
});
const upload = multer({ storage: storage }).single("file");

export {upload}