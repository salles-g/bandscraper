const fs = require('fs');
const filter = require('./path');

function initFolders(folderName) {
  const folders = folderName.split('/').map((path) => filter(path));
  const [dist, artist, album] = folders;
  const paths = {
    distFolder: dist,
    artistFolder: `./${dist}/${artist}`,
    albumFolder: `./${dist}/${artist}/${album}`,
  };

  console.log('Creating path ' + folders.join('/'));

  // check if path exists, otherwise create it
  Object.keys(paths).forEach((path) => {
    if (!paths[path]) throw new Error('Path not found!');

    if (!fs.existsSync(paths[path])) {
      fs.mkdirSync(paths[path]);
    }
  });
}

module.exports = initFolders;
