
import React from 'react';
import FileDropZone from './ImageUpload';
const App = () => {
  const handleImageUpload = (imageData) => {
    console.log('Image uploaded:', imageData);
  };

  return (
    <div>
      <center><h1 style={{color:"orange"}}> Drag & Drop Image Upload</h1></center>
      <FileDropZone onImageUpload={handleImageUpload} />
    </div>
  );
};

export default App;
