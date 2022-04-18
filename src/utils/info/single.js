function getSingleInfo(json) {
  const date =
    json?.datePublished || json?.dateModified || json?.dateCreated;
  return {
    title: json.name,
    artist: json.byArtist.name,
    year: date.match(/[0-9]{4}/)[0],
    cover: json.image,
    tracks: [
      {
        number: 1,
        title: json.name,
        duration: json.duration,
      },
    ],
  };
}

module.exports = getSingleInfo;
