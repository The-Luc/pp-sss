<template>
  <!-- dummy style, resolve later -->
  <div style="height: 100%;">
    <HeaderControl />
    <router-view></router-view>
  </div>
</template>
<script>
import { onMounted } from '@vue/composition-api';

import { ENV_CONFIG } from '@/common/constants/config';
import HeaderControl from './HeadControl';
import { useBook } from '@/hooks';

export default {
  components: {
    HeaderControl
  },
  setup() {
    const { getBook } = useBook();
    onMounted(() => getBook(ENV_CONFIG.BOOK_ID));
    return {
      getBook
    };
  }
};
</script>
<style lang=""></style>
