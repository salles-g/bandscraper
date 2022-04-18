const fs = require('fs');
const axios = require('axios');
const filter = require('../utils/string/path');

async function downloadAlbumCover(url, path) {
  console.log('Downloading album cover...');
  const filteredPath = path
    .split('/')
    .map((path) => filter(path))
    .join('/');

  const file = fs.createWriteStream(`${filteredPath}/cover.jpg`);
  const response = await axios({
    url,
    method: 'GET',
    responseType: 'stream',
  });

  response.data.pipe(file);

  await new Promise((resolve, reject) => {
    file.on('finish', resolve);
    file.on('error', reject);
  });
}

module.exports = downloadAlbumCover;
