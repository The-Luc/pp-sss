export const getUniqueUrl = originalUrl => {
  return `${originalUrl}?d=${Date.now()}`;
};
