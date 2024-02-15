const mongoose = require('mongoose');

// Definining the schema for the File model
const fileSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true,
  },
  originalname: {
    type: String,
    required: true,
  },
  mimetype: {
    type: String,
    required: true,
  },
  size: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create the File model using the schema
const FileModel = mongoose.model('File', fileSchema);

module.exports = FileModel;
