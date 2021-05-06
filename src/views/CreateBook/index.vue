<template>
  <!-- dummy style, resolve later -->
  <div style="height: 100%;">
    <HeaderControl />
    <router-view></router-view>
  </div>
</template>
<script>
import HeaderControl from './HeadControl';

export default {
  components: {
    HeaderControl
  }
};
</script>
<style lang=""></style>
