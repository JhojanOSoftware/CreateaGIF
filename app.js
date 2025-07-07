const express = require('express'); //framework Express
const multer = require('multer'); // Importa Multer para manejo de archivos subidos
const path = require('path'); //ubicacion de archivos 
const { exec } = require('child_process'); // scripts externos 
const app = express(); 

// subir statics files 
app.use(express.static(path.join(__dirname, 'public')));

//con multer save files in the uploads 
const upload = multer({dest: 'uploads/'});

//path for html 
app.get('/index', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// manage the file uploads 
app.post('/upload', (req, res, next) => {
  // Verifica que el contenido sea multipart/form-data (necesario para archivos)
  const contentType = req.headers['content-type']  || '';
  if (contentType.includes('multipart/form-data')) {
    // Permite cualquier campo de archivo (images o video)
    upload.any()(req, res, next);
  } else {
    next();
  }
}, (req, res) => {
  // if file has been uploaded, process it
  const video = req.files.find(f => f.fieldname === 'video');
  if (video) {
    const videoF = video.path; //temporary path of the uploaded video
    const gifPath = path.join('results', `${video.filename}.gif`); // Ruta de salida del GIF
    // convert to gif with python
    const command = `python pypr/srcgif.py "${videoF}" "${gifPath}"`;  
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        return res.status(500).send('Error processing video');
      }
      // Envía el GIF generado como descarga al usuario
      res.download(gifPath, 'result.gif');
    });
    return;
  }
  // if it is not a video, check for images
  const imageFiles = req.files.filter(f => f.fieldname === 'images');
  if (imageFiles && imageFiles.length > 0) {
    // merge images into a GIF 
    const images = imageFiles.map(f => f.path).join(',');
    const gifPath = path.join('results', `${imageFiles[0].filename}.gif`);
    const command = `python pypr/srcgif.py "${images}" "${gifPath}"`;
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        return res.status(500).send('Error processing images');
      }
      // generado como descarga 
      res.download(gifPath, 'result.gif');
    });
    return;
  }
  // Si no se subió ningún archivo válido
  res.status(400).send('No files uploaded');
});

module.exports = app; //export to server.js