function convertTime(time) {
  const [hours, minutes, seconds] = time.match(/[0-9]{2}/g);
  return hours === '00'
    ? `${minutes}:${seconds}`
    : `${hours}:${minutes}:${seconds}`;
}

function convertSeconds(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secondsLeft = Math.floor(seconds % 60);

  function fill(num) {
    return num < 10 ? `0${num}` : num;
  }

  return `${fill(minutes)}:${fill(secondsLeft)}`;
}

module.exports = { convertTime, convertSeconds };
