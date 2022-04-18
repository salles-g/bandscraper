const axios = require('axios');
const cheerio = require('cheerio');
// Utils
const { getInfo, downloadAlbumCover } = require('./src/utils/album');
const initFolders = require('./src/utils/folders');
const filter = require('./src/utils/path');
const joinUrls = require('./src/utils/url.js');
const { downloadTracks } = require('./src/utils/tracks');

async function init($, json) {
  const info = getInfo($, json);
  const path = info
    ? `dist/${filter(info.artist)}/${filter(info.title)}`
    : '';

  if (!path) return console.error('Album not found');

  initFolders(path);
  downloadAlbumCover(info.cover, path);

  const player = $('meta[property="twitter:player"]').attr('content');
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
