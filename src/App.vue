<template>
  <v-app>
    <ModalManager />
    <v-main>
      <HeaderControl />
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
import { onMounted } from '@vue/composition-api';

import { ENV_CONFIG } from '@/common/constants/config';
import { useBook } from '@/hooks';
import ModalManager from './components/ModalManager';
import HeaderControl from './views/CreateBook/HeadControl';

export default {
  components: {
    ModalManager,
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
