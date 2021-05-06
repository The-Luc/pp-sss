const dataHandler = response => ({
  data: response.data?.data || [],
  method: response.config.method,
  url: response.config.url
});

export default dataHandler;
