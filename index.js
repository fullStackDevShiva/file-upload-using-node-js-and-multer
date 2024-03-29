import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import multer from "multer";

const app = express();
const port = 5001;

//For cross-origin verification - we can add more options
app.use(cors({ origin: "http://localhost:4200" }));
// app.use(cors());

app.use(express.json());

app.listen(port, () => {
  console.log("Server is running");
});

app.get("/", (req, res) => {
  res.send("Welcome to the server");
});

app.post("/upload-file", async (req, res, next) => {
  console.log(req.params);

  const storage = multer.diskStorage({
    destination: (req, file, callback) => {
      callback(null, "uploads");
    },
    filename: (req, file, callback) => {
      // callback(null, `${originalname}-${Math.floor(Math.random() * 100) + 1}`); // stores the file with original name
      // callback(null, uuid()); // stores the file with uuid
      // callback(null, `${uuid()}-${originalname}`); // stores the file with uuid along with original name
      callback(null, file.originalname);
    },
  });

  const maxSize = 2000 * 1024 * 1024; //2000MB
  // const maxSize = 180000; //180KB

  let fileFilter = function (req, file, callback) {
    var allowedMimes = [
      "text/plain",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/pdf",
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "audio/mpeg",
      "audio/wav",
      "audio/mp3",
      "video/mp4",
      "video/mpeg",
      "image/jpeg",
      "image/png",
    ];
    if (allowedMimes.includes(file.mimetype)) {
      callback(null, true);
    } else {
      callback(
        {
          success: false,
          message:
            "Invalid file type. Only txt, doc, pdf, ppt, jpg, png, mp3, mp4 files are allowed.",
          code: "INVALID_FILE_TYPE",
        },
        false
      );
      // console.log("File type not allowed!");
    }
  };

  let obj = {
    storage: storage,
    limits: { fileSize: maxSize },
    fileFilter: fileFilter,
  };

  // const upload = multer({ dest: "uploads/" }).single("file");
  // const upload = multer({ storage: storage }).single("file");
  const upload = multer(obj).single("file"); // upload.single('file')

  upload(req, res, (err) => {
    if (err) {
      if (err.code == "LIMIT_FILE_SIZE") {
        console.log("File size cannot be larger than 20MB!");
        return res.status(500).json({
          message: "File size cannot be larger than 20MB!",
          error: err,
        });
      }
      console.log("something went wrong, check the error message");
      console.log(err.message);
      res.status(500).json({
        message: "something went wrong, check the error message",
        error: err,
      });
    } else {
      if (!req.file) {
        console.log("File not selected!");
        res.status(500);
        res.json("file not found");
      }
      console.log(
        `Success! - Original file: ${req.file.originalname} - Stored as: ${req.file.filename}`
      );

      //   const insertedFile = new Topicfile({
      //     name: req.file.filename,
      //     file_path: req.file.destination,
      //   }).save();

      res.status(200).json({
        success: true,
        message: "File uploaded successfully!",
        file: req.file,
      });
    }
  });
});
