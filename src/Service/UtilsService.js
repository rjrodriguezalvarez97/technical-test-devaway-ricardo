const TimeToSeconds = (timeString) => {
  const [hour, minutes, seconds] = timeString.split(':').map(parseFloat);

  return hour * 3600 + minutes * 60 + seconds;
};
const SecondsToTime = (seconds) => {
  const time = new Date(null);

  // 515.276 * 1000 = 515275.99999999994. Yikes. So we have to round it.
  const ms = (seconds * 1000).toFixed();
  time.setMilliseconds(ms);
  return time.toISOString().substr(11, 12);
};

module.exports = {
  TimeToSeconds,
  SecondsToTime
};
