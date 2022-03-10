export const modifyUrl = originalUrl => {
  if (originalUrl.includes('data:image')) return originalUrl;

  return `${originalUrl.split('?')[0]}?`;
};

export const convertToHttp = url => {
  const encodingUrlPrefix = 'https://fms.production.s3.amazonaws.com';
  if (!url.includes(encodingUrlPrefix)) return url;

  return 'http' + url.substring(5);
};
