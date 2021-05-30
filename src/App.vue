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
import { useBook, useLayoutPrompt } from '@/hooks';
import ModalManager from './components/ModalManager';
import HeaderControl from './views/CreateBook/HeadControl';
import { GETTERS } from './store/modules/book/const';
import { GETTERS as APP_GETTER } from './store/modules/app/const';

export default {
  components: {
    ModalManager,
    HeaderControl
  },
  setup() {
    const { checkSheetIsVisited } = useLayoutPrompt();
    const { getBook } = useBook();
    onMounted(() => getBook(ENV_CONFIG.BOOK_ID));
    return {
      getBook,
      checkSheetIsVisited
    };
  },
  computed: {
    ...mapGetters({
      pageSelected: GETTERS.GET_PAGE_SELECTED,
      isPrompt: APP_GETTER.IS_PROMPT
    }),
    isVisited() {
      const isVisited = this.checkSheetIsVisited(this.pageSelected);
      return isVisited;
    }
  }
};
</script>
