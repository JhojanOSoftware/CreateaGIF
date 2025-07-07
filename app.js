const express = require('express'); //framework Express
const multer = require('multer'); // Importa Multer para manejo de archivos subidos
const path = require('path'); //ubicacion de archivos 
const { exec } = require('child_process'); // scripts externos 
const app = express(); 
const fs = require('fs');

// Asegura que la carpeta 'results' exista
const resultsDir = path.join(__dirname, 'results');
if (!fs.existsSync(resultsDir)) {
  fs.mkdirSync(resultsDir);
}

// subir statics files 
app.use(express.static(path.join(__dirname, 'public')));

// Multer con extensión original
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + Date.now() + ext);
  }
});
const upload = multer({ storage: storage });

//path for html 
app.get('/index', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// manage the file uploads 
app.post('/upload', (req, res, next) => {
  const contentType = req.headers['content-type']  || '';
  if (contentType.includes('multipart/form-data')) {
    upload.any()(req, res, next);
  } else {
    next();
  }
}, (req, res) => {
  // if file has been uploaded, process it
  const video = req.files.find(f => f.fieldname === 'video');
  const gifPath = path.join('results', 'output.gif'); // SIEMPRE output.gif

  if (video) {
    const videoF = video.path; //temporary path of the uploaded video
    const command = `python pypr/srcgif.py "${videoF}" "${gifPath}"`;  
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        console.error(`stderr: ${stderr}`);
        return res.status(500).send('Error processing video');
      }
      if (stderr) console.error(`stderr: ${stderr}`);
      if (stdout) console.log(`stdout: ${stdout}`);
      // Espera a que el archivo exista antes de descargar
      fs.access(gifPath, fs.constants.F_OK, (err) => {
        if (err) {
          console.error('GIF not found:', gifPath);
          return res.status(500).send('GIF not generated');
        }
        res.download(gifPath, 'output.gif');
      });
    });
    return;
  }
  // if it is not a video, check for images
  const imageFiles = req.files.filter(f => f.fieldname === 'images');
  if (imageFiles && imageFiles.length > 0) {
    const images = imageFiles.map(f => f.path).join(',');
    const command = `python pypr/srcgif.py "${images}" "${gifPath}"`;
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        console.error(`stderr: ${stderr}`);
        return res.status(500).send('Error processing images');
      }
      if (stderr) console.error(`stderr: ${stderr}`);
      if (stdout) console.log(`stdout: ${stdout}`);
      fs.access(gifPath, fs.constants.F_OK, (err) => {
        if (err) {
          console.error('GIF not found:', gifPath);
          return res.status(500).send('GIF not generated');
        }
        res.download(gifPath, 'output.gif');
      });
    });
    return;
  }
  res.status(400).send('No files uploaded');
});

module.exports = app;