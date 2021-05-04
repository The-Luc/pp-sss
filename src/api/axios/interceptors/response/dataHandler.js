const dataHandler = data => ({
  data: data && data.data ? data.data.data : [],
  method: data.config.method,
  url: data.config.url
});

export default dataHandler;
