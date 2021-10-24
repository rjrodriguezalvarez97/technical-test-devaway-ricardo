const TimeToSeconds = (timeString) => {
  const [hour, minutes, seconds] = timeString.split(':').map(parseFloat);

  return hour * 3600 + minutes * 60 + seconds;
};
const SecondsToTime = (seconds) => {
  const time = new Date(null);
  time.setMilliseconds(seconds * 1000);
  return time.toISOString().substr(11, 12);
};

module.exports = {
  TimeToSeconds,
  SecondsToTime
};
