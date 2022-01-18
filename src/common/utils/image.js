export const modifyUrl = originalUrl => {
  if (originalUrl.includes('data:image')) return originalUrl;

  return `${originalUrl.split('?')[0]}?`;
};
