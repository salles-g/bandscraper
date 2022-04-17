const ffmpeg = require('ffmpeg-static-electron');

const ffmetadata = require('ffmetadata');

function getMetadata(albumInfo, trackInfo) {
  return {
    album: albumInfo.title,
    artist: albumInfo.artist,
    year: albumInfo.year,
    title: trackInfo.title,
    track: trackInfo.number,
  };
}

function writeMetadata(albumInfo, trackInfo, path) {
  const metadata = getMetadata(albumInfo, trackInfo);

  ffmetadata.setFfmpegPath(ffmpeg.path);

  ffmetadata.write(path, metadata, (err) => {
    if (err) console.log('Error:', err);
  });
}

module.exports = writeMetadata;
