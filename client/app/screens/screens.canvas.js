let ctx;
let canvas;
// let renderInterval;
let images = [];
// let displayImages = [];
// let currentImage = 0;
// const MAX_DISPLAY_IMAGES = 3;
// const SPEED = 30; // lower is faster

export function init(color, _images) {
  images = [...images, ..._images];
  canvas = document.getElementById('canvas');
  canvas.style.backgroundColor = color;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  ctx = canvas.getContext('2d');

  /* globalCompositeOperation :
    normal | multiply | screen | overlay | 
    darken | lighten | color-dodge | color-burn | hard-light | 
    soft-light | difference | exclusion | hue | saturation | 
    color | luminosity
  */
  ctx.globalCompositeOperation = 'multiply';

  // renderInterval = setInterval(animate, SPEED);
  // animate();
}

export function addImage(imagePath) {
  console.log('adding image:', imagePath);
  images = [...images, imagePath];

  // //magenta
  // ctx.fillStyle = 'rgb(255,0,255)';
  // ctx.beginPath();
  // ctx.arc(100, 100, 100, 0, Math.PI*2, true); 
  // ctx.closePath();
  // ctx.fill();

  // // //cyan
  // ctx.fillStyle = 'rgb(0,255,255)';
  // ctx.beginPath();
  // ctx.arc(200, 100, 100, 0, Math.PI*2, true); 
  // ctx.closePath();
  // ctx.fill();

  // // //yellow
  // ctx.fillStyle = 'rgb(255,255,0)';
  // ctx.beginPath();
  // ctx.arc(150, 200, 100, 0, Math.PI*2, true); 
  // ctx.closePath();
  // ctx.fill();
}

// function onLoad(image, newImage) {
//   let alpha = .4;
//   if(image === displayImages.slice(-1)[0]) {
//     alpha = 1;
//   }
//   ctx.save();
//   ctx.globalAlpha = alpha;
//   ctx.drawImage(newImage, 0, 0, canvas.width, canvas.height);
//   ctx.restore();
// }

// function animate() {
//   displayImages = [...displayImages, images[currentImage]];

//   if(displayImages.length > MAX_DISPLAY_IMAGES) {
//     displayImages.splice(0, 1);
//   }

//   ctx.clearRect(0, 0, canvas.width, canvas.height);

//   for(const image of displayImages) {
//     let newImage = new Image();
//     newImage.onload = onLoad(image, newImage);
//     newImage.src = image;
//   }

//   if(currentImage === images.length) {
//     currentImage = 0;
//   } else {
//     currentImage++;
//   }
//   requestAnimationFrame(animate);
// }

export function destroy() {
  // clearInterval(renderInterval);
}

