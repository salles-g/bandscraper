function filter(path) {
  return path.replace(/[<>:"\/\\|?*]/g, '').replace(/\.$/, '');
}

module.exports = filter;
