export const getUniqueUrl = originalUrl => {
  if (originalUrl.includes('data:image')) return originalUrl;

  return `${originalUrl}?d=${Date.now()}`;
};
