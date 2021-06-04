<template>
  <v-app>
    <ModalManager />
    <v-main>
      <v-overlay :value="!isVisited && isPrompt"></v-overlay>

      <HeaderControl />
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
import { mapGetters } from 'vuex';
import { onMounted } from '@vue/composition-api';

import { ENV_CONFIG } from '@/common/constants/config';
import { useBook } from '@/hooks';
import ModalManager from './containers/ModalManager';
import HeaderControl from './views/CreateBook/HeadControl';
import { GETTERS } from './store/modules/book/const';
import { GETTERS as APP_GETTER } from './store/modules/app/const';

export default {
  components: {
    ModalManager,
    HeaderControl
  },
  setup() {
    const { getBook } = useBook();
    onMounted(() => getBook(ENV_CONFIG.BOOK_ID));
  },
  computed: {
    ...mapGetters({
      pageSelected: GETTERS.GET_PAGE_SELECTED,
      isPrompt: APP_GETTER.IS_PROMPT
    }),
    isVisited() {
      return this.pageSelected.isVisited;
    }
  }
};
</script>
