module.exports = {
  css: {
    loaderOptions: {
      sass: {
        additionalData: `
        @import "@/scss/_variables.scss";
        @import "@/scss/_functions.scss";
        @import "@/scss/_extends.scss";
        @import "@/scss/_mixins.scss";
        `
      }
    }
  }
};
