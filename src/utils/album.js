const fs = require('fs');
const axios = require('axios');
// Utils
const filter = require('./path');
const { convertTime } = require('./time');

function getAlbumInfoByJSON(json) {
  if (!json.track) return;

  return {
    title: json.name,
    artist: json.byArtist.name,
    year: json.datePublished.match(/[0-9]{4}/)[0],
    cover: json.image,
    tracks: json.track.itemListElement.map((track) => {
      return {
        number: track.position,
        title: track.item.name,
        duration: convertTime(track.item.duration),
      };
    }),
  };
}

function getAlbumInfoByDOM($) {
  function getTrackInfo($, el) {
    const number = $(el).find('.track_number').text().slice(0, -1);
    const title = $(el).find('.track-title').text().trim();
    const time = $(el).find('.time').text().trim();
    return {
      number,
      title,
      time,
    };
  }

  return {
    title: $('#name-section .trackTitle').text().trim(),
    artist: $('#name-section a').text(),
    year: $('.tralbum-credits').text().trim().slice(-4),
    cover: $('.popupImage img').attr('src'),
    tracks: $('.track_list tr')
      .map((_, el) => {
        return getTrackInfo($, el, dom);
      })
      .get(),
  };
}

function getAlbumInfo($, info) {
  return info ? getAlbumInfoByJSON(info) : getAlbumInfoByDOM($);
}

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

module.exports = { getAlbumInfo, downloadAlbumCover };
