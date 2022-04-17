const axios = require('axios');
const cheerio = require('cheerio');
// Utils
const {
  getAlbumInfo,
  downloadAlbumCover,
} = require('./src/utils/album');
const initFolders = require('./src/utils/folders');
const { downloadTracks } = require('./src/utils/tracks');

async function init() {
  const url = process.argv[2];
  const { data } = await axios.get(url);
  const $ = cheerio.load(data);

  const info = JSON.parse(
    $('script[type="application/ld+json"]').html(),
  );

  const albumInfo = getAlbumInfo($, info);
  const path = `dist/${albumInfo.artist}/${albumInfo.title}`;

  initFolders(path);
  downloadAlbumCover(albumInfo.cover, path);

  const player = $('meta[property="twitter:player"]').attr('content');
  await downloadTracks(albumInfo, player);
}

init();
