import React from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import './cropper.css';

export default function Cropper({ src, onChangeSelection }) {
  const fullSelection = {
                        unit: '%', 
                        x: 0,
                        y: 0,
                        width: 100,
                        height: 100
                      };

  const [crop, setCrop] = React.useState(fullSelection); // <Crop>()

  function getCroppedImg(image, pixelCrop) {
    const canvas = document.createElement('canvas');
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;
    const ctx = canvas.getContext('2d');

    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob(blob => {
        var file = new File([blob], "temp.jpg", new Date());
        resolve(onChangeSelection(file));
      }, 'image/jpeg');
    });
  }

  function calcRealDimensions (pc) {
    return new Promise ((resolve, reject) => {
      var i = new Image()
      i.onload = () => {
        const realDimensions = { 
          x: i.width * pc.x / 100,
          y: i.height * pc.y / 100,
          width: i.width * pc.width / 100,
          height: i.height * pc.height / 100
        }
        resolve ( 
          getCroppedImg(document.getElementById(src.substr(src.length - 10)), realDimensions)
        )
      };
      i.src = src;
    })
  }

  return (
    <ReactCrop className='upload-img' crop={crop} 
      onChange={(_, percentCrop) => setCrop(percentCrop)}
      onComplete={(_, pc) => {
        calcRealDimensions(pc);
      }}>
      <img id={src.substr(src.length - 10)} src={src} />
    </ReactCrop>
  )
}