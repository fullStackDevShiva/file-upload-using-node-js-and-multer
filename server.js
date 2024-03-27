const express = require("express");
const multer = require("multer");
const path = require("path");
const uuid = require("uuid").v4;


const app = express();

/* multer - how to store the files*/

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    const { originalname } = file;
    cb(null, originalname); // stores the file with original name
    // cb(null, uuid()); // stores the file with uuid
    // cb(null, `${uuid()}-${originalname}`); // stores the file with uuid along with original name
  },
});

const upload = multer({ storage: storage }); // or simply ({storage}) or { dest: 'uploads/' }

app.use(express.static("public")); //default page to serve is index.html

/* multiple files upload */
app.post("/multipleFileUpload", upload.array("uploadFile"), (req, res) => {
  return res.json({ status: "OK", uploaded: req.files.length });
});

app.listen(3005, () => console.log("Server up and running on 3005..."));
