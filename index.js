const axios = require('axios');
const cheerio = require('cheerio');
// Utils
const {
  getAlbumInfo,
  downloadAlbumCover,
} = require('./src/utils/album');
const initFolders = require('./src/utils/folders');
const filter = require('./src/utils/path');
const { downloadTracks } = require('./src/utils/tracks');

async function init() {
  const url = process.argv[2];
  const { data } = await axios.get(url);
  const $ = cheerio.load(data);

  const info = JSON.parse(
    $('script[type="application/ld+json"]').html(),
  );

  const albumInfo = getAlbumInfo($, info);
  const path = albumInfo
    ? `dist/${filter(albumInfo.artist)}/${filter(albumInfo.title)}`
    : '';

  if (!path) return console.error('Album not found');

  initFolders(path);
  downloadAlbumCover(albumInfo.cover, path);

  const player = $('meta[property="twitter:player"]').attr('content');
  await downloadTracks(albumInfo, player);
}

init();
