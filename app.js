const express = require('express');
const multer = require('multer');
const path = require('path');
const { exec } = require('child_process');
const app = express();

// Middleware para archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));
const upload = multer({dest: 'uploads/'});

// Ruta principal (sirve index.html automáticamente)
app.get('/index', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Ruta para subir video
app.post('/upload', (req, res,next ) => {
  const contentType = req.headers['content-type']  || '';
  if (contentType.includes ('multipart/form-data')) {
     upload.any()(req, res, next);
  } else {
    next();
  }
},(req, res) => {
  
  const video = req.files.find(f => f.fikename === 'video');
  if (video){
    const videoF = video.path;
    const gifPath = path.join('results', `${videoF.filename}.gif`);
    const command = `python pypr/srcgif.py "${videoF}" "${gifPath}"`;  
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      return res.status(500).send('Error processing video');
    }
    res.download(gifPath, 'result.gif');
  });
  return;
}
 // Si son imágenes
  const imageFiles = req.files.filter(f => f.fieldname === 'images');
  if (imageFiles && imageFiles.length > 0) {
    const images = imageFiles.map(f => f.path).join(',');
    const gifPath = path.join('results', `${imageFiles[0].filename}.gif`);
    const command = `python pypr/srcgif.py "${images}" "${gifPath}"`;
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        return res.status(500).send('Error processing images');
      }
      res.download(gifPath, 'result.gif');
    });
    return;
  }
  res.status(400).send('No files uploaded');
});

module.exports = app;