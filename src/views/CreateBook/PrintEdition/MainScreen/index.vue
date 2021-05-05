<template>
  <div class="row">
    <div class="row col-12 thumbnail-view-row">
      <ThumbnailView />
      <ThumbnailView />
    </div>
  </div>
</template>
<script>
import ThumbnailView from './ThumbnailView';
export default {
  components: {
    ThumbnailView
  }
};
</script>
<style lang="scss" scoped src="./style.scss" />
