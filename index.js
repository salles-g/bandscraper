const axios = require('axios');
const cheerio = require('cheerio');
// Utils
const getInfo = require('./src/utils/info');
const filter = require('./src/utils/string/path');
const joinUrls = require('./src/utils/string/url');
const initFolders = require('./src/utils/folders');
const downloadAlbumCover = require('./src/download/album');
const { downloadTracks } = require('./src/download/tracks');

async function init($, json) {
  const info = getInfo($, json);
  const path = info
    ? `dist/${filter(info.artist)}/${filter(info.title)}`
    : '';

  if (!path) return console.error('Album not found');
  
  const player = $('meta[property="twitter:player"]').attr('content');
  if (!player) return 'Could not find player data';

  initFolders(path);
  await downloadAlbumCover(info.cover, path);

  await downloadTracks(info, player);
}

async function initBatch($, json, url) {
  await $('.music-grid-item').each(async (_, el) => {
    const relativeUrl = $(el).find('a').attr('href');
    const itemUrl = joinUrls(url, relativeUrl);
    const { data } = await axios.get(itemUrl);
    const cheer = cheerio.load(data);
    await init(cheer, json);
  });
}

async function main() {
  const url = process.argv[2];
  const { data } = await axios.get(url);
  const $ = cheerio.load(data);

  const json = JSON.parse(
    $('script[type="application/ld+json"]').html(),
  );

  if (!json) {
    console.log('Downloading all albums & singles...');

    await initBatch($, json, url);
  } else {
    console.log('Downloading one album/single...');

    await init($, json);
  }
}

main();
