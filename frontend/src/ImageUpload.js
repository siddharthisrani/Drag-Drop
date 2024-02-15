import "./css/ImageUpload.css"
import axios from "axios";
import React, { useState, useEffect } from 'react';
import { FaCamera } from "react-icons/fa";

const FileDropZone = () => {
  const [selectedFile, setSelectedFile] = useState();
  const [files, setFiles] = useState([]);

  useEffect(() => {
    // Fetch the list of files on component mount
    const fetchFiles = async () => {
      try {
        const response = await axios.get('http://localhost:8000/files');
        setFiles(response.data);
      } catch (error) {
        console.error('Error fetching files:', error);
      }
    };

    fetchFiles();
  }, [files]);

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };
  const handleDragOver = (e) => {
    e.preventDefault();
  };
  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setSelectedFile(file);
    }
  };

  // handle submit image  
  const handleFileUpload = async () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append('file', selectedFile);

      try {
        const response = await axios.post('http://localhost:8000/upload', formData);
        console.log(response.data.message);
        alert(response.data.message);
        setSelectedFile("");
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }
  };

  // dawonload handle

  const handleFileDownload = (filename) => {

    fetch(`http://localhost:8000/download/${filename}`)
    .then(response => response.blob())
    .then(blob => {
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    })
    .catch((error) => {
      console.error('Error', error);
    });
    
    

  };

  const handleFileDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/files/${id}`);
      // Refresh the list of files after deleting
      const response = await axios.get('http://localhost:3001/files');
      setFiles(response.data);
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  };


  return (
    <>
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className='dragheadline'
      >
        {selectedFile ? (
          <div>
            <p>Your File: {selectedFile.name} Size: {selectedFile.size} bytes  </p>
          </div>
        ) : (
          <div>
            <p>Drag and drop a file here</p>
            <label for="inp">Select Image <br/><FaCamera style={{width:"40px",height:"40px"}}/>
            <input id="inp"  type="file" style={{color:"red",display:"none"}} onChange={handleFileChange} /></label>
          </div>
        )}
        <button className="uploadbutton" onClick={handleFileUpload}>Upload</button>
      </div>


      <div>
        <div style={{ marginTop: '20px' }}>
          <h2>Uploaded Files</h2>
          <ol className="mappingimages">
            {files.map((file) => (
              <li key={file._id}>

                {file.originalname} - {file.size} bytes - {new Date(file.createdAt).toLocaleString()}
                <br />
                <button onClick={() => handleFileDownload(file.filename)}>Download</button>
                <button style={{backgroundColor:"red"}} onClick={() => handleFileDelete(file._id)}>Delete</button>


              </li>
            ))}
          </ol>
        </div>
      </div>

    </>
  );

};

export default FileDropZone;










