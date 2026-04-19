export function formatStars(rating) {
  return `${'★'.repeat(rating)}${'☆'.repeat(5 - rating)}`
}
