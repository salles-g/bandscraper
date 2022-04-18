const { getAlbumInfoByJSON, getAlbumInfoByDOM } = require('./album');
const getSingleInfo = require('./single');

function getInfo($, info) {
  if (info?.inAlbum?.albumReleaseType === 'SingleRelease') {
    return getSingleInfo(info);
  }

  return info ? getAlbumInfoByJSON(info) : getAlbumInfoByDOM($);
}

module.exports = getInfo;
