const express = require('express');
const multer = require('multer');
const upload = multer({dest: './uploads/'});
const { logger } = require('./winston.config.js');
const path = require('path');
const fs = require('fs');

const app = express(); 

const port = process.env.port || 3000;

app.use(express.static(path.join(__dirname, 'public')));

// multer upload middleware attaches the file upload to req.file
app.post('/submit', upload.single('file'), (req, res, next) => {
  const { file } = req;

  if (!file) {
    next('No file uploaded');
  } else {
    res.json({metadata: file});

    // delete file once the metadata is sent
    const filePath = path.join(__dirname, '/uploads', file.filename);
    fs.unlinkSync(filePath);
  }
});

// handle errors
app.use('/submit', function (err, req, res, next) {
  logger.log('warn', err);
  res.status(500).json({err});
})

app.listen(port, () => {
  logger.log('info', `Listening on port ${port}`);
});