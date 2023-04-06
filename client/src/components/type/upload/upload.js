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

    if (["image/jpeg", "image/png"].includes (file.type)) {
      setHighlight(false);
      setDrop(true);

      uploadFile(file);
      props.onChange(file);
    }
    else {
      setMessage(true);
      setTimeout (()=>setMessage(false), 1000);
    } 
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

  const shownMessage = message ? "Only JPG and PNG formats are accepted" : "Drop image here";
  const shownElement = preview ? (<Cropper onChangeSelection={(file) => {
                                    props.onChange(file);
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