import React from 'react';
import Cropper from "./cropper"
import './upload.css';


const Upload = (props) => {
  const [highlight, setHighlight] = React.useState(false);
  const [preview, setPreview] = React.useState("");
  const [drop, setDrop] = React.useState(false);
  const [message, setMessage] = React.useState(false);

  const handleEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    preview === "" && setHighlight(true);
  };

  const handleOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    preview === "" && setHighlight(true);
  };

  const handleLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setHighlight(false);
  };

  const handleUpload = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const [file] = e.target.files || e.dataTransfer.files;

    if (!file) return;

    splitImage(file)
    .then((files) => {
      const leftHalfFile = files[0];
      const rightHalfFile = files[1];
      if (["image/jpeg", "image/png"].includes (file.type)) {
        setHighlight(false);
        setDrop(true);
        uploadFile(file);
        props.onChange(file, leftHalfFile, rightHalfFile); 
      }
      else {
        setMessage(true);
        setTimeout (()=>setMessage(false), 1000);
      } 
    })
    .catch((error) => {
      console.error(error);
    });
  };

  function uploadFile(file) {
    const reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = () => {
      const fileRes = btoa(reader.result);
      setPreview(`data:image/jpg;base64,${fileRes}`);
    };

    reader.onerror = () => {
      console.log("There is a problem while uploading...");
    };
  }

  function splitImage(imageFile) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
  
      reader.onload = function (e) {
        const img = new Image();
        img.src = e.target.result;
  
        img.onload = function () {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
  
          // Calculate the split position (halfway point)
          const splitPosition = Math.floor(img.width / 2);
  
          // Set canvas dimensions to fit left half
          canvas.width = splitPosition;
          canvas.height = img.height;
  
          // Draw left half on the canvas
          ctx.drawImage(img, 0, 0, splitPosition, img.height, 0, 0, splitPosition, img.height);
  
          // Create a file object for the left half
          canvas.toBlob(function (blob) {
            const leftHalfFile = new File([blob], 'left_half.jpg', { type: 'image/jpeg' });
  
            // Set canvas dimensions to fit right half
            canvas.width = img.width - splitPosition;
            canvas.height = img.height;
  
            // Draw right half on the canvas
            ctx.drawImage(img, splitPosition, 0, img.width - splitPosition, img.height, 0, 0, img.width - splitPosition, img.height);
  
            // Create a file object for the right half
            canvas.toBlob(function (blob) {
              const rightHalfFile = new File([blob], 'right_half.jpg', { type: 'image/jpeg' });
  
              // Resolve the promise with both files
              resolve([leftHalfFile, rightHalfFile]);
            }, 'image/jpeg');
          }, 'image/jpeg');
        };
      };
  
      // Read the image file as data URL
      reader.readAsDataURL(imageFile);
    });
  }

  const shownMessage = message ? "Only JPG and PNG formats are accepted" : "Drop image here";
  const shownElement = preview ? (<Cropper onChangeSelection={(file) => {
    splitImage(file)
    .then((files) => {
      const leftHalfFile = files[0];
      const rightHalfFile = files[1];
      props.onChange(file, leftHalfFile, rightHalfFile);
    })
    .catch((error) => {
      console.error(error);
    });
  }} src={preview} />) 
  : <p>{shownMessage}</p>; 

  return (
    <>
      <div
        onDragEnter={(e) => handleEnter(e)}
        onDragLeave={(e) => handleLeave(e)}
        onDragOver={(e) => handleOver(e)}
        onDrop={(e) => handleUpload(e)}
        className={`upload${
          highlight ? " is-highlight" : drop ? " is-drop" : ""
        }${message?" is-warned":""}`}

      >
          {shownElement}
        
          <div className="upload-button">
            <input id="elem"
              type="file"
              className="upload-file"
              accept="image/png, image/jpeg"
              onChange={(e) => handleUpload(e)}
            />
            <button className="button"></button>
          </div>
      </div>
    </>
  );
};

export default Upload;