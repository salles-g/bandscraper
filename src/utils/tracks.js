const fs = require('fs');
const axios = require('axios');
const stream = require('stream');
const cheerio = require('cheerio');
// Utils
const filter = require('./path');
const writeMetadata = require('./metadata');
const { convertSeconds } = require('./time');

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

async function downloadTracks(info, url) {
  const tracks = await getTracksInfo(url);

  for (const track of tracks) {
    const { url, title, number, duration } = track;
    const fileName = `${title}.mp3`;
    const filteredPath = `dist/${filter(info.artist)}/${filter(
      info.title,
    )}/${filter(fileName)}`;

    console.log(`Downloading "${number}. ${fileName}" - ${duration}`);

    const file = fs.createWriteStream(filteredPath);
    const response = await axios({
      url,
      method: 'GET',
      responseType: 'stream',
    });

    await response.data.pipe(file);

    await stream.finished(file, function (error) {
      if (error) {
        console.error('Stream failed.', error);
      } else {
        writeMetadata(info, track, filteredPath);
      }
    });

    await new Promise((resolve, reject) => {
      file.on('finish', resolve);
      file.on('error', reject);
    });
  }
}

module.exports = {
  getTracksInfo,
  downloadTracks,
};
