const axios = require('axios');
const cheerio = require('cheerio');
const { convertSeconds } = require('../string/time');

async function getTracksInfo(url) {
  const { data } = await axios.get(url);
  const $ = cheerio.load(data);
  const json = JSON.parse(
    $('script[data-player-data]').attr('data-player-data'),
  );

  const tracks = json.tracks.map((track) => ({
    url: track.file['mp3-128'],
    title: track.title,
    number: track.tracknum + 1,
    duration: convertSeconds(track.duration),
  }));

  return tracks;
}

module.exports = getTracksInfo;
