const fs = require('fs');
const axios = require('axios');
const cheerio = require('cheerio');
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

function createWriteStream(folderName, fileName) {
  const folders = folderName.split('/');
  const [dist, artist, album] = folders;
  const paths = {
    distFolder: dist,
    artistFolder: `${dist}/${artist}`,
    albumFolder: `${dist}/${artist}/${album}`,
  };

  // check if path exists, otherwise create it
  Object.keys(paths).forEach((path) => {
    if (!fs.existsSync(paths[path])) {
      fs.mkdirSync(paths[path]);
    }
  });

  return fs.createWriteStream(`${folderName}/${fileName}`);
}

async function downloadTracks(info, url) {
  const tracks = await getTracksInfo(url);

  for (const track of tracks) {
    const { url, title, number, duration } = track;
    const fileName = `${title}.mp3`;

    console.log(`Downloading "${number}. ${fileName}" - ${duration}`);

    const file = createWriteStream(
      `./dist/${info.artist}/${info.title}`,
      fileName,
    );
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
}

module.exports = {
  getTracksInfo,
  downloadTracks,
};
