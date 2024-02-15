const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const app = express();
const dotenv = require("dotenv").config();
const PORT = process.env.PORT || 5000;
const fs = require("fs");
const FileModel = require("./model/FileModel");


// cors setup
app.use(cors());

// MongoDB connection
mongoose.connect('mongodb://127.0.0.1:27017/drag-and-drop-upload').then(() => { console.log("connection successfull ") }).catch((err) => { console.log("error in connection :" + err) });



// Multer setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static('uploads'));

// Handle file upload

app.post('/upload', upload.single('file'), async (req, res) => {
  if (req.file) {
    const { filename, originalname, mimetype, size } = req.file;

    // Save file details to MongoDB
    try {
      const newFile = new FileModel({
        filename,
        originalname,
        mimetype,
        size,
      });

      await newFile.save();

      res.json({ success: true, message: 'File uploaded successfully' });
      console.log("successful upload file")
    }
    catch (error) {
      console.error('Error saving file details to MongoDB:', error);
      res.json({ success: false, message: 'File upload failed' });
    }
  }
  else {
    res.json({ success: false, message: 'File upload failed' });
  }
});


// Get a list of all files
app.get('/files', async (req, res) => {
  try {
    const files = await FileModel.find({}, 'filename originalname size createdAt');
    res.json(files);
  } catch (error) {
    console.error('Error fetching files from MongoDB:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete a file by ID
app.delete('/files/:id', async (req, res) => {
  const fileId = req.params.id;

  try {
    const file = await FileModel.findByIdAndDelete(fileId);

    if (file) {
      res.json({ success: true, message: 'File deleted successfully' });
    } else {
      res.status(404).json({ success: false, message: 'File not found' });
    }
  } catch (error) {
    console.error('Error deleting file from MongoDB:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// download file 
app.get('/download/:filename', async (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, 'uploads', filename);

    if (fs.existsSync(filePath)) {
      res.download(filePath, filename);
    } else {
      res.status(404).json({ error: 'File not found' });
    }
  } catch (error) {
    console.error('Error downloading file:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});




