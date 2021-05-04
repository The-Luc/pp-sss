<template>
  <div>
    <HeaderControl />
    <router-view></router-view>
  </div>
</template>
<script>
import HeaderControl from "./HeadControl";

export default {
  components: {
    HeaderControl
  }
};
</script>
<style lang=""></style>
