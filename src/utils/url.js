function joinUrls(url1, url2) {
  if (url1.slice(-1) === '/') {
    url1 = url1.slice(0, -1);
  }
  // if url1 ends in "/music", remove this part
  if (url1.match(/\/music$/)) {
    url1 = url1.slice(0, -6);
  }

  return url1 + url2;
}

module.exports = joinUrls;
