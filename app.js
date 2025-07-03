const express = require('express');
const multer = require('multer');
const path = require('path');
const app = express();

// Middleware para archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Configuración de multer para subir archivos
const upload = multer({ dest: 'uploads/' });

// Ruta principal (sirve index.html automáticamente)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Ruta para subir video
app.post('/upload', upload.single('video'), (req, res) => {
   const video = req.file.path;
   const gifPath = path.join('results', `${req.file.filename}.gif`);
   const command = ' python pypr/videoGift.py ' + video + ' ' + gifPath;
   exec(command, (error, stdout, stderr) => {
     if (error) {
       console.error(`Error: ${error.message}`);
       return res.status(500).send('Error processing video');
     }
     res.download(gifPath, 'result.gif')
   });
});

module.exports = app;