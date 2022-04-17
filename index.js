const axios = require('axios');
const cheerio = require('cheerio');
// Utils

const {
  getAlbumInfoByJSON,
  getAlbumInfoByDOM,
} = require('./src/utils/album');
const { downloadTracks } = require('./src/utils/tracks');

const url = 'https://blvk.bandcamp.com/album/memoir';

async function getAlbumInfo() {
  const { data } = await axios.get(url);
  const $ = cheerio.load(data);

  const info = JSON.parse(
    $('script[type="application/ld+json"]').html(),
  );

  const albumInfo = info
    ? getAlbumInfoByJSON(info)
    : getAlbumInfoByDOM($);

  const player = $('meta[property="twitter:player"]').attr('content');
  await downloadTracks(albumInfo, player);
}

getAlbumInfo();
