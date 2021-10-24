const TimeToSeconds = (timeString) => {
  const [hour, minutes, seconds] = timeString.split(':').map(parseFloat);

  return hour * 3600 + minutes * 60 + seconds;
};
const SecondsToTime = (seconds) => {
  const time = new Date(null);

  // 515.276 * 1000 = 515275.99999999994. Yikes. So we have to round it.
  const ms = (seconds * 1000).toFixed(3);
  time.setMilliseconds(ms);
  return time.toISOString().substr(11, 12);
};
const SortRanking = (ranking) => {
  const sorted = [...ranking];

  return sorted.sort((driverA, driverB) => {
    if (driverA.points > driverB.points) return -1;
    if (driverA.points < driverB.points) return 1;
    return 0;
  });
};

module.exports = {
  TimeToSeconds,
  SecondsToTime,
  SortRanking
};
