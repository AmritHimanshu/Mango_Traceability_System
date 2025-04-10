function getRelativeTime(date) {
  const now = new Date();
  const diff = (now - new Date(date)) / 1000;

  const units = [
    { max: 60, value: 1, name: "second" },
    { max: 3600, value: 60, name: "minute" },
    { max: 86400, value: 3600, name: "hour" },
    { max: 604800, value: 86400, name: "day" },
    { max: 2592000, value: 604800, name: "week" },
    { max: 31536000, value: 2592000, name: "month" },
    { max: Infinity, value: 31536000, name: "year" },
  ];

  for (const unit of units) {
    if (diff < unit.max) {
      const value = Math.floor(diff / unit.value);
      const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
      return rtf.format(-value, unit.name);
    }
  }

  return new Date(date).toLocaleString("en-IN");
}

module.exports = { getRelativeTime };