export function getLundi(d) {
  const date = new Date(d);
  const day = date.getDay();
  const diff = date.getDate() - (day === 0 ? 6 : day - 1);
  date.setDate(diff);
  date.setHours(0, 0, 0, 0);
  return date;
}
